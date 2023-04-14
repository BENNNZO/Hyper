require("dotenv").config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
        .then(data => {
            res.json({ meetingId: data.data.meetingId })
        })
    },
    validateMeeting(req, res) {
        const token = req.body.token;
        const meetingId = req.params.meetingId;

        const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings/${meetingId}`;

        const options = {
            method: "POST",
            headers: { Authorization: token },
        };

        fetch(url, options)
            .then((response) => response.json())
            .then((result) => res.json(result))
            .catch((error) => console.error("error", error));
    }
}