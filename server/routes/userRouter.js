const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const {body} = require('express-validator')
const checkRole = require("../middleware/checkRoleMiddleware");


router.post("/registration/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.registration)
router.post('/login/',
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.login)
router.post("/ordeReg/",
    body('email').isEmail(),
    userController.ordeReg)
router.get('/auth/', authMiddleware, userController.check)
router.get("/", checkRole("ADMIN"), userController.getAll)
router.delete('/:userId', checkRole("ADMIN"), userController.deleteOne)
module.exports = router
