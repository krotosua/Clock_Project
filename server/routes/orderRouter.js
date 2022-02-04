const express = require('express')
const router = express.Router()
const orderController = require("../controllers/orderController")
const checkRole = require("../middleware/checkRoleMiddleware");
const {body} = require("express-validator");

router.post("/",body("name").isLength({min:3}),orderController.create)
router.get('/',orderController.getUserOrders)
router.get('/',checkRole("ADMIN"),orderController.getAllOrders)
router.put("/",orderController.update)
router.delete("/id:",orderController.deleteOne)


module.exports = router