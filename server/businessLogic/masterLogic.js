const {Master, City} = require('../models/models')
const ApiError = require('../error/ApiError')

class MasterLogic {
    async create(req, res, next) {
        try {
            const {name, rating, cityId} = req.body
            const master = await Master.create({name, rating, cityId})
            return res.json(master)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        let {cityId, limit, page} = req.query
        page = page || 1
        limit = limit || 12
        let offset = page * limit - limit
        let masters
        if (cityId) {
            masters = await Master.findAndCountAll({where: {cityId}, limit, offset})

        } else {
            masters = await Master.findAndCountAll({limit, offset})
        }
        if (!masters.count) {
            return res.status(204).json({message: "List is empty"})
        }
        return res.json(masters)
    }

    async getOne(req, res, next) {
        const {id} = req.params
        const master = await Master.findOne({where: {id}})
        if (!master) {
            return next(ApiError.badRequest('User doesn`t exist'))
        }
        return res.json(master)

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
            const master = await Master.findOne({where: id})
            await master.destroy()
            return res.status(204).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new MasterLogic()