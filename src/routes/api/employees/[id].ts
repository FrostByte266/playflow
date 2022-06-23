import type { RequestHandler } from './__types/[id]'
import { Prisma } from '@prisma/client'

import prisma from '$lib/prisma'
import Codes from 'http-status-codes'

export const get: RequestHandler = async ({ params }) => {
    const user = await prisma.employee.findFirst({ where: { id: Number(params.id)} })
    if (user) {
        return {
            body: user
        }
    } else {
        return {
            status: Codes.NOT_FOUND,
            body: {
                error: 'The requested user does not exist'
            }
        }
    }
}

export const patch: RequestHandler = async ({ request, params }) => {
    try {
        const updated = await prisma.employee.update({
            where: {
                id: Number(params.id)
            }, 
            data: await request.json()
        })

        return {
            body: updated
        }

    } catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2025':
                    return {
                        status: Codes.NOT_FOUND,
                        body: { error: 'The requested employee does not exist' }
                    }
                default:
                    return {
                        status: Codes.INTERNAL_SERVER_ERROR,
                        body: { error: 'An unexpected database error has occured' }
                    }
            }
        } else {
            console.dir(e, {depth: null})
            return {
                status: Codes.INTERNAL_SERVER_ERROR,
                body: { error: 'An unknown server error has occured' }
            }
        }
    }
}