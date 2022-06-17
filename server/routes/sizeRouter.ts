import express from 'express'
const sizeRouter = express.Router()
import sizeController from "../controllers/sizeController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';

sizeRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole("ADMIN"), sizeController.create)
sizeRouter.get('/', sizeController.getAll)
sizeRouter.put('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole("ADMIN"), sizeController.update)
sizeRouter.delete('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"), sizeController.deleteOne)


export default sizeRouter