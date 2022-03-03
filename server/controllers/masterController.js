const masterLogic = require('../businessLogic/masterLogic')

class MasterController {
    async create(req, res, next) {
        await masterLogic.create(req, res, next)
    }

    async getAll(req, res, next) {
        await masterLogic.getAll(req, res, next)
    }

    async getOne(req, res, next) {
        await masterLogic.getOne(req, res, next)
    }

    async update(req, res, next) {
        await masterLogic.update(req, res, next)
    }

    async deleteOne(req, res, next) {
        await masterLogic.deleteOne(req, res, next)
    }

}

module.exports = new MasterController()