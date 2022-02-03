const {City}= require('../models/models')
const ApiError = require('../error/ApiError')
const cityLogic = require('../businessLogic/cityLogic')
class CityController{
    async create(req,res){
        await cityLogic.create(req,res)
    }
    async getAll(req,res){
        await cityLogic.getAll(req,res)

    }

    async getOne(req,res){
        await cityLogic.getOne(req,res)
    }
    async update(req,res){
        await cityLogic.update(req,res)
}
    async deleteOne(req,res){
        await cityLogic.deleteOne(req,res)
    }
}


module.exports = new CityController()

