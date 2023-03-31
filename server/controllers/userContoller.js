const { User, Friend } = require('../models')

module.exports = {

    /* ------------------------------- USER ROUTES ------------------------------ */

    getUsers(req, res) {
        User.find()
            .populate({ path: 'friends', populate: { path: 'requester', select: 'username' }})
            .populate({ path: 'friends', populate: { path: 'recipient', select: 'username' }})
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
        User.create(req.body)
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
            { $set: { status: 1 }}, 
            { upsert: true, new: true }
        ).then(data => {
            User.updateOne(
                { _id: req.params.id },
                { $push: { friends: data._id }}
            ).then(data => headers.push(data))
        })
        Friend.findOneAndUpdate(
            { requester: req.body.recipient, recipient: req.params.id },
            { $set: { status: 2 }},
            { upsert: true, new: true }
        ).then(data => {
            User.updateOne(
                { _id: req.body.recipient },
                { $push: { friends: data._id }}
            ).then(data => headers.push(data))
        })
        res.json(headers)
    },
    acceptFriendRequest(req, res) {
        const headers = []
        Friend.findOneAndUpdate(
            { requester: req.params.id, recipient: req.body.recipient }, 
            { $set: { status: 3 }}
        ).then(data => headers.push(data))
        Friend.findOneAndUpdate(
            { requester: req.body.recipient, recipient: req.params.id }, 
            { $set: { status: 3 }}
        ).then(data => headers.push(data))
        res.json(headers)
    },
    rejectFriendRequest(req, res) {
        const headers = []
        Friend.deleteOne({ requester: req.params.id, recipient: req.body.recipient })
            .then(data => {
                User.updateOne(
                    { _id: req.params.id },
                    { $pull: { friends: data._id }}
                ).then(data => headers.push(data))
            })
        Friend.deleteOne({ requester: req.body.recipient, recipient: req.params.id })
            .then(data => {
                User.updateOne(
                    { _id: req.body.recipient },
                    { $pull: { friends: data._id }}
                ).then(data => headers.push(data))
            })
        res.json(headers)
    }
}