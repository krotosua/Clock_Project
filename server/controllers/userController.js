const userLogic = require('../businessLogic/userLogic');
const masterLogic = require("../businessLogic/masterLogic");


class UserController {
    async registration(req, res, next) {
        await userLogic.registration(req, res, next)
        if (req.body.role == "MASTER") {
            req.body.rating = 0
            const master = await masterLogic.create(req, res, next)
            return master
        }
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