import type { RequestHandler } from './__types/'

import prisma from '$lib/prisma'
import Codes from 'http-status-codes'

export const GET: RequestHandler = async ({ params }) => {
    const issues = await prisma.issue.findMany({
        where: {
            gameId: Number(params.id)
        }})
    if (issues) {
        return {
            body: issues
        }
    } else {
        return {
            status: Codes.NOT_FOUND,
            body: {
                error: 'The game does not exist'
            }
        }
    }
}

export const POST: RequestHandler = async ({ params, request }) => {
    const newIssue = await prisma.issue.create({
        data: { gameId: Number(params.id), ...await request.json()}
    })

    return {
        status: Codes.CREATED,
        body: newIssue
    }
}
