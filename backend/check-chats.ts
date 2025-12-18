
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const chats = await prisma.chat.findMany();
    console.log('Chats found:', chats);

    if (chats.length === 0) {
        console.log('No chats found. Creating General Chat...');
        await prisma.chat.create({
            data: {
                name: 'General Chat',
                isGroup: true,
                visibility: 'PUBLIC'
            }
        });
        console.log('General Chat created.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
