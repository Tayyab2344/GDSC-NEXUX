import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'tayyabatiq300@gmail.com';
    console.log(`Checking user with email: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { teams: true }
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log('Current User Data:', JSON.stringify(user, null, 2));

    if (user.role !== 'GENERAL_MEMBER') {
        console.log('Updating role to GENERAL_MEMBER...');
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'GENERAL_MEMBER' }
        });
        console.log('User role updated:', updatedUser.role);
    } else {
        console.log('User is already GENERAL_MEMBER.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
