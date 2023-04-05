require('dotenv').config()
import { NextResponse } from 'next/server'
const jwt = require('jsonwebtoken');

module.exports = (req) => {
    if (req.url.includes('/dashboard')) {
        if (req.auth === undefined) {
            return NextResponse.redirect('/login')
        }

        try {
            jwt.verify(req.auth, process.env.ACCESS_TOKEN_SECRET)
            return NextResponse.next()
        } catch(e) {
            return NextResponse.redirect('/login')
        }
    }
};
