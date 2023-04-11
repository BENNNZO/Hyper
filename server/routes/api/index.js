const router = require('express').Router();

const usersRoutes = require('./userRoutes')
const serverRoutes = require('./serverRoutes')
const meetingRoutes = require('./meetingRoutes')

router.use('/users', usersRoutes)
router.use('/server', serverRoutes)
router.use('/meeting', meetingRoutes)

module.exports = router