const db = require('../config/connection')
const { User, Friend, Server } = require('../models')

db.once('open', async () => {
    console.log('connected')
    try {
        await User.deleteMany({})
        await Friend.deleteMany({})
        await Server.deleteMany({})
        console.log('successfully deleted all data')
    }
    catch {
        console.log('something went wrong while trying to delete all data')
    }
    process.exit(0)
})