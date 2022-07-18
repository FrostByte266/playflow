import type { RequestHandler } from './__types'

import prisma from '$lib/prisma'
import Codes from 'http-status-codes'

export const GET: RequestHandler = async () => {
    const all = await prisma.gameTap.findMany({
        include: {
            performedBy: true,
            tappedGames: true
        }
    })

    return {
        body: all
    }
}

export const POST: RequestHandler = async ({ request,  locals: { user } }) => {
    const newTap = await prisma.gameTap.create({
        data: {
            performedBy: {
                connect: { id: user.id }
            },
            ...await request.json()
        }
    })
    
    return {
        body: newTap,
        status: Codes.CREATED
    }
}