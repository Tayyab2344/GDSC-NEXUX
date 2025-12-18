import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com'; // Ensure this user exists or use one from previous steps
    let user = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!user) {
        console.log('Admin user not found, using first available user or creating one.');
        user = await prisma.user.findFirst();
        if (!user) {
            // Create dummy user if none exists
            user = await prisma.user.create({
                data: {
                    email: 'admin@example.com',
                    fullName: 'Admin User',
                    role: 'PRESIDENT',
                    status: 'AUTHENTICATED'
                }
            });
        }
    }

    const membershipForm = {
        title: "Membership Application",
        slug: "membership",
        description: "Join our developer community and unlock exclusive benefits",
        isPublic: true,
        createdBy: user.id,
        schema: {
            fields: [
                { name: "fullName", label: "Full Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "phone", label: "Phone Number", type: "tel", required: true },
                { name: "university", label: "University/Institution", type: "text", required: true },
                { name: "major", label: "Major/Field of Study", type: "text", required: true },
                { name: "year", label: "Year of Study", type: "text", required: true },
                { name: "interests", label: "Areas of Interest", type: "textarea", required: true },
                { name: "whyJoin", label: "Why do you want to join?", type: "textarea", required: true },
            ],
        },
    };

    const existingForm = await prisma.form.findUnique({
        where: { slug: membershipForm.slug },
    });

    if (existingForm) {
        console.log('Membership form already exists, updating...');
        await prisma.form.update({
            where: { slug: membershipForm.slug },
            data: membershipForm,
        });
    } else {
        console.log('Creating Membership form...');
        await prisma.form.create({
            data: membershipForm,
        });
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
