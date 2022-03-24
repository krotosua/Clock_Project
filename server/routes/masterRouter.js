const express = require('express')
const router = express.Router()
const masterController = require("../controllers/masterController")
const checkRole = require("../middleware/checkRoleMiddleware")


router.post("/create/", checkRole("ADMIN"), masterController.create)
router.get('/getAll/', masterController.getAll)
router.put('/update/', checkRole("ADMIN"), masterController.update)
router.delete('/delete/', checkRole("ADMIN"), masterController.deleteOne)


module.exports = router