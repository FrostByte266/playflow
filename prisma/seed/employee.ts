import type { PrismaClient } from '@prisma/client'

export default async function seed(prisma: PrismaClient) {
    await prisma.employee.createMany({
        data: [
            {
                name: "Katherine Torphy",
                id: 22669,
                pin: "4639",
                role: "CAST_MEMBER"
            },
            {
                name: "Shawn Schuppe",
                id: 75207,
                pin: "6560",
                role: "TECHNICIAN"
            },
            {
                name: "Kate Greenholt",
                id: 85831,
                pin: "3621",
                role: "MANAGER"
            }
        ]
    })
}