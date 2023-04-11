import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from '../utils/Axios'

export default function Login() {

    let navigate = useNavigate()

    const emailRef = useRef()
    const passwordRef = useRef()

    const [email, setEmail] = useState('E-Mail')
    const [emailStyle, setEmailStyle] = useState({backgroundColor: 'white'})
    const [password, setPassword] = useState('Password')
    const [passwordStyle, setPasswordStyle] = useState({backgroundColor: 'white'})

    async function handleLogin(e) {
        e.preventDefault()
        axios.post('/users/login', {
            email: emailRef.current.value,
            password: passwordRef.current.value
        })
        .then(res => {
            setEmail('E-Mail')
            setEmailStyle({backgroundColor: 'white'})
            setPassword('Password')
            setPasswordStyle({backgroundColor: 'white'})
            if (res.data === 'e') {
                setEmail('No user with that email')
                setEmailStyle({backgroundColor: '#ffcccc'})
                emailRef.current.value = ''
            } else if (res.data === 'p') {
                setPassword('Wrong Password')
                setPasswordStyle({backgroundColor: '#ffcccc'})
                passwordRef.current.value = ''
            } else {
                document.cookie = `_auth=${res.data}`
                navigate('/')
            }
        })
    }

    return (
        <section className='wrapper-login'>
             <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <input type="email" id='email' autoComplete='false' ref={emailRef} placeholder={email} style={emailStyle} required/>
                <input type="password" id='password' ref={passwordRef} placeholder={password} style={passwordStyle} required/>
                <button>Login</button>
                <div className="signup">
                    <p>Don't have an account?</p><Link to='/signup'>Sign Up</Link>
                </div>
             </form>
        </section>
    )
}