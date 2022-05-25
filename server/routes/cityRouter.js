const express = require('express')
const router = express.Router()
const cityController = require("../controllers/cityController")
const checkRole = require("../middleware/checkRoleMiddleware")
const {body, param} = require('express-validator');


router.post("/",
    body("name").not().isEmpty().isString().trim().escape(),
    checkRole("ADMIN"),
    cityController.create)

router.put('/:cityId',
    body("name").not().isEmpty().isString().trim().escape(),
    param("cityId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"),
    cityController.update)

router.delete('/:cityId',
    param("cityId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"),
    cityController.deleteOne)

router.get('/', cityController.getAll)

module.exports = router