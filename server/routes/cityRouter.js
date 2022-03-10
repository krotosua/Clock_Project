const express = require('express')
const router = express.Router()
const cityController = require("../controllers/cityController")
const checkRole = require("../middleware/checkRoleMiddleware")


router.post("/", checkRole("ADMIN"), cityController.create)
router.get('/', cityController.getAll)
router.get('/:id', cityController.getOne)
router.put('/', checkRole("ADMIN"), cityController.update)
router.delete('/delete/', checkRole("ADMIN"), cityController.deleteOne)


module.exports = router