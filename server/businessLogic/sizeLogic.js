const {SizeClock, Order} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require("../db");

class SizeLogic {
    async create(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {name, date} = req.body
                const size = await SizeClock.create({name, date})
                return size
            });
            return res.status(201).json(result)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let sizes
            sizes = await SizeClock.findAndCountAll({limit, offset})
            if (!sizes.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(sizes)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async CheckClock(next, sizeClockId,) {
        const sizeClock = await SizeClock.findOne({where: {id: sizeClockId}})
        if (!sizeClock) {
            return next(ApiError.badRequest('WRONG sizeClockId'))
        }
        return sizeClock
    }

    async update(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {sizeId} = req.params
                const {name, date} = req.body
                const size = await SizeClock.findOne({where: {id: sizeId}})
                await size.update({
                    name: name,
                    date: date
                })
                return size
            });
            return res.status(201).json(result)

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {sizeId} = req.params
            if (sizeId) {
                const size = await SizeClock.findOne({
                    where: {id: sizeId},
                    include: Order,
                    attributes: ["id"]
                })

                if (size.orders.length == 0) {
                    await size.destroy()
                    return res.status(204).json({message: "success"})
                } else {
                    return next(ApiError.Conflict({message: "Clock has orders"}))
                }
            } else {
                return next(ApiError.badRequest({message: "Id is empty"}))
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }


}


module.exports = new SizeLogic()

