import { Router } from 'express'
const cityRouter = Router()
import {body, param} from 'express-validator';
import cityController from "../controllers/cityController"
import checkRole from "../middleware/checkRoleMiddleware"


cityRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    checkRole("ADMIN"),
    cityController.create)

cityRouter.put('/:cityId',
    body("name").not().isEmpty().isString().trim().escape(),
    param("cityId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"),
    cityController.update)

cityRouter.delete('/:cityId',
    param("cityId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"),
    cityController.deleteOne)

cityRouter.get('/', cityController.getAll)

export default cityRouter