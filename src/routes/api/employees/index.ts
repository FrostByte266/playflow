import type { RequestHandler } from './__types'

import prisma from '$lib/prisma'
import Codes from 'http-status-codes'

export const get: RequestHandler = async () => {
    const all = await prisma.employee.findMany()

    return {
        body: all
    }
}

export const post: RequestHandler = async ({ request }) => {
    const newEmployee = await prisma.employee.create({
        data: await request.json()
    })
    
    return {
        body: newEmployee,
        status: Codes.CREATED
    }
}