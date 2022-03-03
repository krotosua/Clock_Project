const cityLogic = require('../businessLogic/cityLogic')
const masterLogic = require('../businessLogic/masterLogic')

class CityController {
    async create(req, res, next) {

        await cityLogic.create(req, res, next)

    }

    async getAll(req, res, next) {
        await cityLogic.getAll(req, res, next)

    }

    async getOne(req, res, next) {
        await cityLogic.getOne(req, res, next)
    }

    async update(req, res, next) {

        await cityLogic.update(req, res, next)
    }

    async deleteOne(req, res, next) {
        await cityLogic.deleteOne(req, res, next)
    }
}


module.exports = new CityController()

