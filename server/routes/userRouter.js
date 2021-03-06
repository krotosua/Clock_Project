const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const {body, param} = require('express-validator')
const checkRole = require("../middleware/checkRoleMiddleware");


router.post("/registration/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.registration)
router.post('/login/',
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.login)
router.get('/auth/', authMiddleware, userController.check)
router.get("/", checkRole("ADMIN"), userController.getAll)
router.delete('/:userId', checkRole("ADMIN"),
    param("userId").not().isEmpty().isInt({gt: 0}),
    userController.deleteOne)
module.exports = router
