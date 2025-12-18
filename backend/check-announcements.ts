
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const announcements = await prisma.announcement.findMany({
        select: { title: true, visibility: true, postedBy: true }
    });
    console.log(JSON.stringify(announcements, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
