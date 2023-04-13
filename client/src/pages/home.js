import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie'
import axios from '../utils/Axios'

import xButton from '../assets/svg/close-outline.svg'
import checkButton from '../assets/svg/checkmark-outline.svg'

export default function Home() {
    const friendRequestRef = useRef()
    const chatRef = useRef()

    const [userData, setUserData] = useState({})
    const [chats, setChats] = useState([])
    const [requestData, setRequestData] = useState('')
    const [activeDM, setActiveDM] = useState()

    useEffect(() => {
        setInterval(() => {
            axios.get(`/users/${Cookies.get('id')}`)
            .then(res => {
                setUserData(res.data)
            })
        }, 5000);
        setTimeout(() => {
            axios.get(`/users/${Cookies.get('id')}`)
            .then(res => {
                setUserData(res.data)
            })
        }, 500);
        return clearInterval()
    }, [])

    useEffect(() => {
        try {
            axios.get(`/users/dm/${activeDM.friendId}`)
            .then(res => {
                setChats(res.data.chats.reverse())
            })
            setInterval(() => {
                axios.get(`/users/dm/${activeDM.friendId}`)
                .then(res => {
                    setChats(res.data.chats.reverse())
                })
            }, 2500);

        } catch (err) {
            console.log(err)
        }
        return clearInterval()
    }, [activeDM])

    function handleFriendRequest(e) {
        e.preventDefault()
        if (friendRequestRef.current.value !== Cookies.get('id')) {
            axios.post(`/users/friends/${Cookies.get('id')}`, {
                recipient: friendRequestRef.current.value
            })

            axios.get(`/users/${friendRequestRef.current.value}`)
            .then(res => {
                if (res.data.username) {
                    setRequestData(`Request sent to ${res.data.username}`)
                } else {
                    setRequestData('No User Found')
                }
            })

            axios.get(`/users/${Cookies.get('id')}`)
            .then(res => {
                setUserData(res.data)
            })
        } else {
            setRequestData("You can't friend yourself!")
        }
        friendRequestRef.current.value = ''
    }

    function handleRemoveRequest(recipient) {
        axios.delete(`/users/friends/${Cookies.get('id')}`, {
            data: {
                recipient: recipient
            }
        })
        
        axios.get(`/users/${Cookies.get('id')}`)
        .then(res => {
            setUserData(res.data)
        })
    }

    function handleAcceptRequest(recipient) {
        axios.put(`/users/friends/${Cookies.get('id')}`, {
            recipient: recipient
        })

        axios.get(`/users/${Cookies.get('id')}`)
        .then(res => {
            setUserData(res.data)
        })
    }

    function handleNewDM(e) {
        e.preventDefault()
        axios.post(`/users/dm/${Cookies.get('id')}`, {
            recipient: activeDM.userId,
            text: chatRef.current.value
        })
        axios.get(`/users/dm/${activeDM.friendId}`)
        .then(res => {
            setChats(res.data.chats.reverse())
        })
        chatRef.current.value = ''
    }

    return (
        <section className='home-page'>
            <section className="friends-list">
                <button onClick={() => {navigator.clipboard.writeText(Cookies.get('id'))}}>Copy User ID</button>
                <h2>Friends</h2>
                <ul>
                    {userData.friends !== undefined && userData.friends.map((friend, index) => {
                        if (friend.status === 3) {
                            return <li key={index} onClick={() => setActiveDM({ userId: friend.recipient._id, friendId: friend._id })}>
                                {friend.recipient.username}
                            </li>
                        }
                    })}
                </ul>
            </section>
            <section className="dm-area">
                <ul>
                    {chats !== undefined && chats.map((chat, index) => {
                        return (
                            <li key={index}>
                                <p>{chat.chatter.username}</p>
                                <p>{chat.text}</p>
                            </li>
                        )
                    })}
                </ul>
                <form onSubmit={handleNewDM}>
                    <input type="text" placeholder='New chat' ref={chatRef}/>
                    <button>Send</button>
                </form>
            </section>
            <section className="friend-requests">
                <form onSubmit={handleFriendRequest}>
                    <h2>Add Friend</h2>
                    <input type="text" placeholder='User ID' ref={friendRequestRef} />
                    <button>Request</button>
                    <p>{requestData}</p>
                </form>
                <span className="br">Pending</span>
                <ul className='pending-requests'>
                    {userData.friends !== undefined && userData.friends.map((friend, index) => {
                        if (friend.status === 1) {
                            return <li key={index}>
                                <p>{friend.recipient.username}</p>
                                <img src={xButton} alt="stop pending request" onClick={() => handleRemoveRequest(friend.recipient._id)}/>
                            </li>
                        }
                    })}
                </ul>
                <span className="br">Recieved</span>
                <ul className='recieved-requests'>
                    {userData.friends !== undefined && userData.friends.map((friend, index) => {
                        if (friend.status === 2) {
                            return <li key={index}>
                                <p>{friend.recipient.username}</p>
                                <img src={xButton} alt="stop pending request" onClick={() => handleRemoveRequest(friend.recipient._id)}/>
                                <img src={checkButton} alt="accept pending request" onClick={() => handleAcceptRequest(friend.recipient._id)}/>
                            </li>
                        }
                    })}
                </ul>
            </section>
        </section>
    )
}