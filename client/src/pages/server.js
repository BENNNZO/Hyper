import React, { useState, useEffect, useRef } from 'react';
import axios from '../utils/Axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'
import { MeetingProvider, useParticipant, useMeeting } from "@videosdk.live/react-sdk";

import plusIcon from '../assets/svg/plus-icon.svg'
import arrowIcon from '../assets/svg/arrow-forward.svg'
import volumeIcon from '../assets/svg/volume-max-icon.svg'
import chatIcon from '../assets/svg/5.svg'
import leaveButton from '../assets/svg/close-outline.svg'
import micOnIcon from '../assets/svg/mic-outline.svg'
import micOffIcon from '../assets/svg/mic-off-outline.svg'
import webcamOnIcon from '../assets/svg/videocam-outline.svg'
import webcamOffIcon from '../assets/svg/videocam-off-outline.svg'

export default function Server() {
    let token = Cookies.get('authToken')

    let { serverId } = useParams()

    let chatRef = useRef()
    let textRef = useRef()
    let voiceRef = useRef()
    let chatAreaRef = useRef()

    const [currentUser, setCurrentUser] = useState({})
    const [currentChats, setCurrentChats] = useState([])
    const [currentServer, setCurrentServer] = useState({})
    const [activeTextChannel, setActiveTextChannel] = useState('')
    const [activeVoiceChannel, setActiveVoiceChannel] = useState('')
    const [createText, setCreateText] = useState(false)
    const [createVoice, setCreateVoice] = useState(false)
    const [joined, setJoined] = useState(false)
    const [localMic, setLocalMic] = useState(true)
    const [localWebcam, setLocalWebcam] = useState(false)

    useEffect(() => {
        axios.get(`/server/${serverId}`)
            .then(res => {
                setCurrentServer(res.data)
                console.log(res.data)
                res.data.textChannels[0]._id !== undefined ? setActiveTextChannel(res.data.textChannels[0]._id) : setActiveTextChannel('')
            })
        axios.get(`/users/${Cookies.get('id')}`)
            .then(res => setCurrentUser(res.data.username))
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

    const MeetingView = (props) => {
        const { join, leave, toggleMic, toggleWebcam, participants } = useMeeting()
        const meeting = useMeeting()
        console.log(meeting)

        return (
            <>
                <div className={`channel-button ${props.roomId === activeVoiceChannel ? 'active-channel' : ''}`} onClick={() => {
                    if (joined === false) {
                        join()
                        setActiveVoiceChannel(props.roomId)
                        setJoined(true)
                    } else {
                        console.log('already joined in a server')
                    }
                }}>
                    <p>{props.roomId}</p>
                    <h3><img src={volumeIcon} alt="voice channel icon" />{props.channelName}</h3>
                </div>
                <div className={`call-controls ${props.roomId === activeVoiceChannel ? 'joined-active' : ''}`} style={{ width: chatAreaRef.current.offsetWidth }}>
                    <div className='controls'>
                        <button style={{backgroundColor: 'salmon'}} onClick={() => {
                            leave()
                            setJoined(false)
                            setLocalMic(true)
                            setActiveVoiceChannel('')
                        }}>
                            <img src={leaveButton} alt="leave call" />
                        </button>
                        <button style={localMic ? {backgroundColor: 'white'} : {backgroundColor: '#4a4a4a'}} onClick={() => {
                            toggleMic()
                            setLocalMic(!localMic)
                        }}>
                            {localMic ? <img src={micOnIcon} alt='toggle mic button' style={{filter: 'invert(0)'}}></img> : <img src={micOffIcon} alt='toggle mic button' style={{filter: 'invert(1)'}}></img>}
                        </button>
                        <button style={localWebcam ? {backgroundColor: 'white'} : {backgroundColor: '#4a4a4a'}} onClick={() => {
                            toggleWebcam()
                            setLocalWebcam(!localWebcam)
                        }}>
                            {localWebcam ? <img src={webcamOnIcon} alt='toggle mic button' style={{filter: 'invert(0)'}}></img> : <img src={webcamOffIcon} alt='toggle mic button' style={{filter: 'invert(1)'}}></img>}
                        </button>
                    </div>
                    <div className='participants'>
                        {[...participants.keys()].map((participantId, index) => (
                            <ParticipantView key={index} participantId={participantId} />
                        ))}
                    </div>
                </div>
            </>
        )
    };

    const ParticipantView = ({ participantId }) => {
        const { displayName, micOn, webcamOn, webcamStream, micStream, isLocal } = useParticipant(participantId)

        const webcamRef = useRef(null)
        const micRef = useRef(null);

        useEffect(() => {
            if (webcamRef.current) {
                if (webcamOn && webcamStream) {
                    const mediaStream = new MediaStream();
                    mediaStream.addTrack(webcamStream.track);

                    webcamRef.current.srcObject = mediaStream;
                    webcamRef.current
                        .play()
                        .catch((error) =>
                            console.error("videoElem.current.play() failed", error)
                        );
                } else {
                    webcamRef.current.srcObject = null;
                }
            }
        }, [webcamStream, webcamOn]);

        useEffect(() => {
            if (micRef.current) {
                if (micOn && micStream) {
                    const mediaStream = new MediaStream();
                    mediaStream.addTrack(micStream.track);

                    micRef.current.srcObject = mediaStream;
                    micRef.current
                        .play()
                        .catch((error) =>
                            console.error("videoElem.current.play() failed", error)
                        );
                } else {
                    micRef.current.srcObject = null;
                }
            }
        }, [micStream, micOn]);

        return (
            <div className='participant-view'>
                <p className={webcamOn ? '' : 'weboff'}>{webcamOn ? displayName : `${displayName.split('')[0]}${displayName.split('')[1]}${displayName.split('')[2]}`}</p>
                <video width={'100%'} height={'100%'} ref={webcamRef} autoPlay></video>
                <audio ref={micRef} autoPlay muted={isLocal} />
            </div>
        )
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
                            <li key={voiceChannel._id}>
                                <MeetingProvider
                                    config={{
                                        meetingId: voiceChannel.roomId,
                                        name: currentUser,
                                        micEnabled: true,
                                        webcamEnabled: false,
                                    }}
                                    token={token}
                                    joinWithoutInteraction={false}
                                >
                                    <MeetingView channelName={voiceChannel.channelName} roomId={voiceChannel.roomId} part={'serverList'} />
                                </MeetingProvider>
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
                            <li key={textChannel._id}>
                                <div className={`channel-button ${textChannel._id === activeTextChannel ? 'active-channel' : ''}`} onClick={() => setActiveTextChannel(textChannel._id)}>
                                    <h3><img src={chatIcon} alt="text channel icon" />{textChannel.channelName}</h3>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className={`chat-area ${joined ? 'chat-area-joined' : ''}`} ref={chatAreaRef}>
                {joined ? <span></span> : ''}
                <ul className="chats">
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
                    <input type="text" placeholder='New chat' ref={chatRef} />
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