const express = require('express')
const router = express.Router()
const masterController = require("../controllers/masterController")
const checkRole = require("../middleware/checkRoleMiddleware")
const {body, param, query} = require('express-validator');


router.post("/",

    body("name").not().isEmpty().isString().trim().escape(),
    body("rating").not().isEmpty().not().isString().isInt({gt: -1, lt: 6}),
    body("cityId").not().isEmpty().isArray()
    , masterController.create)
router.get('/', masterController.getAll)
router.get('/:cityId',

    param("cityId").not().isEmpty().isInt({gt: 0}),
    query("date").not().isEmpty().isString(),
    query("time").not().isEmpty().isString(),
 
    masterController.getMastersForOrder)
router.put('/:masterId',

    param("masterId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("rating").not().isEmpty().not().isString().isInt({gt: -1, lt: 6}),
    body("cityId").not().isEmpty().isArray(),

    checkRole("ADMIN"), masterController.update)
router.delete('/:masterId',

    param("masterId").not().isEmpty().isInt({gt: 0}),

    checkRole("ADMIN"), masterController.deleteOne)


module.exports = router