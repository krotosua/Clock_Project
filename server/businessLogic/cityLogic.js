const {City, Master} = require('../models/models')
const ApiError = require('../error/ApiError')

class CityLogic {
    async create(req, res, next) {
        try {
            const {name} = req.body
            await City.create({name})
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
            let cities
            cities = await City.findAndCountAll({limit, offset})
            if (!cities.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(cities)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res) {
        const {id} = req.params
        const city = await City.findOne({where: {id}})
        return res.json(city)
    }

    async update(req, res, next) {
        try {
            const {id, name} = req.body
            const city = await City.findOne({where: id})
            await city.update({name: name})
            return res.status(200).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.body
            const city = await City.findOne({where: id})
            await city.destroy()

            return res.status(204).json({message: "success"})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

}


module.exports = new CityLogic()

