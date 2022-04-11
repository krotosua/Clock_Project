const sizeLogic = require('../businessLogic/sizeLogic')

class sizeController {
    async create(req, res, next) {
        await sizeLogic.create(req, res, next)

    }

    async getAll(req, res, next) {
        await sizeLogic.getAll(req, res, next)

    }


    async update(req, res, next) {
        await sizeLogic.update(req, res, next)
    }

    async deleteOne(req, res, next) {

        await sizeLogic.deleteOne(req, res, next)
    }
}


module.exports = new sizeController()

