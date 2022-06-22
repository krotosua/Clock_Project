import {Router} from 'express'
import orderController from "../controllers/orderController"
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';
import {Roles} from "../dto/global";

const orderRouter = Router()


orderRouter.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("email").isEmail().isString().trim().escape(),
    body("time").not().isEmpty(),
    body("price").not().isEmpty().not().isString().isInt({gt: 0}),
    body("cityId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("masterId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("sizeClockId").not().isEmpty().not().isString().isInt({gt: 0}),
    orderController.create,)

orderRouter.get('/:userId', checkRole(Roles.CUSTOMER),
    param("userId").not().isEmpty().isInt({gt: 0}),
    orderController.getUserOrders)

orderRouter.get('/Master/:userId', checkRole(Roles.MASTER),
    param("userId").not().isEmpty().isInt({gt: 0}),
    orderController.getMasterOrders)

orderRouter.get('/', checkRole(Roles.ADMIN), orderController.getAllOrders)

orderRouter.put("/:orderId",
    param("orderId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("email").isEmail().isString().trim().escape(),
    body("time").not().isEmpty(),
    body("price").not().isEmpty().not().isString().isInt({gt: 0}),
    body("cityId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("masterId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("sizeClockId").not().isEmpty().not().isString().isInt({gt: 0}),
    checkRole(Roles.ADMIN), orderController.update)

orderRouter.put("/statusChange/:orderId",
    param("orderId").not().isEmpty().isInt({gt: 0}),
    orderController.statusChange)


orderRouter.delete("/:orderId",
    param("orderId").not().isEmpty().isInt({gt: 0}),
    checkRole(Roles.ADMIN),

    orderController.deleteOne)

export default orderRouter