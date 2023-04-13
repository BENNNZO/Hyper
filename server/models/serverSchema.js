const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema (
    {
        chatter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: {
            type: String,
            maxlength: 200,
            require: true
        },
        dateCreated: {
            type: Date,
            default: () => Date.now()
        }
    }
)

const voiceChannelSchema = new mongoose.Schema (
    {
        channelName: {
            type: String,
            maxlength: 20,
            require: true
        },
        roomId: {
            type: String,
            require: true
        }
    }
)

const textChannelSchema = new mongoose.Schema (
    {
        channelName: {
            type: String,
            maxlength: 20,
            require: true
        },
        chats: [chatSchema]
    }
)

const serverSchema = new mongoose.Schema (
    {
        serverName: {
            type: String,
            require: true,
            maxlength: 20
        },
        joinedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
        voiceChannels: [voiceChannelSchema],
        textChannels: [textChannelSchema]
        // textChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TextChannel' }]
    }
)

const Server = mongoose.model('Server', serverSchema)
const TextChannel = mongoose.model('TextChannel', textChannelSchema)
const VoiceChannel = mongoose.model('VoiceChannel', voiceChannelSchema)
const Chats = mongoose.model('Chats', chatSchema)

module.exports = { Server, TextChannel, VoiceChannel, Chats }