/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'
import type { Employee as PrismaEmployee } from '@prisma/client'

// Declare prisma inside a global scope to prevent
// creating many connections during development
// due to HMR

var prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') globalThis.prisma = prisma

export default prisma

/**
 * Remaps all fields to booleans to be passed into prisma select options
 **/
type SelectOpts<T> = {
    [K in keyof T]: boolean
}

// By default we dont want the pin to be included in result set
export const employeeSelectOpts: Omit<SelectOpts<PrismaEmployee>, "pin"> = {
    id: true,
    name: true,
    role: true
}