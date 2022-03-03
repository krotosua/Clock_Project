const express = require('express')
const router = express.Router()
const cityRouter = require('./cityRouter')
const masterRouter = require('./masterRouter')
const orderRouter = require('./orderRouter')
const userRouter = require('./userRouter')
const sizeRouter = require('./sizeRouter')


router.use('/user', userRouter)
router.use('/city', cityRouter)
router.use('/master', masterRouter)
router.use('/order', orderRouter)
router.use('/size', sizeRouter)

module.exports = router
