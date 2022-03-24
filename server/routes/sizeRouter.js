const express = require('express')
const router = express.Router()
const sizeController = require("../controllers/sizeController")
const checkRole = require("../middleware/checkRoleMiddleware")

router.post("/create/", checkRole("ADMIN"), sizeController.create)
router.get('/getSizes/', sizeController.getAll)
router.put('/update/', checkRole("ADMIN"), sizeController.update)
router.delete('/delete/', checkRole("ADMIN"), sizeController.deleteOne)


module.exports = router