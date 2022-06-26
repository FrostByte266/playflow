import type { RequestHandler } from './__types/'
import { Prisma } from '@prisma/client'

import prisma from '$lib/prisma'
import Codes from 'http-status-codes'

export const get: RequestHandler = async ({ params }) => {
    const game = await prisma.game.findFirst({
        where: {
            id: Number(params.id)
        }, include: {
            issues: true
        }})
    if (game) {
        return {
            body: game
        }
    } else {
        return {
            status: Codes.NOT_FOUND,
            body: {
                error: 'The game game does not exist'
            }
        }
    }
}

export const patch: RequestHandler = async ({ request, params }) => {
    try {
        const updated = await prisma.game.update({
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
                        body: { error: 'The requested game does not exist' }
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

export const del: RequestHandler = async ({ params }) => {
    try {
        await prisma.game.delete({
            where: {
                id: Number(params.id)
            }, 
        })

        return {
            status: Codes.NO_CONTENT
        }

    } catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2025':
                    return {
                        status: Codes.NOT_FOUND,
                        body: { error: 'The requested game does not exist' }
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