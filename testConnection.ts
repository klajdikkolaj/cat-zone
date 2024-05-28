import {PrismaClient} from "@prisma/client/extension";

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();
    console.log('Connected to the database');
    await prisma.$disconnect();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
