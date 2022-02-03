const {City}= require('../models/models')
const ApiError = require('../error/ApiError')
class CityLogic{
    async create(req,res){
        const {name} = req.body
        const city = await City.create({name})
        return res.json(city)
    }
    async getAll(req,res){
        const cities = await City.findAll()
        return res.json(cities)
    }

    async getOne(req,res){
        const {id}=req.params
        const city = await City.findOne({where:{id}})
        return res.json(city)
    }
    async update(req,res){
        const {id,name}=req.body
        await City.findByPk(id).then((city)=>{city.update({name:name})})
        return res.json(City)
    }
    async deleteOne(req,res){
        const {id}=req.params
        await City.findByPk(id).then((city)=>{city.destroy()})
        return res.json(City)
    }
}


module.exports = new CityLogic()

