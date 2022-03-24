const userLogic = require('../businessLogic/userLogic')
const orderLogic = require('../businessLogic/orderLogic')
const masterLogic = require("../businessLogic/masterLogic");
const ApiError = require("../error/ApiError");

class OrderController {
    async create(req, res, next) {
        try {
            const user = await userLogic.GetOrCreateUser(req, res)
            const userId = user.dataValues.id
            await masterLogic.getOne(req, res, next)
            await orderLogic.create(req, res, next, userId)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
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

    async sendMessage(req, res, next) {
        await orderLogic.sendMessage(req, res, next)
    }
}

module.exports = new OrderController()