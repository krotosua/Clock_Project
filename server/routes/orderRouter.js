const express = require('express')
const router = express.Router()
const orderController = require("../controllers/orderController")
const checkRole = require("../middleware/checkRoleMiddleware");
const {body, param} = require("express-validator");


router.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("email").isEmail().isString().trim().escape(),
    body("date").not().isEmpty(),
    body("time").not().isEmpty(),

    body("cityId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("masterId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("sizeClockId").not().isEmpty().not().isString().isInt({gt: 0}),
    orderController.create,)

router.get('/:userId', checkRole("CUSTOMER"),
    param("userId").not().isEmpty().isInt({gt: 0}),
    orderController.getUserOrders)
router.get('/', checkRole("ADMIN"), orderController.getAllOrders)

router.put("/:orderId",
    param("orderId").not().isEmpty().isInt({gt: 0}),

    body("name").not().isEmpty().isString().trim().escape(),
    body("email").isEmail().isString().trim().escape(),
    body("date").not().isEmpty(),
    body("time").not().isEmpty(),
    body("cityId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("masterId").not().isEmpty().not().isString().isInt({gt: 0}),
    body("sizeClockId").not().isEmpty().not().isString().isInt({gt: 0}),
    checkRole("ADMIN"), orderController.update)
router.delete("/:orderId",
    param("orderId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"),

    orderController.deleteOne)


module.exports = router