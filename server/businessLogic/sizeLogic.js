const {SizeClock, Master} = require('../models/models')
const ApiError = require('../error/ApiError')

class SizeLogic {
    async create(req, res, next) {
        try {
            const {name, date} = req.body

            await SizeClock.create({name, date})
            return res.status(201).json({message: "Created"})
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

    async getOne(req, res, next) {
        const id = req.body.sizeClockId
        const sizeClockId = await SizeClock.findOne({where: {id}})
        if (!sizeClockId) {
            return next(ApiError.badRequest('Size clock doesn`t exist'))
        }
        return res.status(200)
    }

    async update(req, res, next) {
        try {
            const {id, name, date} = req.body
            const size = await SizeClock.findOne({where: id})
            await size.update({
                name: name,
                date: date
            })
            return res.status(200).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.body

            if (id) {
                const size = await SizeClock.findOne({where: id})
                await size.destroy()
                return res.status(204).json({message: "success"})
            } else {
                return next(ApiError.badRequest({message: "Id is empty"}))
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }


}


module.exports = new SizeLogic()

