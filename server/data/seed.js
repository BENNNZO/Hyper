const db = require('../config/connection')
const { User, Server } = require('../models')
const { userData, serverData } = require('./data')

db.on('error', (err) => err)

db.once('open', async () => {
    console.log('connected')
    await User.deleteMany({})
    await User.collection.insertMany(userData)
    // await Server.deleteMany({})
    // await Server.collection.insertMany(serverData)
    process.exit(0)
})
