
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const stats = await prisma.form.findMany({
        select: {
            id: true,
            title: true,
            type: true,
            _count: {
                select: { submissions: true }
            }
        }
    });

    const submissions = await prisma.formSubmission.findMany({
        take: 5,
        include: {
            form: {
                select: { title: true, type: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log('=== FORM STATS ===');
    console.log(JSON.stringify(stats, null, 2));
    console.log('=== RECENT SUBMISSIONS ===');
    console.log(JSON.stringify(submissions, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
