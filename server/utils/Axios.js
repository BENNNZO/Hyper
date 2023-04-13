const axios = require('axios')

module.exports = axios.create({
    baseURL: process.env.BASE_URL || `/api`,
    withCredentials: true
})