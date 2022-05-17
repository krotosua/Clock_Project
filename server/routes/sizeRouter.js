const express = require('express')
const router = express.Router()
const sizeController = require("../controllers/sizeController")
const checkRole = require("../middleware/checkRoleMiddleware")

router.post("/", checkRole("ADMIN"), sizeController.create)
router.get('/', sizeController.getAll)
router.put('/:sizeId', checkRole("ADMIN"), sizeController.update)
router.delete('/:sizeId', checkRole("ADMIN"), sizeController.deleteOne)


module.exports = router