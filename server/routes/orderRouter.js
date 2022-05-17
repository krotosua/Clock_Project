const express = require('express')
const router = express.Router()
const orderController = require("../controllers/orderController")
const checkRole = require("../middleware/checkRoleMiddleware");


router.post("/", orderController.create,)
router.get('/:userId', checkRole("USER"), orderController.getUserOrders)
router.get('/', checkRole("ADMIN"), orderController.getAllOrders)
router.put("/:orderId", orderController.update)
router.delete("/:orderId", orderController.deleteOne)


module.exports = router