// const userLogic = require("./businessLogic/userLogic");
// const bcrypt = require("bcrypt");
// const {User} = require("./models/models");
// const ApiError = require("./error/ApiError");
//
// async adminreg(req, res, next) {
//     await userLogic.adminreg(req, res, next)
// }
//
//
// async adminreg(req, res, next) {
//     try {
//         const {email, password, role} = req.body
//         let isActivated = true
//         const hashPassword = await bcrypt.hash(password, 5)
//
//         const user = await User.create({email, role, password: hashPassword, isActivated})
//
//         return res.status(201).json({user})
//
//     } catch (e) {
//         next(ApiError.badRequest(e.message))
//     }
// }
//
// async adminreg(req, res, next) {
//     await userLogic.adminreg(req, res, next)
// }
// const userController = require("./controllers/userController");
// router.post("/admreg/",
//     userController.adminreg)