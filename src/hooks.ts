import type { Handle, GetSession } from "@sveltejs/kit"
import type { Employee } from '@prisma/client'

import JWT from 'jsonwebtoken'
import cookie from 'cookie'

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
        const rawToken = cookie.parse(event.request.headers.get('cookie') || '').token
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
        console.error(e)
        return new Response('Redirect',
            {
                status: 303,
                headers: {
                    Location: '/login'
                }
            }
        )
    }
    
}

export const getSession: GetSession = event => event.locals

