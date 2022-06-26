import JWT from 'jsonwebtoken'
import cookie from 'cookie'
import Codes from 'http-status-codes'
import prisma from '$lib/prisma'

import type { RequestHandler } from './__types/session'

export const post: RequestHandler = async ({ request }) => {
    const { id, pin: submittedPin} = await request.json()
    const user = await prisma.employee.findFirst({ where: { id } })
    if (user && user.pin === submittedPin) {
        const token = JWT.sign(user, import.meta.env.VITE_JWT_SECRET, { expiresIn: '1h'})
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

export const del: RequestHandler = async ({ request }) => {
    return {
        status: Codes.NOT_IMPLEMENTED
    }
}