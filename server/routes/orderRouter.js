const express = require('express')
const router = express.Router()
const orderController = require("../controllers/orderController")
const checkRole = require("../middleware/checkRoleMiddleware");


router.post("/create/", orderController.create)
router.post("/message/", orderController.sendMessage)
router.get('/userOrders/:id', checkRole("USER"), orderController.getUserOrders)
router.get('/allOrders/', checkRole("ADMIN"), orderController.getAllOrders)
router.put("/update/", orderController.update)
router.delete("/delete/", orderController.deleteOne)


module.exports = router