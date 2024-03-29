import type { Handle, HandleError, GetSession } from "@sveltejs/kit"
import type { Employee } from '@prisma/client'

import JWT from 'jsonwebtoken'
import cookie from 'cookie'
import Codes from 'http-status-codes'

export const handle: Handle = async ({ event, resolve }) => {
    const unprotectedPaths: Record<string, Array<string>> = {
        GET: ['/login', '/employees'],
        POST: ['/session'],
        PATCH: [],
        DELETE: []
    }
    if(
        unprotectedPaths[event.request.method]
            .some(p => event.url.pathname.includes(p))
    ) {
        return await resolve(event)
    }
    try {
        let rawToken = cookie.parse(event.request.headers.get('cookie') || '').token
        if (!rawToken) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            rawToken = (event.request.headers.get('authorization') || '').split(':').at(-1)!
        }
        const decoded = JWT.verify(rawToken, import.meta.env.VITE_JWT_SECRET) as Required<JWT.JwtPayload> & Employee

        // JWT expiry dates are expressed as UNIX epoch (seconds),
        // Date objects use milleseconds, so we must make the two equal in scale
        if(decoded.exp * 1000 < Date.now()) {
            throw new Error('Expired token')
        } else if (await redis.exists(decoded.jti)) {
            throw new Error('Token has been revoked')
        }
        const { id, name, role } = decoded
        event.locals = {
            user: { id, name, role },
            token: decoded
        }
        return await resolve(event)
    } catch (e) {
        // If there are errors decoding the JWT, it has been altered by the client,
        // redirect to the login page to get a new one
        // Will also redirect if the JWT was expired

        if (event.request.headers.get('Accept') === 'application/json') {
            return new Response(JSON.stringify({
                    message: 'The required authentication token was missing or invalid'
            }), {
                headers: {
                    'Content-Type': 'application/json'
                },
                status: Codes.UNAUTHORIZED
            })
        } else {
            return new Response('Redirect',
            {
                status: Codes.MOVED_TEMPORARILY,
                headers: {
                    Location: '/login'
                }
            }
        )
        }
    }
    
}

export const getSession: GetSession = event => event.locals

export const handleError: HandleError = async ({ error }) => {
    console.error(error)
}