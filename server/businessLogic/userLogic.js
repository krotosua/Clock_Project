const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const {User, Order, Master, Customer} = require("../models/models");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const MailService = require("../service/mailService")
const uuid = require("uuid")
const masterController = require("../controllers/masterController")
const sequelize = require("../db");

const generateJwt = (id, email, role, isActivated, name) => {
    return jwt.sign({id, email, role, isActivated, name}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserLogic {
    async registration(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                const {email, password, isMaster, name} = req.body
                let role = isMaster ? "MASTER" : "CUSTOMER"
                const candidate = await User.findOne({where: {email}})
                if (candidate) {
                    if (candidate.password !== null) {
                        return next(ApiError.badRequest({message: 'User with this email already exists'}))
                    }
                    await Customer.create({userId: candidate.id, name: name})
                    const hashPassword = await bcrypt.hash(password, 5)
                    const activationLink = uuid.v4()
                    await candidate.update({password: hashPassword, activationLink, role})
                    await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next)
                    return res.status(201).json(candidate)
                }
                const hashPassword = await bcrypt.hash(password, 5)
                const activationLink = uuid.v4()
                const user = await User.create({email, role, password: hashPassword, activationLink})
                if (isMaster) {
                    req.body.userId = user.id
                    await masterController.create(req, res, next)
                } else {
                    await Customer.create({userId: user.id, name})
                }
                await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`, next)
                return res.status(201).json({user})
            })
            return result
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async registrationFromAdmin(req, res, next) {

        try {
            req.body.isActivated = true
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const result = await sequelize.transaction(async () => {
                const {email, password, isMaster, name, isActivated} = req.body
                let role = isMaster ? "MASTER" : "CUSTOMER"
                const candidate = await User.findOne({where: {email}})
                if (candidate) {
                    if (candidate.password !== null) {
                        return next(ApiError.badRequest('User with this email already exists'))
                    } else {
                        await this.update(candidate, password)
                        const token = generateJwt(candidate.id, candidate.email, candidate.role)
                        return res.json({token})
                    }
                }
                const hashPassword = await bcrypt.hash(password, 5)
                const user = await User.create({email, role, password: hashPassword, isActivated})
                if (isMaster) {
                    req.body.userId = user.id
                    await masterController.create(req, res, next)
                } else {
                    await Customer.create({userId: user.id, name})
                }
                return res.status(201).json({user})
            })
            return result
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async GetOrCreateUser(req) {
        try {
            let {email, name, regCustomer, changeName} = req.body
            const candidate = await User.findOne({where: {email}})

            if (candidate) {
                if (changeName && candidate.password !== null) {
                    const customer = await Customer.findOne({where: {userId: candidate.id}})
                    await customer.update({name: name})
                } else if (!regCustomer) {
                    return candidate
                }
            }
            let user
            if (regCustomer) {
                const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const passwordLength = 8;
                let password = "";
                for (let i = 0; i <= passwordLength; i++) {
                    const randomNumber = Math.floor(Math.random() * chars.length);
                    password += chars.substring(randomNumber, randomNumber + 1);
                }
                const hashPassword = await bcrypt.hash(password, 5)
                req.body.password = password
                if (candidate) {
                    user = await candidate.update({password: hashPassword, isActivated: true})
                } else {
                    user = await User.create({email, password: hashPassword, isActivated: true})
                }
                await Customer.create({userId: user.id, name})
            } else {
                user = await User.create({email})
            }
            return user
        } catch (e) {
            throw new Error('Email is wrong')
        }
    }


    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {email, password} = req.body
            const user = await User.findOne({
                where: {email},
                include: [{
                    model: Master,
                    attributes: ["name"]
                }, {
                    model: Customer,
                    attributes: ["name"]
                }]
            })

            if (!user) {
                return next(ApiError.NotFound({message: 'Customer with this name not found'}))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.Unauthorized({message: 'Wrong password'}))
            }
            let token
            if (user.master !== null) {
                token = generateJwt(user.id, user.email, user.role, user.isActivated, user.master.name)
            } else if (user.customer !== null) {
                token = generateJwt(user.id, user.email, user.role, user.isActivated, user.customer.name)
            } else {
                token = generateJwt(user.id, user.email, user.role, user.isActivated)
            }


            return res.status(201).json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.isActivated, req.user.name)
        return res.status(200).json({token})
    }

    async checkEmail(req, res) {
        const {email} = req.query
        const user = await User.findOne({where: {email: email}})
        if (!user || user.password == null) {
            return res.status(204).send({message: "204"})
        }
        return res.status(200).json({user})
    }

    async update(user, password, role) {
        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()

        await user.update({password: hashPassword, activationLink, role})

    }

    async updateUser(req, res, next) {
        try {
            const {userId} = req.params
            const {email, password} = req.body
            const user = await User.findOne({where: {id: userId}})
            let hashPassword
            if (password) {
                hashPassword = await bcrypt.hash(password, 5)
            }
            await user.update({
                email: email, password: hashPassword,
            })
            await MailService.updateMail(email, password, next)
            return res.status(201).json({user})
        } catch (e) {
            return next(ApiError.badRequest("Wrong request"))
        }
    }

    async adminreg(req, res, next) {
        try {
            const {email, password, role} = req.body
            let isActivated = true
            const hashPassword = await bcrypt.hash(password, 5)

            const user = await User.create({email, role, password: hashPassword, isActivated})

            return res.status(201).json({user})

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async getAll(req, res, next) {
        try {
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let users
            users = await User.findAndCountAll({
                attributes: ["email", "id", "role", "isActivated"], include: [{
                    model: Master
                },], limit, offset
            })
            if (!users.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(users)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const {userId} = req.params
            const user = await User.findOne({
                where: {id: userId}, include: [{model: Order},

                    {
                        model: Master, attributes: ["id"], include: {
                            model: Order, attributes: ["id"]
                        }
                    },], attributes: ["id", "role"]
            })
            if (user.role === "CUSTOMER" && user.orders.length === 0 || user.role === "MASTER" && user.master.orders.length === 0) {
                await user.destroy()
                return res.status(204).json({message: "success"})
            } else {
                return next(ApiError.Conflict("Customer has orders"))
            }
            return res.status(204).json("success")
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            const user = await User.findOne({where: {activationLink}})
            if (!user) {
                throw new Error('Wrong link')
            }
            user.isActivated = true
            await user.save()
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async activateAdmin(req, res, next) {
        try {
            const {userId} = req.params
            const {isActivated} = req.body
            const user = await User.findOne({where: {id: userId}})
            await user.update({
                isActivated: isActivated,
            })
            return res.status(201).json(user)
        } catch (e) {
            return next(ApiError.badRequest({message: "Wrong request"}))
        }
    }
}


module.exports = new UserLogic()