const cityLogic = require('../businessLogic/cityLogic')
const ApiError = require("../error/ApiError");

class CityController {
    async create(req, res, next) {
        const {name} = req.body
        if (typeof name !== 'string' || !name) {
            next(ApiError.badRequest({message: "Invalid name"}))
        }
        await cityLogic.create(req, res, next)

    }

    async getAll(req, res, next) {
        await cityLogic.getAll(req, res, next)

    }

    async getOne(req, res, next) {
        await cityLogic.getOne(req, res, next)
    }

    async update(req, res, next) {
        const {cityId} = req.params
        const {name} = req.body
        if (!cityId || !name || typeof name !== 'string' || cityId <= 0) {
            return next(ApiError.badRequest('Wrong Id'))
        }
        await cityLogic.update(req, res, next)
    }

    async deleteOne(req, res, next) {
        const {cityId} = req.params
        if (!cityId || cityId <= 0) {
            return next(ApiError.badRequest('Wrong Id'))
        }
        await cityLogic.deleteOne(req, res, next)
    }
}


module.exports = new CityController()

