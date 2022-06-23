import { Router } from 'express'
import { randomBytes } from 'crypto'

import jwt from 'jsonwebtoken'
import type { Request as JWTAuthenticatedRequest} from 'express-jwt'
import Employees from '../db/models/employee'
import RevokedTokens from '../db/models/revokedToken'
import guardError from '../utils/guardError'
import Codes from 'http-status-codes'

import type { IEmployee } from '../db/types/employee'
import type { ILoginBody } from '../types/bodies/login'

const router = Router()

router.post('/login', (req, res) => {
    const { ID, pin } = req.body as ILoginBody
    Employees.findOne({ ID, pin }, undefined, undefined, guardError<IEmployee>(res, {}, employee => {
        if(!employee) {
            res.status(Codes.UNAUTHORIZED).json({error: 'No matching credentials found'})
        } else {
            const jwtid = randomBytes(16).toString('hex')
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const token = jwt.sign(employee.toObject(), process.env.JWT_SIGN_SECRET!, { expiresIn: '1h', jwtid })
            res.cookie('token', token, { httpOnly: true })
            res.json({ authorized: employee })
        }
    }))
})

router.post('/logout', (req: JWTAuthenticatedRequest, res) => {
    // Type narrowing to remove "possible null" error
    // since middleware enforces JWT, this check should
    // never fail
    if(req.auth && req.auth.iat && req.auth.jti) {
        RevokedTokens.create({
            expireAt: new Date(req.auth.iat * 1000),
            identifier: req.auth.jti
        })
        res.clearCookie('token', { httpOnly: true })
    }
    res.status(Codes.NO_CONTENT).end()
})

export default router
