const {Master, City}= require('../models/models')
const ApiError = require('../error/ApiError')
class MasterLogic{
    async create(req,res,next){
        try{
            const {name,rating,cityId} = req.body
            const master = await Master.create({name,rating,cityId})
            return res.json(master)
        }catch (e){
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req,res,next){
        let {cityId,limit,page}=req.query
        page=page || 1
        limit = limit || 12
        let offset= page* limit-limit
        let masters
        if(cityId){
            masters = await Master.findAndCountAll({where:{cityId},limit,offset})

        }else{
            masters = await Master.findAndCountAll({limit,offset})}
        if(!masters.count){
            return next(ApiError.internal('Список пуст'))
        }
        return res.json(masters)
    }
    async getOne(req,res,next){
        const {id} = req.params
        const master = await Master.findOne({where: {id}})
        if(!master){
            return next(ApiError.badRequest('Нет такого пользователя'))
        }
        return res.json(master)

    }
    async update(req,res,next){
        try{
            const {id,name,rating,cityId}=req.body
            await Master.findByPk(id).then((master)=>{master.update({
                name:name,
                rating:rating,
                cityId:cityId
            })})
            return res.json(Master)}catch (e){ return next(ApiError.badRequest("Не верный Id"))}
    }
    async deleteOne(req,res){
        const {id}=req.params
        await Master.findByPk(id).then((master)=>{master.destroy()})
        return res.json(Master)
    }

}

module.exports = new MasterLogic()