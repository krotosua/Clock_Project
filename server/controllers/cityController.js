const cityLogic = require('../businessLogic/cityLogic')
const ApiError = require("../error/ApiError");
const {validationResult} = require("express-validator");

class CityController {
    async create(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await cityLogic.create(req, res, next)
    }

    async getAll(req, res, next) {
        await cityLogic.getAll(req, res, next)

    }

    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await cityLogic.update(req, res, next)
    }

    async deleteOne(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await cityLogic.deleteOne(req, res, next)
    }
}


module.exports = new CityController()

