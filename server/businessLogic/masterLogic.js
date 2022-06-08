const {Master, City, Order, CitiesMasters, User} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require("sequelize");
const sizeLogic = require("./sizeLogic");

class MasterLogic {
    async create(req, res, next) {
        try {
            const {name, rating, email, password, cityId, userId, isActivated} = req.body


            const master = await Master.create({name, rating, email, password, userId, isActivated})


            await master.addCity(cityId)
            return master
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
            let masters = await Master.findAndCountAll({
                attributes: ['name', "rating", "id", "isActivated"], include: [{
                    model: City, through: {
                        attributes: []
                    },

                }, {model: User,}], exclude: [{
                    model: CitiesMasters
                }]
            })

            if (!masters.count) {
                return res.status(204).json({message: "List is empty"})
            }
            masters.count = masters.rows.length
            masters.rows = masters.rows.slice(offset, page * limit)
            return res.json(masters)
        } catch (e) {
            next(ApiError.NotFound(e.message))
        }
    }

    async getMastersForOrder(req, res, next) {
        try {
            let {cityId} = req.params
            let {date, time, sizeClock, limit, page} = req.query
            const clock = await sizeLogic.CheckClock(next, sizeClock)

            let endHour = Number(new Date(time).getUTCHours()) + Number(clock.date.slice(0, 2))
            let endTime = new Date(new Date(time).setUTCHours(endHour, 0, 0))
            time = new Date(time)
            page = page || 1
            limit = limit || 12
            let offset = page * limit - limit
            let masters
            if (cityId) {
                masters = await Master.findAndCountAll({
                    where: {
                        isActivated: {[Op.is]: true}
                    }, include: [{
                        model: City, where: {id: cityId}, through: {
                            attributes: []
                        }
                    }, {
                        model: Order, where: {
                            date: {[Op.eq]: date}, [Op.not]: [{
                                [Op.or]: [{
                                    [Op.and]: [{time: {[Op.lt]: time}}, {endTime: {[Op.lte]: time}}]
                                }, {
                                    [Op.and]: [{time: {[Op.gte]: endTime}}, {endTime: {[Op.gt]: endTime}}]
                                }]
                            }]
                        }, required: false
                    }]
                })
            } else {
                next(ApiError.NotFound({message: "Not found"}))
            }
            masters.rows = masters.rows.filter(master => master.orders.length == 0)
            masters.count = masters.rows.length
            masters.rows = masters.rows.slice(offset, page * limit)
            if (!masters.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(masters)
        } catch (e) {
            next(ApiError.NotFound(e.message))
        }
    }


    async checkOrders(res, next, masterId, date, time, endTime) {
        let master
        master = await Master.findByPk(masterId)
        if (!master) {
            throw new ApiError.NotFound({message: 'Master not found'})
        }
        master = await Master.findOne({
            where: {id: masterId}, include: [{
                model: Order, where: {
                    date: {[Op.eq]: date}, [Op.not]: [{
                        [Op.or]: [{
                            [Op.and]: [{time: {[Op.lt]: time}}, {endTime: {[Op.lte]: time}}]
                        }, {
                            [Op.and]: [{time: {[Op.gte]: endTime}}, {endTime: {[Op.gt]: endTime}}]
                        }]
                    }]
                },

            }],
        })
        if (master) {
            throw new ApiError.badRequest({message: 'Master has orders'})
        }
        return res.status(204).json({message: "Master hasn`t orders"})

    }

    async update(req, res, next) {
        try {
            const {masterId} = req.params
            const {name, rating, cityId, isActivated} = req.body
            const master = await Master.findOne({where: {id: masterId}})
            await master.update({
                name: name, rating: rating,
            })
            await master.setCities(cityId)
            return master
        } catch (e) {
            return next(ApiError.badRequest({message: "Wrong request"}))
        }
    }

    async activate(req, res, next) {
        try {
            const {masterId} = req.params
            const {isActivated} = req.body
            console.log(masterId)
            const master = await Master.findOne({where: {id: masterId}})
            await master.update({
                isActivated: isActivated,
            })
            return master
        } catch (e) {
            return next(ApiError.badRequest({message: "Wrong request"}))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {masterId} = req.params
            const master = await User.findOne({

                include: {
                    model: Master, where: {id: masterId}, attributes: ['id'], include: {
                        model: Order, attributes: ['id']
                    }
                }
            })
            if (master.master.orders.length == 0) {
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