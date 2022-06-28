import JWT from 'jsonwebtoken'
import cookie from 'cookie'
import Codes from 'http-status-codes'
import crypto from 'crypto'
import prisma from '$lib/prisma'
import redis from '$lib/redis'


import type { RequestHandler } from './__types/session'

export const post: RequestHandler = async ({ request }) => {
    const { id, pin: submittedPin} = await request.json()
    const user = await prisma.employee.findFirst({ where: { id } })
    if (user && user.pin === submittedPin) {
        const jwtid = crypto.randomBytes(16).toString('hex')
        const token = JWT.sign(user, import.meta.env.VITE_JWT_SECRET, { expiresIn: '1h', jwtid })
        return {
            body: user,
            headers: {
                'Set-Cookie': cookie.serialize('token', token, { httpOnly: true })
            }
        }
    } else {
        return {
            status: Codes.UNAUTHORIZED
        }
    }
}


export const del: RequestHandler = async ({ locals }) => {
    const { token } = locals
    // Adds the JWT ID to the redis store and sets it to
    // expire from the redis server at the same time as the token
    await redis.set(token.jti, 1, 'EXAT', token.exp)

    return {
        status: Codes.NO_CONTENT,
        headers: {
            'Set-Cookie': cookie.serialize('token', '', { expires: new Date(0)}) // Deletes cookie
        }
    }
}