const {SizeClock, Order, Price, City} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require("../db");

class SizeLogic {
    async create(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {name, date, priceList} = req.body
                const size = await SizeClock.create({name, date})
                const list = priceList.map((item, obj) => obj = {
                    cityId: item.cityId,
                    price: item.price,
                    sizeClockId: size.id
                })
                await Price.bulkCreate(list)
                return size
            });
            return res.status(201).json(result)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const result = await sequelize.transaction(async () => {
                const {sizeId} = req.params
                const {name, date, priceList} = req.body
                const size = await SizeClock.findOne({where: {id: sizeId}})
                await size.update({
                    name: name,
                    date: date
                })
                await Price.destroy({where: {sizeClockId: sizeId}})
                const list = priceList.map((item, obj) => obj = {
                    cityId: item.cityId,
                    price: item.price,
                    sizeClockId: size.id
                })
                await Price.bulkCreate(list)
                return size
            });
            return res.status(201).json(result)

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }


    async getAll(req, res, next) {
        try {
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let sizes
            sizes = await SizeClock.findAndCountAll({
                include: Price,
                limit, offset
            })
            if (!sizes.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(sizes)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getForCity(req, res, next) {
        try {
            const {cityId} = req.params
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let sizes
            sizes = await SizeClock.findAndCountAll({
                include: [{
                    model: Price,
                    where: {cityId}
                }],
                limit, offset
            })
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

