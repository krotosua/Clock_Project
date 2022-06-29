import {Router} from 'express'
import {body, param} from 'express-validator';
import cityController from "../controllers/cityController"
import checkRole from "../middleware/checkRoleMiddleware"
import {ROLES} from "../dto/global";

const cityRouter = Router()


cityRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    checkRole(ROLES.ADMIN),
    cityController.create)

cityRouter.put('/:cityId',
    body("name").not().isEmpty().isString().trim().escape(),
    param("cityId").not().isEmpty().isInt({gt: 0}),
    checkRole(ROLES.ADMIN),
    cityController.update)

cityRouter.delete('/:cityId',
    param("cityId").not().isEmpty().isInt({gt: 0}),
    checkRole(ROLES.ADMIN),
    cityController.deleteOne)

cityRouter.get('/', cityController.getAll)

export default cityRouter