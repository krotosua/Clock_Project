import express from 'express'
import sizeController from "../controllers/sizeController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';
import {ROLES} from "../dto/global";

const sizeRouter = express.Router()

sizeRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole(ROLES.ADMIN), sizeController.create)

sizeRouter.get('/', sizeController.getAll)

sizeRouter.put('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole(ROLES.ADMIN), sizeController.update)

sizeRouter.delete('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    checkRole(ROLES.ADMIN), sizeController.deleteOne)


export default sizeRouter