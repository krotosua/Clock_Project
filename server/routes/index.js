const express = require('express')
const router = express.Router()
const cityRouter = require('./cityRouter')
const masterRouter = require('./masterRouter')
const orderRouter = require('./orderRouter')
const userRouter = require('./userRouter')
const sizeRouter = require('./sizeRouter')


router.use('/users', userRouter)
router.use('/cities', cityRouter)
router.use('/masters', masterRouter)
router.use('/orders', orderRouter)
router.use('/sizes', sizeRouter)

module.exports = router
