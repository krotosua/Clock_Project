import {Router} from 'express'
import masterController from "../controllers/masterController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param, query} from 'express-validator';
import {Roles} from "../dto/global";

const masterRouter = Router()


masterRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("rating").not().isEmpty().not().isString().isInt({gt: -1, lt: 6}),
    body("cityId").not().isEmpty().isArray(),
    checkRole(Roles.ADMIN),
    masterController.create)

masterRouter.get('/', masterController.getAll)

masterRouter.get('/:cityId',
    param("cityId").not().isEmpty().isInt({gt: 0}),
    query("time").not().isEmpty().isString(),
    masterController.getMastersForOrder)

masterRouter.put('/:masterId',

    param("masterId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("rating").not().isEmpty().not().isString().isInt({gt: -1, lt: 6}),
    body("cityId").not().isEmpty().isArray(),
    checkRole(Roles.ADMIN), masterController.update)

masterRouter.put('/activate/:masterId',
    param("masterId").not().isEmpty().isInt({gt: 0}),
    body("isActivated").not().isEmpty().isBoolean(),
    checkRole(Roles.ADMIN), masterController.activate)

masterRouter.put('/Rating/:masterId',
    param("masterId").not().isEmpty().isInt({gt: 0}),
    checkRole(Roles.CUSTOMER), masterController.ratingUpdate)
masterRouter.get('/rating/:masterId', masterController.getRatingReviews)
masterRouter.delete('/:masterId',
    param("masterId").not().isEmpty().isInt({gt: 0}),
    checkRole(Roles.ADMIN), masterController.deleteOne)


export default masterRouter