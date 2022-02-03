const jwt = require("jsonwebtoken");
const {validationResult, body} = require("express-validator");
const ApiError = require("../error/ApiError");
const {User} = require("../models/models");
const bcrypt = require("bcrypt");

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserLogic {
    async registration(req, res, next) {
        try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или пароль'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            if (candidate.password !== null) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            } else if (candidate.password == null) {
                await this.update(candidate,candidate.password)
                const token = generateJwt(candidate.id, candidate.email, candidate.role)
                return res.json({token})
            }
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})}catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async GetOrCreateUser(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {email} = req.body
        if (!email) {
           throw new Error('Некорректный email')
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return candidate
        }
        const user = await User.create({ email})
        return user
    }


    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь с таким именем не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async update(user,password) {
        const hashPassword = await bcrypt.hash(password, 5)
        await user.update({password: hashPassword})
        return
    }
}

module.exports = new UserLogic()