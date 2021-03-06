const masterLogic = require('../businessLogic/masterLogic')
const cityLogic = require('../businessLogic/cityLogic')
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const {validationResult} = require("express-validator");

class MasterController {
    async create(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                const {cityId} = req.body
                await cityLogic.checkMasterCityId(cityId)
                const master = await masterLogic.create(req, res, next)
                return master
            })
            return res.status(201).json(result)
        } catch (e) {
            next(ApiError.badRequest({message: "WRONG request"}))
        }
    }

    async getAll(req, res, next) {
        await masterLogic.getAll(req, res, next)
    }

    async getMastersForOrder(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.getMastersForOrder(req, res, next)
    }


    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                const {cityId} = req.body
                await cityLogic.checkMasterCityId(cityId)
                const master = await masterLogic.update(req, res, next)
                return master
            })
            return res.status(201).json(result)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await masterLogic.deleteOne(req, res, next)
    }

}

module.exports = new MasterController()