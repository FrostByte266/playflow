import type { RequestHandler } from './__types/[issueId]'
import { Prisma } from '@prisma/client'

import prisma from '$lib/prisma'
import Codes from 'http-status-codes'

export const GET: RequestHandler = async ({ params }) => {
    const issue = await prisma.issue.findFirst({
        where: {
            id: Number(params.issueId)
        }
    })
    if (issue) {
        return {
            body: issue
        }
    } else {
        return {
            status: Codes.NOT_FOUND,
            body: {
                error: 'The requested issue does not exist'
            }
        }
    }
}

export const PATCH: RequestHandler = async ({ request, params }) => {
    try {
        const updated = await prisma.issue.update({
            where: {
                id: Number(params.issueId)
            }, 
            data: await request.json(),
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
                        body: { error: 'The requested issue does not exist' }
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

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        await prisma.issue.delete({
            where: {
                id: Number(params.issueId)
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
                        body: { error: 'The requested issue does not exist' }
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