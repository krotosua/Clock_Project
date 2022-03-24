const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require("../middleware/checkRoleMiddleware");


router.post("/registration/", userController.registration)
router.post('/login/', userController.login)
router.post("/ordeReg/", userController.ordeReg)
router.get('/auth/', authMiddleware, userController.check)
router.get("/allUsers/", checkRole("ADMIN"), userController.getAll)
router.delete('/delete/', checkRole("ADMIN"), userController.deleteOne)
module.exports = router
