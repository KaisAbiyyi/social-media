import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
const prisma = new PrismaClient()
async function main() {
    const alice = await prisma.user.create({
        data: {
            email: 'alice@prisma.io',
            name: 'Alice',
            password: hashSync("alice", 10)
        },
    })
    const bob = await prisma.user.create({
        data: {
            email: 'bob@prisma.io',
            name: 'Bob',
            password: hashSync("bob", 10)
        },
    })
    console.log({ alice, bob })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })