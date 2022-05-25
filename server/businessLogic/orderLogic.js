const {Order, Master, SizeClock, City, User} = require('../models/models')
const ApiError = require('../error/ApiError')
const MailService = require("../service/mailService")


class OrderLogic {
    async create(req, res, next, userId, time, endTime) {
        try {
            const {name, sizeClockId, date, masterId, cityId} = req.body
            const order = await Order.create(
                {name, sizeClockId, date, userId, time, endTime, masterId, cityId})
            return order
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getUserOrders(req, res, next) {
        try {
            let {userId} = req.params
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let orders
            orders = await Order.findAndCountAll({
                where: {userId: userId},
                include: [{
                    model: Master,
                    attributes: ['name'],
                }, {
                    model: SizeClock,
                    attributes: ['name'],

                }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllOrders(req, res, next) {
        try {
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let orders
            orders = await Order.findAndCountAll({
                include: [{
                    model: Master,
                }, {
                    model: SizeClock,
                    attributes: ['name'],

                }, {
                    model: User,
                    attributes: ['email'],

                }], limit, offset
            })
            if (!orders.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(orders)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async update(req, res, next, userId, time, endTime) {
        try {
            const {orderId} = req.params
            const {name, sizeClockId, date, masterId, cityId,} = req.body
            if (orderId <= 0) {
                next(ApiError.badRequest({message: "cityId is wrong"}))
            }
            const order = await Order.findOne({where: {id: orderId}})
            await order.update({
                name: name,
                sizeClockId: sizeClockId,
                date: date,
                time: time,
                endTime: endTime,
                masterId: masterId,
                cityId: cityId,
                userId: userId
            })

            return order
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {orderId} = req.params
            const order = await Order.findOne({where: {id: orderId}})
            await order.destroy()
            return res.status(204).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async sendMessage(req, res, next, result) {
        try {
            const cityName = result.city.name
            const size = result.clock.name
            let {name, date, time, email, masterId,} = req.body
            const master = await Master.findByPk(masterId)
            date = new Date(Date.parse(date)).toLocaleDateString()
            time = new Date(Date.parse(time)).toLocaleTimeString()
            MailService.sendMail(name, date, time, email, size, master.name, cityName, next)

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}


module.exports = new OrderLogic()