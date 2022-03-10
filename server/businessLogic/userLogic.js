const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const {User} = require("../models/models");
const bcrypt = require("bcrypt");

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '10h'}
    )
}

class UserLogic {
    async registration(req, res, next) {
        try {

            const {email, password, role} = req.body
      
            if (!email || !password) {
                return next(ApiError.badRequest('Incorrect email or password'))
            }
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
            const user = await User.create({email, role, password: hashPassword})
            const token = generateJwt(user.id, user.email, user.role)
            return res.status(201).json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async GetOrCreateUser(req, res, next) {
        try {
            const {email} = req.body
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
            next(ApiError.badRequest(e.message))
        }
    }


    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.NotFound('User with this name not found'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.Unauthorized('Wrong password'))
            }
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
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
            users = await User.findAndCountAll({limit, offset})
            if (!users.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(users)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.body
            const user = await User.findOne({where: id})
            await user.destroy({onDelete: "cascade"})
            return res.status(204).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}


module.exports = new UserLogic()