const express = require('express')
const router = express.Router()
const masterController = require("../controllers/masterController")
const checkRole = require("../middleware/checkRoleMiddleware")



router.post("/",checkRole("ADMIN"),masterController.create)
router.get('/',masterController.getAll)
router.get('/:id',masterController.getOne)
router.put('/',checkRole("ADMIN"),masterController.update)
router.delete('/:id',checkRole("ADMIN"),masterController.deleteOne)


module.exports = router