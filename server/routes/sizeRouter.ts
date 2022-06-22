import express from 'express'
import sizeController from "../controllers/sizeController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';
import {Roles} from "../dto/global";

const sizeRouter = express.Router()

sizeRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole(Roles.ADMIN), sizeController.create)

sizeRouter.get('/', sizeController.getAll)

sizeRouter.put('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole(Roles.ADMIN), sizeController.update)

sizeRouter.delete('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    checkRole(Roles.ADMIN), sizeController.deleteOne)


export default sizeRouter