import type { PrismaClient } from '@prisma/client'

export default async function seed(prisma: PrismaClient) {

    await prisma.game.create({
        data: {
                name: "Magix Floor",
                manufacturer: "TouchMagix",
                photo: "https://www.spttechsupport.com/uploads/6/9/3/7/69377421/published/magixfloor.png?1541172122",
                issues: {
                    create: {
                        reportedBy: {
                            connect: {id: 75207}
                        },
                        type: "CLEANING",
                        description: "Floor is dirty"
                    }
                }
            }
    })

    await prisma.game.create({
        data: {
                name: "Slither.io",
                manufacturer: "Raw Thrills",
                photo: "https://www.globalamusementsandplay.com/wp-content/uploads/Slither.io-app-comes-to-the-arcades-691x1024.png",
            }
    })

    await prisma.game.create({
        data: {
                name: "Baseball Pro",
                manufacturer: "Andamiro",
                photo: "https://www.spttechsupport.com/uploads/6/9/3/7/69377421/baseball-pro_orig.png",
                issues: {
                    create: {
                        reportedBy: {
                            connect: {id: 75207}
                        },
                        type: "NON_CRITICAL",
                        description: "IR Blocking Tape is peeling"
                    }
                }
            }
    })
}