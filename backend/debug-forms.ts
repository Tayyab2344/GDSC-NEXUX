
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const forms = await prisma.form.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            type: true
        }
    });
    console.log('--- FORMS IN DB ---');
    console.log(JSON.stringify(forms, null, 2));
    console.log('-------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
