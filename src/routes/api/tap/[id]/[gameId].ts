import type { RequestHandler } from './__types/'
import type { Issue } from '@prisma/client'

import prisma from '$lib/prisma'
import Codes from 'http-status-codes'

type GameTapBody = {
    create: Array<Issue>,
    update: Array<Partial<Issue>>
}

export const POST: RequestHandler = async ({ request }) => {
    const { create, update } = await request.json() as GameTapBody
    try {
        const createdIssues = await Promise.all(create.map(async issue => await prisma.issue.create({
                data: issue
            })))
        const updatedIssues = await Promise.all(update.map(async issue => await prisma.issue.update({
                where: { id: issue.id},
                data: issue
            })
        ))
        return {
            body: {
                created: createdIssues,
                updated: updatedIssues
            }
        }

    } catch (err) {
        return {
            status: Codes.INTERNAL_SERVER_ERROR,
            body: { error: 'An unexpected database error has occured' }
        }
    }
}