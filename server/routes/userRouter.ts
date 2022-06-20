import express from 'express'
import userController from '../controllers/userController'
import authMiddleware from '../middleware/authMiddleware'
import checkRole from "../middleware/checkRoleMiddleware"
import {body, param} from 'express-validator';

const userRouter = express.Router()

userRouter.post("/registration/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('isMaster').isBoolean(),
    body("name").not().isEmpty().isString().trim().escape(),
    userController.registration)

userRouter.post("/registrationAdmin/",
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.registrationFromAdmin)

userRouter.post('/login/',
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.login)

userRouter.get('/auth/', authMiddleware, userController.check)

userRouter.get('/checkEmail/',
    body('email').isEmail(),
    userController.checkEmail)

userRouter.put('/activate/:userId',
    param("userId").not().isEmpty().isInt({gt: 0}),
    body("isActivated").not().isEmpty().isBoolean(),
    checkRole("ADMIN"), userController.activateAdmin)

userRouter.get('/activate/:link', userController.activate)

userRouter.get("/", checkRole("ADMIN"), userController.getAll)

userRouter.put('/:userId',
    param("userId").not().isEmpty().isInt({gt: 0}),
    checkRole("ADMIN"), userController.updateUser)

userRouter.delete('/:userId', checkRole("ADMIN"),
    param("userId").not().isEmpty().isInt({gt: 0}),
    userController.deleteOne)
export default userRouter
