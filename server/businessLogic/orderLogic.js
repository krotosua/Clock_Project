const {Order, City, Master, SizeClock} = require('../models/models')
const ApiError = require('../error/ApiError')
const MailService = require("../service/mailService")


class OrderLogic {
    async create(req, res, next, userId) {
        try {
            const {name, sizeClockId, date, time, masterId} = req.body
            await Order.create({name, sizeClockId, date, userId, time, masterId})
            return res.status(201).json({message: "Created"})

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getUserOrders(req, res, next) {
        try {
            let {id} = req.params
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let orders
            orders = await Order.findAndCountAll({
                where: {userId: id},
                include: [{
                    model: Master,
                    attributes: ['name'],
                    include: {
                        model: City,
                        attributes: ['name']
                    }
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
                    attributes: ['name'],
                    include: {
                        model: City,
                        attributes: ['name']
                    }
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

    async update(req, res, next) {
        try {
            const {id, name, sizeClock, date} = req.body
            const order = await Order.findOne({where: id})

            await order.update({
                name: name,
                sizeClock: sizeClock,
                date: date
            })

            return res.status(200).json({message: "success"})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.body
            const order = await Order.findOne({where: id})
            await order.destroy()
            return res.status(204).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async sendMessage(req, res, next) {
        try {
            const {name, date, time, email, size, masterName, cityName} = req.body
            await MailService.sendMail(name, date, time, email, size, masterName, cityName)
            return res.status(200).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}


module.exports = new OrderLogic()