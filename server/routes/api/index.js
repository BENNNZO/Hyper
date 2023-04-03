const router = require('express').Router();

const userRoutes = require('./userRoutes')
const serverRoutes = require('./serverRoutes')

router.use('/users', userRoutes)
router.use('/server', serverRoutes)

module.exports = router