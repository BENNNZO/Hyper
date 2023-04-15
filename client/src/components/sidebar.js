import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from '../utils/Axios'

import plusIcon from '../assets/svg/plus-icon.svg'
import arrowIcon from '../assets/svg/arrow-forward.svg'

export default function Sidebar() {
    const navigate = useNavigate()

    const serverNameRef = useRef()
    const serverIdRef = useRef()

    const [userData, setUserData] = useState(null)
    const [createServer, setCreateServer] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initCookies = setInterval(() => {
            if (Cookies.get('id') !== undefined) {
                axios.get(`/users/${Cookies.get('id')}`)
                    .then(res => setUserData(res.data))
                clearInterval(initCookies)
            }
        }, 100);
    }, [])

    useEffect(() => {
        (userData !== null) ? setLoading(false) : setLoading(true)
    }, [userData])

    function handleCreateServerSubmit(e) {
        e.preventDefault()
        if (serverNameRef.current.value !== '') {
            axios.post(`/server/${Cookies.get('id')}`, {
                serverName: serverNameRef.current.value
            })
            .then(() => {
                axios.get(`/users/${Cookies.get('id')}`)
                    .then(res => setUserData(res.data))
            })
            setCreateServer(!createServer)
        }
    }

    function handleAddServerSubmit(e) {
        e.preventDefault()
        if (serverIdRef.current.value !== '') {
            axios.post(`/server/add/${Cookies.get('id')}`, {
                serverId: serverIdRef.current.value.trim()
            })
            .then(() => {
                axios.get(`/users/${Cookies.get('id')}`)
                    .then(res => setUserData(res.data))
            })
            setCreateServer(!createServer)
        }
        serverIdRef.current.value = ''
    }

    if (loading) {
        return <h1>loading</h1>
    } else {
        return (
            <>
                <div className={`create-server-dialog ${createServer ? 'create-server-active' : ''}`}>
                    <div className="dialog-box">
                        <img onClick={() => setCreateServer(!createServer)} src={plusIcon} alt="close create new server dialog" className='xButton' />
                        <p>Create Server:</p>
                        <form onSubmit={handleCreateServerSubmit} className="input-positioning">
                            <input type="text" placeholder='Server Name' ref={serverNameRef} />
                            <button>Create<img src={arrowIcon} alt='create server icon' /></button>
                        </form>
                        <p>Add Existing Server:</p>
                        <form onSubmit={handleAddServerSubmit} className="input-positioning">
                            <input type="text" placeholder='Server ID' ref={serverIdRef} />
                            <button>Add<img src={arrowIcon} alt='create server icon' /></button>
                        </form>
                    </div>
                </div>
                <section className='wrapper-sidebar'>
                    <button className="profile-icon" onClick={() => navigate(`/`)}>
                        <p>{(userData.username !== undefined) ? userData.username.split('')[0].toUpperCase() : 'loading'}</p>
                    </button>
                    <span className="br"></span>
                        <ul>
                            {userData.joinedServers !== undefined && userData.joinedServers.map(server => {
                                return (
                                    <li key={server._id} onClick={() => navigate(`/${server._id}`)}>
                                        <p>{server.serverName.split('')[0].toUpperCase()}</p>
                                        <span>{server.serverName}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    <span className="br"></span>
                    <button className="create-server" onClick={() => setCreateServer(!createServer)}>
                        <img src={plusIcon} alt="create new server" />
                    </button>
                </section>
                <section className="main-content-positioning">
                    <Outlet />
                </section>
            </>
        )
    }

}