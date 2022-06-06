const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const {User, Order, Master} = require("../models/models");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const MailService = require("../service/mailService")
const uuid = require("uuid")
const masterController = require("../controllers/masterController")
const sequelize = require("../db");

const generateJwt = (id, email, role, isActivated) => {
    return jwt.sign(
        {id, email, role, isActivated},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserLogic {
    async registration(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {

            const result = await sequelize.transaction(async () => {
            const {email, password,isMaster} = req.body
            let role = isMaster?"MASTER":"USER"
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                if (candidate.password !== null) {
                    return next(ApiError.badRequest({message: 'User with this email already exists'}))
                } else {
                    await this.update(candidate, password)
                    const token = generateJwt(candidate.id, candidate.email, candidate.role)
                    return res.json({token})
                }
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const activationLink = uuid.v4()
            const user = await User.create({email, role, password: hashPassword, activationLink})
            if(isMaster){
                req.body.userId=user.id
                await masterController.create(req,res,next)
            }
            await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`)
            const token = generateJwt(user.id, user.email, user.role, user.isActivated)
            return res.status(201).json({token})
        })
        return result
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async registrationFromAdmin(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {email, password,isMaster,isActivated} = req.body
            let role = isMaster?"MASTER":"USER"
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                if (candidate.password !== null) {
                    return next(ApiError.badRequest({message: 'User with this email already exists'}))
                }else {
                    await this.update(candidate, password)
                    const token = generateJwt(candidate.id, candidate.email, candidate.role)
                    return res.json({token})
                }
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, role, password: hashPassword, isActivated})
            if(isMaster){
                req.body.userId=user.id
                await masterController.create(req,res,next)
            }
            return res.status(201).json({user})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async GetOrCreateUser(req, res, next,) {
        try {
            let {email} = req.body
            if (!email) {
                throw new Error('Email is wrong')
            }
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return candidate
            }
            const user = await User.create({email})
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
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.NotFound({message: 'User with this name not found'}))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.Unauthorized({message: 'Wrong password'}))
            }
            const token = generateJwt(user.id, user.email, user.role, user.isActivated)

            return res.status(201).json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role,req.user.isActivated)
        return res.status(200).json({token})
    }

    async update(user, password) {
        const hashPassword = await bcrypt.hash(password, 5)
        await user.update({password: hashPassword})

    }

    async updateUser(req, res,next) {
        try {
            const {userId} = req.params
            const {email, password} = req.body
            const user = await User.findOne({where: {id: userId}})
            await user.update({
                email: email,
                password: password,
            })
            return res.status(201).json({user})
        } catch (e) {
            return next(ApiError.badRequest( "Wrong request"))
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
                attributes: ["email", "id", "role"],
                include:{
                    model:Master
                }
                , limit, offset
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
                where: {id: userId},
                include: [{model:Order},

                    {model:Master,
                        attributes: ["id"],
                    include: {model:Order,
                        attributes: ["id"]}},],
                attributes: ["id","role"]
            })

            if (user.role=="USER"&&user.orders.length == 0||
                user.role=="MASTER"&&user.master.orders.length == 0) {
                await user.destroy()
                return res.status(204).json({message: "success"})
            } else {
                return next(ApiError.Conflict( "User has orders"))
            }
            return res.status(204).json( "success")
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
}


module.exports = new UserLogic()