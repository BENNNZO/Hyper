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
    delTextChannel
} = require('../../controllers/serverController')

router.route('/')
    .get(getAllServers)

router.route('/:id')
    .get(findServer)
    .post(createServer)

router.route('/text')
    .post(newTextChannel)
    .delete(delTextChannel)
    
router.route('/voice')
    .post(newVoiceChannel)
    .delete(delVoiceChannel)

router.route('/chat/:id')
    .post(chatServer)

router.route('/chat')
    .delete(delServerChat)

module.exports = router