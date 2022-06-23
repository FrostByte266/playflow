/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient
}

// Declare prisma inside a global scope to prevent
// creating many connections during development
// due to HMR

var prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') globalThis.prisma = prisma

export default prisma