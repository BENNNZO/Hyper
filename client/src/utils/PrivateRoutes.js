import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom'
import axios from './Axios'

export default function PrivateRoutes() {
    const [auth, setAuth] = useState(true)
    
    useEffect(() => {
        axios.get('/users/verify')
            .then(res => setAuth(res.data))
    }, [])

    return auth ? <Outlet /> : <Navigate to='/login' />
}