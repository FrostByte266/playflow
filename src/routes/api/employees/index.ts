import type { RequestHandler } from './__types'

import prisma, { employeeSelectOpts } from '$lib/prisma'
import Codes from 'http-status-codes'

export const GET: RequestHandler = async () => {
    const all = await prisma.employee.findMany({
        select: employeeSelectOpts
    })

    return {
        body: all
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const newEmployee = await prisma.employee.create({
        data: await request.json()
    })
    
    return {
        body: newEmployee,
        status: Codes.CREATED
    }
}