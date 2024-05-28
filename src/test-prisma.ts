import {PrismaClient} from "./common/generated/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();
    console.log('Connected to database');
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    prisma.$disconnect();
});
