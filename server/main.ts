import express from 'express'
import Codes from 'http-status-codes'
import { expressjwt } from "express-jwt"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import RevokedTokens from './db/models/revokedToken'

import gamesRouter from './routers/games'
import employeesRouter from './routers/employees'
import tapRouter from './routers/gameTap'
import authRouter from './routers/auth'

import './db/connection'
import 'dotenv/config'

import type { Request, Response, NextFunction } from 'express'

// Configuration
const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(expressjwt({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    secret: process.env.JWT_SIGN_SECRET!,
    algorithms: ['HS256'],
    isRevoked(req, token) {
        return new Promise((resolve, reject) => {
            // Type narrowing to make TS happy, again this
            // check should never fail for any reason
            if (token && token.payload && typeof token.payload !== 'string')
                RevokedTokens.findOne({ identifier: token.payload.jti}, '', undefined, (err, token) => {
                    if(err) {
                        reject('Could not query database for token validity')
                    } else {
                        resolve(token !== null)
                    }
                })
        })
    },
    getToken(req) {
        if (req.headers['x-internal-request'] === process.env.INTERNAL_REQUEST_KEY) {
            return process.env.INTERNAL_TOKEN || null
        } else {
            return req.cookies.token || null
        }
    }
}).unless({ path: ['/auth/login', '/employees/preview']}))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
      res.status(Codes.UNAUTHORIZED).json({err: 'No valid authorization token found'});
    } else {
      next(err);
    }
  });

// Connect routers
app.use('/games', gamesRouter)
app.use('/employees', employeesRouter)
app.use('/tap', tapRouter)
app.use('/auth', authRouter)

// Launch app
app.listen(process.env.PORT || 3100, () => {
    console.log('Locked and loaded!')
})