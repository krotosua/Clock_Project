const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const {User, Order} = require("../models/models");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const MailService = require("../service/mailService")
const uuid = require("uuid")

const generateJwt = (id, email, role, isActivated) => {
    return jwt.sign(
        {id, email, role, isActivated},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserLogic {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {email, password, role} = req.body
            if (!email || !password) {
                return next(ApiError.badRequest({message: 'Incorrect email or password'}))
            }
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
            await MailService.sendActivationMail(email, `${process.env.API_URL}api/users/activate/${activationLink}`)
            const token = generateJwt(user.id, user.email, user.role, user.isActivated)
            return res.status(201).json({token})
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
            return res.json({token})
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

    async getAll(req, res, next) {
        try {
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let users
            users = await User.findAndCountAll({
                attributes: ["email", "id", "role"]
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
                include: Order,
                attributes: ["id"]
            })
            if (user.orders.length == 0) {
                await user.destroy()
                return res.status(204).json({message: "success"})
            } else {
                return next(ApiError.Conflict({message: "Clock has orders"}))
            }
            return res.status(204).json({message: "success"})
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