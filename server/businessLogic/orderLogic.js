const {Order, Master, SizeClock, Rating, User} = require('../models/models')
const ApiError = require('../error/ApiError')
const MailService = require("../service/mailService")
const {Op} = require("sequelize");

const statusList = {
    WAITING: "WAITING",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    DONE: "DONE",
}

class OrderLogic {
    async create(req, res, next, userId, time, endTime) {
        try {
            const {name, sizeClockId, masterId, cityId, price} = req.body
            const order = await Order.create(
                {name, sizeClockId, userId, time, endTime, masterId, cityId, price})
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
                order:[['id', 'DESC']],
                where: {userId: userId},
                include: [{
                    model: Master,
                    attributes: ['name'],
                }, {
                    model: SizeClock,
                    attributes: ['name'],

                },
                    {
                        model: Rating,
                        attributes: ["rating"],

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

    async getMasterOrders(req, res, next) {
        try {
            const {userId} = req.params
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            const offset = page * limit - limit
            let orders
            let master = await Master.findOne({
                where: {userId: userId},
                attributes: ['id', "isActivated"]
            })

            if (!master.isActivated) {
                return next(ApiError.forbidden("Doesn`t activated"))
            }
            orders = await Order.findAndCountAll({
                order:[['id', 'DESC']],
                where: {
                    masterId: master.id,
                },
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
                order:[['id', 'DESC']],
                include: [{
                    model: Master,
                }, {
                    model: SizeClock,
                    attributes: ['date'],

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
            const {name, sizeClockId, masterId, cityId, price} = req.body
            if (orderId <= 0) {
                next(ApiError.badRequest({message: "cityId is wrong"}))
            }
            const order = await Order.findOne({where: {id: orderId}})
            await order.update({
                name,
                sizeClockId,
                time,
                endTime,
                masterId,
                cityId,
                userId,
                price
            })

            return order
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async statusChange(req, res, next) {
        try {
            const {orderId} = req.params
            const {status} = req.body
            if (!statusList[status]) {
                next(ApiError.badRequest("INVALID STATUS"))
            }
            if (orderId <= 0) {
                next(ApiError.badRequest("cityId is wrong"))
            }
            const order = await Order.findOne({where: {id: orderId}})
            await order.update({
                status: status,
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
            let {name,  time, email, masterId, password} = req.body
            const master = await Master.findByPk(masterId)
            time = new Date(time).toLocaleString("uk-UA")
            MailService.sendMail(name,  time, email, size, master.name, cityName, password, next)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}


module.exports = new OrderLogic()