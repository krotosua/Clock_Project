const userLogic = require('../businessLogic/userLogic');



class UserController {
    async registration(req, res, next) {
        await userLogic.registration(req, res, next)
    }

    async registrationFromAdmin(req,res,next){
        await userLogic.registrationFromAdmin(req, res, next)
    }

    async login(req, res, next) {
        await userLogic.login(req, res, next)
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

    async activate(req, res, next) {
        await userLogic.activate(req, res, next)
    }
    async updateUser(req,res,next){
        await userLogic.updateUser(req,res, next)
    }
}


module.exports = new UserController()