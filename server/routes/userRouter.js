const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const {body, param} = require('express-validator')
const checkRole = require("../middleware/checkRoleMiddleware");


router.post("/registration/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('isMaster').isBoolean(),
    body("name").not().isEmpty().isString().trim().escape(),
    userController.registration)
router.post("/registrationAdmin/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.registrationFromAdmin)
router.post("/admreg/",
    userController.adminreg)
router.post('/login/',
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.login)
router.get('/auth/', authMiddleware, userController.check)

router.get('/checkEmail/',
    body('email').isEmail(),
    userController.checkEmail)

router.put('/activate/:userId',
    param("userId").not().isEmpty().isInt({gt: 0}),
    body("isActivated").not().isEmpty().isBoolean(),
    checkRole("ADMIN"), userController.activateAdmin)

router.get('/activate/:link', userController.activate)

router.get("/", checkRole("ADMIN"), userController.getAll)

router.put('/:userId',
    param("userId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"), userController.updateUser)

router.delete('/:userId', checkRole("ADMIN"),
    param("userId").not().isEmpty().isInt({gt: 0}),
    userController.deleteOne)
module.exports = router
