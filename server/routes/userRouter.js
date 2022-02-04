const express = require('express')
const router = express.Router()
const userController =require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require('express-validator');


router.post("/registration",body('email').isEmail(),userController.registration)
router.post('/login',userController.login)
router.get('/auth',authMiddleware,userController.check)
module.exports = router
