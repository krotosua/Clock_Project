const express = require('express')
const router = express.Router()
const userController =require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require('express-validator');


router.post("/registration",body('email').isEmail(),userController.registration)
router.post('/login',body('email').isEmail(),userController.login)
router.post("/ordereg",userController.ordereg)
router.get('/auth',authMiddleware,userController.check)
module.exports = router
