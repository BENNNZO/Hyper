require("dotenv").config();
const { Server, User } = require('../models')
const axios = require('../utils/Axios')

module.exports = {
    getAllServers(req, res) {
        Server.find()
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    findServer(req, res) {
        Server.findOne({ _id: req.params.id })
            .populate({ path: 'joinedUsers', model: 'User' })
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    createServer(req, res) {
        console.log('sending request')
        axios.post('/meeting/create-meeting', { token: req.cookies.authToken })
            .then(response => {
                console.log('data recieved')
                Server.create({
                    serverName: req.body.serverName,
                    joinedUsers: req.params.id,
                    voiceChannels: {
                        channelName: 'default',
                        roomId: response.data.meetingId
                    },
                    textChannels: {
                        channelName: 'default'
                    }
                }).then(data => {
                    console.log('setting user data')
                    User.findOneAndUpdate(
                        { _id: req.params.id },
                        { $push: { joinedServers: data._id }},
                        { new: true }
                    ).then(userData => res.json({data, userData}))
                    .catch(err => res.json(err))
                }).catch(err => res.json(err))
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    },
    addServer(req, res) {
        Server.findOneAndUpdate(
            { _id: req.body.serverId, joinedUsers: { $ne: req.params.id } },
            { $push: {joinedUsers: req.params.id }},
            { new: true }
        ).then(data => {
            console.log(data)
            User.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { joinedServers: data.data._id }},
                { new: true }
            ).then(data2 => {
                console.log(data2)
                res.json(data2)
            })
        })
        .catch(err => res.json(err))
    },
    newTextChannel(req, res) {
        Server.findOneAndUpdate(
            { _id: req.body.serverId },
            { $push: { textChannels: { channelName: req.body.channelName }}},
            { new: true }
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    },
    delTextChannel(req, res) {
        Server.findOneAndUpdate(
            { _id: req.body.serverId },
            { $pull: { textChannels: { _id: req.body.channelId }}},
            { new: true }
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    },
    newVoiceChannel(req, res) {
        axios.post('/meeting/create-meeting', { token: req.cookies.authToken })
        .then(response => {
            Server.findOneAndUpdate(
                { _id: req.body.serverId },
                { $push: { voiceChannels: { channelName: req.body.channelName, roomId: response.data.meetingId }}},
                { upsert: true, new: true }
            ).then(data => res.json(data))
            .catch(err => res.json(err))
        })
    },
    delVoiceChannel(req, res) {
        Server.findOneAndUpdate(
            { _id: req.body.serverId },
            { $pull: { voiceChannels: { _id: req.body.channelId }}},
            { new: true }
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    },
    chatServer(req, res) {
        Server.findOneAndUpdate(
            { _id: req.body.serverId, 'textChannels._id': req.body.textChannelId },
            { $push: { 'textChannels.$.chats': { chatter: req.body.userId, text: req.body.text }}},
            { new: true }
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    },
    delServerChat(req, res) {
        Server.findOneAndUpdate(
            { _id: req.body.serverId, 'textChannels._id': req.body.textChannelId },
            { $pull: { 'textChannels.$.chats': { _id: req.body.chatId }}},
            { new: true }
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    },
    retrieveChat(req, res) {
        Server.findOne(
            { _id: req.body.serverId },
            { 'textChannels': { $elemMatch: { _id: req.body.textChannelId }}}
        ).populate({ path: 'textChannels.chats.chatter', model: 'User' })
        .then(data => res.json(data))
        .catch(err => res.json(err))
    }
}