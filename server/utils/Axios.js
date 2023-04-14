const axios = require('axios')
require('dotenv').config()

module.exports = axios.create({
    baseURL: `${process.env.BASE_URL}/api`,
    withCredentials: true
})