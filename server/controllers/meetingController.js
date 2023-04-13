require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require('axios')

module.exports = {
    getToken(req, res) {
        const options = { expiresIn: "7d", algorithm: "HS256" };
        const payload = { apikey: process.env.VIDEOSDK_API_KEY, permissions: ["allow_join"] };
        const token = jwt.sign(payload, process.env.VIDEOSDK_SECRET_KEY, options);
        res.json({ token });
    },
    createMeeting(req, res) { 
        axios.post('https://api.videosdk.live/api/meetings', {}, {
            headers: { Authorization: req.body.token, "Content-Type": "application/json" }
        })
        .then(data => res.json({ meetingId: data.data.meetingId }))
    }
}