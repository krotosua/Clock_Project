const userLogic = require('../businessLogic/userLogic');


class UserController {
    async registration(req, res, next) {
        await userLogic.registration(req, res, next)
    }

    async login(req, res, next) {
        await userLogic.login(req, res, next)
    }

    async ordeReg(req, res, next) {
        await userLogic.GetOrCreateUser(req, res, next)

    }

    async check(req, res, next) {
        await userLogic.check(req, res, next)
    }

    async getAll(req, res, next) {
        await userLogic.getAll(req, res, next)
    }

    async deleteOne(req, res, next) {
        await userLogic.deleteOne(req, res, next)
    }

}


module.exports = new UserController()