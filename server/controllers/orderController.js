const {Order} = require('../models/models')
const ApiError = require('../error/ApiError')
const userLogic = require('../businessLogic/userLogic')
const orderLogic = require('../businessLogic/orderLogic')

class OrderController {
    async create(req, res, next) {
        const user = await userLogic.GetOrCreateUser(req, res)
        const userId = user.dataValues.id
        await orderLogic.create(req, res, next, userId)

    }

    async getUserOrders(req, res, next) {
        await orderLogic.getUserOrders(req, res, next)
    }

    async getAllOrders(req, res, next) {
        await orderLogic.getAllOrders(req, res, next)

    }

    async update(req, res, next) {
        await orderLogic.update(req, res, next)
    }

    async deleteOne(req, res, next) {
        await orderLogic.deleteOne(req, res, next)
    }
}

module.exports = new OrderController()