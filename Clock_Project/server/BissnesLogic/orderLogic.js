const {Order} = require('../models/models')
const ApiError = require('../error/ApiError')


class OrderLogic {
    async create(req, res, next,userId) {
        try {
            const {name, sizeClock, date, masterId} = req.body
            const order = await Order.create({name, sizeClock, date, userId, masterId})
            return res.json(order)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getUserOrders(req, res) {
        let {userId, limit, page} = req.query
        page = page || 1
        limit = limit || 12
        let offset = page * limit - limit
        let orders
        orders = await Order.findAndCountAll({where: {userId}, limit, offset})
        return res.json(orders)
    }

    async getAllOrders(req, res) {
        const orders = await Order.findAll()
        return res.json(orders)

    }

    async update(req, res, next) {
        try {
            const {id,name, sizeClock, date} = req.body
            await Order.findByPk(id).then((order) => {
                order.update({
                    name:name,
                    sizeClock: sizeClock,
                    date: date
                })
            })
            return res.json(Order)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res) {
        const {id} = req.params
        await Order.findByPk(id).then((order) => {
            order.destroy()
        })
        return res.json(Order)
    }
}

module.exports = new OrderLogic()