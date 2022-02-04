const {Order} = require('../models/models')
const ApiError = require('../error/ApiError')
const userLogic = require('../businessLogic/userLogic')
const orderLogic = require('../businessLogic/orderLogic')

class OrderController {
    async create(req, res, next) {
        const user = await userLogic.GetOrCreateUser(req,res)
        const userId = user.dataValues.id
        await orderLogic.create(req, res, next,userId)

    }

    async getUserOrders(req, res) {
        await orderLogic.getUserOrders(req, res)
    }

    async getAllOrders(req, res) {
        await orderLogic.getAllOrders(req, res)

    }

    async update(req, res, next) {
        await orderLogic.update(req, res, next)
    }

    async deleteOne(req, res) {
        await orderLogic.deleteOne(req, res)
    }
}
module.exports = new OrderController()