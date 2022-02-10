
const userLogic = require('../businessLogic/userLogic');


class UserController{
    async registration(req,res,next){
           await userLogic.registration(req,res,next)

    }

    async login(req,res,next){
            await userLogic.login(req,res, next)

    }
    async ordereg(req,res){
           await  userLogic.GetOrCreateUser(req,res)

    }
    async check(req,res){
       await userLogic.check(req,res)


    }
}

module.exports = new UserController()