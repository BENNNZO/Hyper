const bcrypt = require('bcrypt')
const { User, Friend, Chat } = require('../models')

module.exports = {

    /* ------------------------------- USER ROUTES ------------------------------ */

    getUsers(req, res) {
        User.find()
            .populate({ path: 'friends', populate: { path: 'requester', select: 'username' }})
            .populate({ path: 'friends', populate: { path: 'recipient', select: 'username' }})
            .populate({ path: 'friends', populate: { path: 'chats' }})
            .then(users => res.json(users))
            .catch(err => res.json(err))
    },
    findUser(req, res) {
        User.find({ _id: req.params.id })
            .populate({ path: 'friends', populate: { path: 'requester', select: 'username' }})
            .populate({ path: 'friends', populate: { path: 'recipient', select: 'username' }})
            .then(user => res.json(user))
            .catch(err => res.json(err))
    },
    editUser(req, res) {
        User.updateOne({ _id: req.params.id }, { $set: req.body })
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    createUser(req, res) {
        const hashedPass = bcrypt.hashSync(req.body.password, 10);
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    deleteUser(req, res) {
        User.deleteOne({ _id: req.params.id })
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },

    /* ------------------------------ FRIEND ROUTES ----------------------------- */

    findUsersFriends(req, res) {
        User.findOne({ _id: req.params.id }, 'friends')
            .populate({ path: 'friends', populate: { path: 'requester', select: 'username' }})
            .populate({ path: 'friends', populate: { path: 'recipient', select: 'username' }})
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    async requestUserFriends(req, res) {
        const headers = []
            Friend.findOneAndUpdate(
                { requester: req.params.id, recipient: req.body.recipient },
                { $setOnInsert: { status: 1 }}, 
                { upsert: true, new: true, overwrite: false }
            ).then(data => {
                User.findOneAndUpdate(
                    { _id: req.params.id, friends: { $nin: data._id }},
                    { $push: { friends: data._id }} 
                ).then(data => headers.push(data))
            })
            Friend.findOneAndUpdate(
                { requester: req.body.recipient, recipient: req.params.id },
                { $setOnInsert: { status: 2 }},
                { upsert: true, new:true, overwrite: true }
            ).then(data => {
                User.findOneAndUpdate(
                    { _id: req.body.recipient, friends: { $nin: data._id }},
                    { $push: { friends: data._id }}
                ).then(data => headers.push(data))
            })
        res.json(headers)
    },
    acceptFriendRequest(req, res) {
        Friend.updateMany(
            { $or: [{ requester: req.params.id, recipient: req.body.recipient }, { recipient: req.params.id, requester: req.body.recipient }] }, 
            { $set: { status: 3 }}
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    },
    rejectFriendRequest(req, res) {
        const headers = []
        Friend.findOneAndDelete(
            { requester: req.params.id, recipient: req.body.recipient }
            ).then(data => {
                if (data) User.updateOne(
                    { _id: req.params.id },
                    { $pull: { friends: data._id }}
                ).then(data => headers.push(data))
            })
        Friend.findOneAndDelete(
            { requester: req.body.recipient, recipient: req.params.id }
            ).then(data => {
                if (data) User.updateOne(
                    { _id: req.body.recipient },
                    { $pull: { friends: data._id }}
                ).then(data => headers.push(data))
            })
        res.json(headers)
    },

    /* ------------------------------ FRIEND CHATS ------------------------------ */

    getFriendDM(req, res) {
        Friend.findById(req.params.id, 'chats')
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    sendFriendDM(req, res) {
        Friend.updateMany(
            { $or: [{ requester: req.params.id, recipient: req.body.recipient }, { recipient: req.params.id, requester: req.body.recipient }], status: 3 }, 
            { $push: { chats: { chatter: req.params.id, text: req.body.text }}}            
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    },
    deleteFriendDM(req, res) {
        Friend.updateMany(
            { $or: [{ requester: req.params.id, recipient: req.body.recipient }, { recipient: req.params.id, requester: req.body.recipient }], status: 3 },
            { $pull: { chats: { _id: req.body.chatId }}}  
        ).then(data => res.json(data))
        .catch(err => res.json(err))
    }
}