const express = require('express')
const db = require('./config/connection')
// const routes = require('./routes')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(routes)

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`)
    })
})

db.on('error', function (err) {
    console.log(err)
})

app.get('/api', (req, res) => {
    let groups = [
        {
            groupName: 'chess club',
            memberCount: 5,
            meetingTime: '7pm'
        },
        {
            groupName: 'music club',
            memberCount: 24,
            meetingTime: '10am'
        },
        {
            groupName: 'gaming club',
            memberCount: 15,
            meetingTime: '2pm'
        }
    ]
    res.json(groups)
})