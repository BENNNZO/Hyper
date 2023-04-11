const cookieParser = require('cookie-parser')
const db = require('./config/connection')
const express = require('express')
const routes = require('./routes')
// const cors = require('cors')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.static('public'))
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`)
    })
})

db.on('error', (err) => err)