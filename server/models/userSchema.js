const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
    {
        chatter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: {
            type: String
        },
        creationDate: {
            type: Date,
            immutable: true,
            default: () => Date.now()
        },
    }
)

const friendSchema = new mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
            type: Number,
            enums: [0, 1, 2, 3] // 0: add friend, 1: requested, 2: pending, 3: friends 
        },
        chats: [chatSchema]
        // chats: [{ type: String, ref: 'Chat' }]
    }
)

const userSchema = new mongoose.Schema( 
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
        },
        joinDate: {
            type: Date,
            immutable: true,
            default: () => Date.now()
        },
        profileBio: {
            type: String,
            maxlength: 150
        },
        joinedServers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friend' }]
    }
)

const User = mongoose.model('User', userSchema)
const Friend = mongoose.model('Friend', friendSchema)

module.exports = { User, Friend }