import React, { useState, useEffect, useRef } from 'react';
import Meeting from '../components/meeting'
import axios from '../utils/Axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'

import plusIcon from '../assets/svg/plus-icon.svg'
import arrowIcon from '../assets/svg/arrow-forward.svg'
import volumeIcon from '../assets/svg/volume-max-icon.svg'
import chatIcon from '../assets/svg/5.svg'

export default function Server() {

    let { serverId } = useParams()

    let chatRef = useRef()
    let voiceRef = useRef()
    let textRef = useRef()

    const [currentServer, setCurrentServer] = useState({})
    const [currentChats, setCurrentChats] = useState([])
    const [activeTextChannel, setActiveTextChannel] = useState('')
    const [activeVoiceChannel, setActiveVoiceChannel] = useState('')
    const [createText, setCreateText] = useState(false)
    const [createVoice, setCreateVoice] = useState(false)

    const [authToken, setAuthToken] = useState('')

    useEffect(() => {
        axios.get(`/server/${serverId}`)
            .then(res => {
                setCurrentServer(res.data)
                res.data.textChannels[0]._id !== undefined ? setActiveTextChannel(res.data.textChannels[0]._id) : setActiveTextChannel('')
            })
        updateChats()
    }, [serverId])

    useEffect(() => {
        updateChats()
        // const timer = setInterval(() => {
        //     updateChats()
        //     console.log(activeTextChannel)
        //     console.log('activeTextChannel')
        // }, 1000)
        
        // return () => clearInterval(timer)
    }, [activeTextChannel])

    function updateData() {
        axios.get(`/server/${serverId}`)
            .then(res => {
                setCurrentServer(res.data)
            })
        updateChats()
    }

    function updateChats() {
        axios.post('/server/channelchats', {
            serverId: serverId,
            textChannelId: activeTextChannel
        })
        .then(res => {
            try {
                setCurrentChats(res.data.textChannels[0].chats.reverse())
            }
            catch {
                setCurrentChats([])
            }
        })
    }

    function handleAddVoiceChannel(e) {
        e.preventDefault()
        setCreateVoice(false)
        axios.post('/server/voice', {
            serverId: serverId,
            channelName: voiceRef.current.value
        })
        .then(() => {
            voiceRef.current.value = ''
            updateData()    
        })
    }

    function handleAddTextChannel(e) {
        e.preventDefault()
        setCreateText(false)
        axios.post('/server/text', {
            serverId: serverId,
            channelName: textRef.current.value
        })
        .then(() => {
            textRef.current.value = ''
            updateData()    
        })
    }

    function handleNewChat(e) {
        e.preventDefault()
        axios.post('/server/chat', {
            serverId: serverId,
            textChannelId: activeTextChannel,
            userId: Cookies.get('id'),
            text: chatRef.current.value
        })
        .then(() => {
            updateChats()
            chatRef.current.value = ''
        })
    }

    return (
        <section className='wrapper-server'>
            <div className={`dialog ${createVoice ? 'dialog-active' : ''}`}>
                <div className="dialog-box">
                    <img onClick={() => setCreateVoice(false)} src={plusIcon} alt="close create new server dialog" className='xButton' />
                    <form onSubmit={handleAddVoiceChannel} className="input-positioning">
                        <input type="text" placeholder='Voice Channel Name' ref={voiceRef} />
                        <button>Create<img src={arrowIcon} alt='create server icon' /></button>
                    </form>
                </div>
            </div>
            <div className={`dialog ${createText ? 'dialog-active' : ''}`}>
                <div className="dialog-box">
                    <img onClick={() => setCreateText(false)} src={plusIcon} alt="close create new server dialog" className='xButton' />
                    <form onSubmit={handleAddTextChannel} className="input-positioning">
                        <input type="text" placeholder='Text Channel Name' ref={textRef} />
                        <button>Create<img src={arrowIcon} alt='create server icon' /></button>
                    </form>
                </div>
            </div>
            <div className='server-channels'>
                <h2>{currentServer.serverName !== undefined && currentServer.serverName.toUpperCase()}</h2>
                <span className="br">
                    <p>VOICE CHANNELS</p>
                    <img src={plusIcon} alt="add voice channel" onClick={() => setCreateVoice(true)} />
                </span>
                <ul>
                    {currentServer.voiceChannels !== undefined && currentServer.voiceChannels.map(voiceChannel => {
                        return (
                            <li key={voiceChannel._id} className={voiceChannel._id === activeVoiceChannel ? 'active-channel' : ''} onClick={() => setActiveVoiceChannel(voiceChannel._id)}>
                                <h3><img src={volumeIcon} alt="voice channel icon" />{voiceChannel.channelName}</h3>
                            </li>
                        )
                    })}
                </ul>
                <span className="br">
                    <p>TEXT CHANNELS</p>
                    <img src={plusIcon} alt="add text channel" onClick={() => setCreateText(true)} />
                </span>
                <ul>
                    {currentServer.textChannels !== undefined && currentServer.textChannels.map(textChannel => {
                        return (
                            <li key={textChannel._id} className={textChannel._id === activeTextChannel ? 'active-channel' : ''} onClick={() => setActiveTextChannel(textChannel._id)}>
                                <h3><img src={chatIcon} alt="text channel icon" />{textChannel.channelName}</h3>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className='chat-area'>
                <ul className="chats">
                    <Meeting />
                    {currentChats !== undefined && currentChats.map(chat => {
                        return (
                            <li key={chat._id}>
                                <p>{chat.chatter.username}</p>
                                <p>{chat.text}</p>
                            </li>
                        )
                    })}
                </ul>
                <form action="POST" onSubmit={handleNewChat}>
                    <input type="text" placeholder='New chat' ref={chatRef}/>
                    <button>Send</button>
                </form>
            </div>
            <div className='joined-users'>
                <ul>
                    {currentServer.joinedUsers !== undefined && currentServer.joinedUsers.map(user => {
                        return (
                            <li key={user._id}>
                                {user.username}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}