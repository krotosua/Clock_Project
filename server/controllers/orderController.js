const userLogic = require('../businessLogic/userLogic')
const orderLogic = require('../businessLogic/orderLogic')
const masterLogic = require("../businessLogic/masterLogic");
const sizeLogic = require("../businessLogic/sizeLogic")
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const cityLogic = require("../businessLogic/cityLogic");

class OrderController {

    async create(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {order} = req.body
                const {name, sizeClockId, date, time, endTime, masterId, cityId} = order
                if (sizeClockId <= 0 || masterId <= 0 || cityId <= 0
                    || typeof cityId !== "number" || typeof sizeClockId !== "number"
                    || typeof masterId !== "number" || typeof name !== "string" || typeof date !== "string"
                    || typeof time !== "string" || typeof endTime !== "string") {
                    return next(ApiError.badRequest("Error creating order"))
                }
                await sizeLogic.CheckClock(next, sizeClockId)
                await cityLogic.checkCityId(cityId)
                await masterLogic.checkOrders(res, next, masterId, date, time, endTime)
                const user = await userLogic.GetOrCreateUser(req, res, next)
                if (!user) {
                    throw new ApiError.badRequest({message: "User is wrong"})
                }
                const userId = user.dataValues.id
                const orders = await orderLogic.create(req, res, next, userId,)
                return orders
            })
            await orderLogic.sendMessage(req, res, next)
            return res.status(201)
        } catch (e) {
            return next(ApiError.badRequest({message: "Wrong request"}))
        }

    }

    async update(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {orderId} = req.params
                const {name, sizeClockId, date, time, endTime, masterId, cityId, changedMaster} = req.body
                if (sizeClockId <= 0 || masterId <= 0 || cityId <= 0 || orderId <= 0
                    || typeof cityId !== "number" || typeof sizeClockId !== "number"
                    || typeof masterId !== "number" || typeof name !== "string" || typeof date !== "string"
                    || typeof time !== "string" || typeof endTime !== "string") {
                    return next(ApiError.badRequest("Error creating order"))
                }
                await sizeLogic.CheckClock(next, sizeClockId)
                await cityLogic.checkCityId(cityId)
                if (changedMaster) {
                    await masterLogic.checkOrders(res, next, masterId, date, time, endTime)
                }
                const user = await userLogic.GetOrCreateUser(req, res, next)
                if (!user) {
                    throw new ApiError.badRequest({message: "User is wrong"})
                }
                const userId = user.dataValues.id
                const orders = await orderLogic.update(req, res, next, userId,)
                return orders
            })
            return res.status(201).json(result)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getUserOrders(req, res, next) {
        await orderLogic.getUserOrders(req, res, next)
    }

    async getAllOrders(req, res, next) {
        await orderLogic.getAllOrders(req, res, next)

    }


    async deleteOne(req, res, next) {

        await orderLogic.deleteOne(req, res, next)
    }

}

module.exports = new OrderController()