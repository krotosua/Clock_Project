const userLogic = require('../businessLogic/userLogic')
const orderLogic = require('../businessLogic/orderLogic')
const masterLogic = require("../businessLogic/masterLogic");
const sizeLogic = require("../businessLogic/sizeLogic")
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const cityLogic = require("../businessLogic/cityLogic");
const {validationResult} = require("express-validator");

class OrderController {

    async create(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                let {sizeClockId, date, time, masterId, cityId} = req.body
                const clock = await sizeLogic.CheckClock(next, sizeClockId)

                let endHour = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
                let endTime = new Date(new Date(time).setUTCHours(endHour, 0, 0))
                time = new Date(time)
                const city = await cityLogic.checkCityId(cityId)
                await masterLogic.checkOrders(res, next, masterId, date, time, endTime, clock)
                const user = await userLogic.GetOrCreateUser(req, res, next)
                if (!user) {
                    throw new ApiError.badRequest({message: "User is wrong"})
                }
                const userId = user.dataValues.id
                const order = await orderLogic.create(req, res, next, userId, time, endTime)
                if (!order) {
                    throw new ApiError.badRequest({message: "User is wrong"})
                }
                let data = {
                    order: order,
                    city: city,
                    clock: clock
                }
                return data
            })
            await orderLogic.sendMessage(req, res, next, result)
            return res.status(201)
        } catch (e) {
            return next(ApiError.badRequest({message: "Wrong request"}))
        }

    }

    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const result = await sequelize.transaction(async () => {
                let {sizeClockId, date, time, masterId, cityId, changedMaster} = req.body
                const clock = await sizeLogic.CheckClock(next, sizeClockId)
                let endHour = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
                let endTime = new Date(new Date(time).setUTCHours(endHour, 0, 0))
                time = new Date(time)
                await cityLogic.checkCityId(cityId)
                if (changedMaster) {
                    await masterLogic.checkOrders(res, next, masterId, date, time, endTime, clock)
                }
                const user = await userLogic.GetOrCreateUser(req, res, next)
                if (!user) {
                    throw new ApiError.badRequest({message: "User is wrong"})
                }
                const userId = user.dataValues.id
                const orders = await orderLogic.update(req, res, next, userId, time, endTime)
                return orders
            })
            return res.status(201).json(result)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getUserOrders(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.getUserOrders(req, res, next)
    }

    async getAllOrders(req, res, next) {
        await orderLogic.getAllOrders(req, res, next)

    }


    async deleteOne(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        await orderLogic.deleteOne(req, res, next)
    }

}

module.exports = new OrderController()