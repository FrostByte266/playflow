import type { PrismaClient } from '@prisma/client'

export default async function seed(prisma: PrismaClient) {
    await prisma.gameTap.create({
        data: {
            time: "AM",
            performedBy: {
                connect: { id: 22669 }
            },
            tappedGames: {
                create: [
                    {
                        game: {
                            connect: { id: 1 }
                        }
                    }, {
                        game: {
                            connect: { id: 2 }
                        }
                    }
                ]
            }
        }
    })
}