import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoutes from './utils/PrivateRoutes';

import Login from './pages/login'
import Signup from './pages/signup'
import Home from './pages/home'
import Server from './pages/server'

import Sidebar from './components/sidebar'

import './styles/index.scss'
import './styles/login.scss'
import './styles/server.scss'
import './styles/sidebar.scss'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route element={<PrivateRoutes />}>
                    <Route path='/' element={<Sidebar />}>
                        <Route index element={<Home />} />
                        <Route path='/:serverId' element={<Server />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}