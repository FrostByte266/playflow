import { PrismaClient } from '@prisma/client'

const seedPaths = ['employee', 'game', 'tap']

type SeedFunc = (prisma: PrismaClient) => Promise<void>;

(async function() {
    const prisma = new PrismaClient()
    for(const path of seedPaths) {
        const seedFunc: SeedFunc = (await import('./' + path + '.ts')).default
        await seedFunc(prisma)
    }
    prisma.$disconnect()
})()
