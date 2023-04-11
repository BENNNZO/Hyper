import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from '../utils/Axios'



export default function Signup() {

    let navigate = useNavigate()

    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const verifyPasswordRef = useRef()

    async function handleUserCreation(e) {
        e.preventDefault()
        if (passwordRef.current.value === verifyPasswordRef.current.value) {
            axios.post('/users', {
                username: usernameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value
            }).then(res => { 
                console.log(res)   
                axios.post('/users/login', {
                    email: emailRef.current.value,
                    password: passwordRef.current.value
                }).then(res => {
                    console.log(res) 
                    if (res.data !== 'e' && res.data !== 'p') {
                        document.cookie = `_auth=${res.data}`
                        navigate('/')
                    }
                })
            })
        } else {
            console.log('passwords dont match')
        }
    }

    return (
        <section className='wrapper-login'>
             <form onSubmit={handleUserCreation}>
                <h1>Sign Up</h1>
                <input type="username" id='username' autoComplete='false' ref={usernameRef} placeholder='Username' required/>
                <input type="email" id='email' autoComplete='false' ref={emailRef} placeholder='E-mail' required/>
                <input type="password" id='password' ref={passwordRef} placeholder='Password' required/>
                <input type="password" id='verifyPassword' ref={verifyPasswordRef} placeholder='Verify Password' required/>
                <button>Sign Up</button>
                <div className="signup">
                    <p>Already have an account?</p><Link to='/login'>Login</Link>
                </div>
             </form>
        </section>
    )
}