import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom'
import axios from './Axios'

export default function PrivateRoutes() {
    const [auth, setAuth] = useState(true)
    
    useEffect(() => {
        axios.get('/users/verify')
            .then(res => {
                setAuth(res.data)
                res.data === true ? axios.get('/meeting/get-token').then(res => document.cookie = `authToken=${res.data.token}`) : document.cookie = `authToken=not-verified`
            })
    }, [])

    return auth ? <Outlet /> : <Navigate to='/login' />
}