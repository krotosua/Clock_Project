const {Master, City, Order} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require("sequelize");

class MasterLogic {
    async create(req, res, next) {
        try {
            const {name, rating, cityId} = req.body
            if (cityId <= 0) {
                next(ApiError.badRequest({message: "cityId is empty"}))
            }
            const master = await Master.create({name, rating, cityId})
            return res.json(master)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let {cityId, date, limit, page} = req.query
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let masters
            if (cityId) {
                masters = await Master.findAndCountAll({
                    where: {
                        cityId,
                    },
                    include: [{
                        model: City,
                        attributes: ['name'],
                    }, {
                        model: Order,
                        where: {
                            date: {[Op.eq]: date}
                        },
                        required: false
                    }]
                    ,
                    limit, offset
                })

            } else {
                masters = await Master.findAndCountAll({
                    include: [{
                        model: City,

                    },


                    ], limit, offset
                })
            }
            if (!masters.count) {
                return res.status(204).json({message: "List is empty"})
            }

            return res.json(masters)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        const id = req.body.masterId
        const master = await Master.findOne({where: {id}})
        if (!master) {
            return next(ApiError.badRequest('Master doesn`t exist'))
        }
        return res.status(200)
    }


    async update(req, res, next) {
        try {
            const {id, name, rating, cityId} = req.body
            const master = await Master.findOne({where: id})
            await master.update({
                name: name,
                rating: rating,
                cityId: cityId
            })
            return res.status(200).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest("Invalid ID"))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.body
            const master = await Master.findOne({
                where: id,
                include: {
                    model: Order,
                    attributes: ['id']
                }
            })
            if (master.orders.length == 0) {
                await master.destroy()
                return res.status(204).json({message: "success"})
            } else {
                return next(ApiError.Conflict({message: "City isn`t empty"}))
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new MasterLogic()