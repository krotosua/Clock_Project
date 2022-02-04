const {Master, City}= require('../models/models')
const ApiError = require('../error/ApiError')
const masterLogic=require('../businessLogic/masterLogic')
class MasterController{
    async create(req,res,next){
      await masterLogic.create(req,res,next)
    }

    async getAll(req,res,next){
        await masterLogic.getAll(req,res,next)
    }
    async getOne(req,res,next){
        await masterLogic.getOne(req,res,next)
    }
    async update(req,res,next){
        await masterLogic.update(req,res,next)
    }
    async deleteOne(req,res){
        await masterLogic.deleteOne(req,res)
    }

}

module.exports = new MasterController()