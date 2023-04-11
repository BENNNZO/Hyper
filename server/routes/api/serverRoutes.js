const router = require('express').Router()
const { 
    getAllServers,
    findServer,
    createServer,
    chatServer,
    newTextChannel,
    newVoiceChannel,
    delServerChat,
    delVoiceChannel,
    delTextChannel,
    retrieveChat
} = require('../../controllers/serverController')

router.route('/')
    .get(getAllServers)

router.route('/text')
    .post(newTextChannel)
    .delete(delTextChannel)

router.route('/channelchats')
    .post(retrieveChat)
    
router.route('/voice')
    .post(newVoiceChannel)
    .delete(delVoiceChannel)

router.route('/chat')
    .post(chatServer)
    .delete(delServerChat)
    
router.route('/:id')
    .get(findServer)
    .post(createServer)

module.exports = router