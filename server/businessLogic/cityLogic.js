const {City, Master} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require("../db");
const {validationResult} = require('express-validator');

class CityLogic {
    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const {name, price} = req.body
            const city = await City.create({name, price})
            return res.status(200).json({city})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let {limit, page} = req.query
            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit
            let cities
            cities = await City.findAndCountAll({
                order: [['id', 'DESC']],
                limit, offset
            })

            if (!cities.count) {
                return res.status(204).json({message: "List is empty"})
            }
            return res.status(200).json(cities)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async checkMasterCityId(id) {
        const city = await City.findAll({where: {id}})
        if (city.length !== id.length || city.length === 0) {
            throw new ApiError.badRequest({message: "WRONG CityId"})
        }
    }

    async checkCityId(id) {
        const city = await City.findByPk(id)
        if (!city) {
            throw new ApiError.badRequest({message: "WRONG CityId"})
        }
        return city
    }

    async update(req, res, next) {
        try {
            const {cityId} = req.params
            const {name, price} = req.body
            const city = await City.update({name, price}, {where: {id: cityId}})
            return res.status(201).json(city)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {cityId} = req.params

            if (cityId) {
                const city = await City.findOne({
                    where: {id: cityId}, include: Master, attributes: ["id"]
                })
                if (city.masters.length === 0) {
                    await city.destroy()
                    return res.status(204).json({message: "success"})
                } else {
                    return next(ApiError.Conflict({message: "City isn`t empty"}))
                }
            } else {
                return next(ApiError.badRequest({message: "Id is empty"}))
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }


}


module.exports = new CityLogic()

