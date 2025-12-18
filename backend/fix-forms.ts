
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Update the main 'Membership Application' to be of type MEMBERSHIP
    const update1 = await prisma.form.updateMany({
        where: { slug: 'membership' },
        data: { type: 'MEMBERSHIP' }
    });
    console.log(`Updated ${update1.count} form(s) with slug 'membership' to MEMBERSHIP type.`);

    // Update other forms with 'membership' in title to be MEMBERSHIP type (fixing typos too if possible, but safely)
    const update2 = await prisma.form.updateMany({
        where: {
            title: { contains: 'embers', mode: 'insensitive' },
            type: 'GENERAL'
        },
        data: { type: 'MEMBERSHIP' }
    });
    console.log(`Updated ${update2.count} other form(s) with 'members' in title to MEMBERSHIP type.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
