const User = require('./userSchema')
const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema (
    {
        channelName: {
            type: String,
            maxlength: 20,
            require: true
        },
        voice: {
            type: Boolean,
            require: true
        }
    }
)

const chatSchema = new mongoose.Schema (
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
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

const serverSchema = new mongoose.Schema (
    {
        serverName: {
            type: String,
            maxlength: 20
        },
        channels: [channelSchema],
        chats: [chatSchema]
    }
)

const Server = mongoose.model('Server', serverSchema)

module.exports = Server