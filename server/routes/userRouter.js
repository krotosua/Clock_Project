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
    userController.registration)
router.post("/admreg/",
    userController.adminreg)
router.post("/registrationAdm/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('isMaster').isBoolean(),


    userController.registrationFromAdmin)
router.post('/login/',
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.login)
router.get('/auth/', authMiddleware, userController.check)
router.get('/activate/:link', userController.activate)
router.get("/", checkRole("ADMIN"), userController.getAll)
router.put('/:userId',
    param("userId").not().isEmpty().isInt({gt: 0}),
    body("name").not().isEmpty().isString().trim().escape(),
    body("date").not().isEmpty().isString(),
    checkRole("ADMIN"), userController.updateUser)
router.delete('/:userId', checkRole("ADMIN"),
    param("userId").not().isEmpty().isInt({gt: 0}),
    userController.deleteOne)
module.exports = router
