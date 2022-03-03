const express = require('express')
const router = express.Router()
const orderController = require("../controllers/orderController")
const checkRole = require("../middleware/checkRoleMiddleware");


router.post("/", orderController.create)
router.get('/:id', orderController.getUserOrders)
router.get('/', checkRole("ADMIN"), orderController.getAllOrders)
router.put("/", orderController.update)
router.delete("/", orderController.deleteOne)


module.exports = router