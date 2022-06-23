import type { RequestHandler } from './__types/[id]'

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
                error: 'The game user does not exist'
            }
        }
    }
}