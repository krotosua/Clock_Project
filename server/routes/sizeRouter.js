const express = require('express')
const router = express.Router()
const sizeController = require("../controllers/sizeController")
const checkRole = require("../middleware/checkRoleMiddleware")
const {body, query, param} = require("express-validator");

router.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole("ADMIN"), sizeController.create)
router.get('/', sizeController.getAll)
router.put('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole("ADMIN"), sizeController.update)
router.delete('/:sizeId',
    param("sizeId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"), sizeController.deleteOne)


module.exports = router