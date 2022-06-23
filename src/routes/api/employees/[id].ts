import type { RequestHandler } from './__types/[id]'

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