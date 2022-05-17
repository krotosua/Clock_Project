const masterLogic = require('../businessLogic/masterLogic')
const cityLogic = require('../businessLogic/cityLogic')
const ApiError = require("../error/ApiError");
const sequelize = require("../db");

class MasterController {
    async create(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {name, rating, cityId} = req.body
                if (!Array.isArray(cityId) || typeof rating !== "number"
                    || typeof name !== "string" || cityId.length == 0) {
                    next(ApiError.badRequest({message: "Wrong request"}))
                }
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

    async getMastersOrders(req, res, next) {
        let {cityId} = req.params
        let {date, time, endTime} = req.query
        if (cityId <= 0 || typeof cityId <= 0 || typeof date !== "string" || typeof time !== "string" || typeof endTime !== "string") {
            return next(ApiError.badRequest("Error creating order"))
        }
        await masterLogic.getMastersOrders(req, res, next)
    }


    async update(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {name, rating, cityId, masterId} = req.body
                if (!Array.isArray(cityId) || typeof rating !== "number"
                    || typeof name !== "string" || cityId.length == 0 || masterId <= 0) {
                    next(ApiError.badRequest({message: "Wrong request"}))
                }
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
        const {masterId} = req.params
        if (masterId <= 0) {
            next(ApiError.badRequest({message: "cityId is wrong"}))
        }
        await masterLogic.deleteOne(req, res, next)
    }

}

module.exports = new MasterController()