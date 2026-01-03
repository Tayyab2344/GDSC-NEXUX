import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'tayyabatiq300@gmail.com';
    console.log(`Cleaning up teams for user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { teams: true }
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    if (user.teams.length > 0) {
        console.log(`Found ${user.teams.length} team memberships. Removing...`);
        // Delete all team memberships for this user
        await prisma.teamMember.deleteMany({
            where: { userId: user.id }
        });
        console.log('All team memberships removed.');
    } else {
        console.log('No team memberships found to remove.');
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
