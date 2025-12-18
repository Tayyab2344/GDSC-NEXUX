import { PrismaClient, Role, UserStatus, FieldCategory, ChatVisibility, MediaType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const pakistaniNames = [
    "Ahmed Khan", "Ali Hassan", "Bilal Ahmed", "Hamza Malik", "Usman Gondal",
    "Fatima Bibi", "Ayesha Siddiqui", "Zainab Raza", "Sana Mir", "Hira Mani",
    "Muhammad Omar", "Abdullah Shah", "Hassan Raza", "Hussain Ali", "Mustafa Kamal",
    "Mariam Khan", "Sara Ahmed", "Noor Fatima", "Sadia Khan", "Amna Ilyas",
    "Zohaib Hassan", "Fahad Mustafa", "Sheheryar Munawar", "Danish Taimoor", "Ahsan Khan",
    "Mahira Khan", "Sajal Aly", "Yumna Zaidi", "Ayeza Khan", "Maya Ali"
];

function getRandomName() {
    return pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];
}

const descriptions = [
    "Exciting new workshops coming up next week!",
    "Join us for a hackathon this weekend.",
    "Guest speaker session on AI trends.",
    "Networking event for all members.",
    "Project showcase and feedback session.",
    "Annual dinner registration is open.",
    "Call for volunteers for the upcoming tech fest.",
    "Mentorship program applications now live.",
    "Weekly coding challenge: Algorithms.",
    "Cloud computing certification study group."
];

async function main() {
    console.log('🌱 Starting comprehensive seed...');

    // 1. CLEAR DATABASE (Order matters for foreign keys)
    console.log('Deleting existing data...');
    await prisma.formSubmission.deleteMany();
    await prisma.form.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.event.deleteMany();
    await prisma.galleryItem.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.fieldMember.deleteMany();
    await prisma.field.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();


    const password = await bcrypt.hash('password123', 10);

    // 2. Main Team
    const mainTeam = await prisma.team.create({
        data: {
            name: 'Developer Society',
            description: 'The main team for all society members'
        }
    });

    // 3. Departments / Fields
    const fieldsConfig = [
        { name: 'Web Development', category: FieldCategory.TECHNICAL },
        { name: 'Mobile App Development', category: FieldCategory.TECHNICAL },
        { name: 'Game Development', category: FieldCategory.TECHNICAL },
        { name: 'AI/ML', category: FieldCategory.TECHNICAL },
        { name: 'Cloud Computing', category: FieldCategory.TECHNICAL },
        { name: 'Cyber Security', category: FieldCategory.TECHNICAL },
        { name: 'UI/UX', category: FieldCategory.NON_TECHNICAL },
        { name: 'Graphic Design', category: FieldCategory.NON_TECHNICAL },
        { name: 'Events Management', category: FieldCategory.NON_TECHNICAL },
        { name: 'Marketing', category: FieldCategory.NON_TECHNICAL },
        { name: 'Management', category: FieldCategory.NON_TECHNICAL }
    ];

    const fieldMap = new Map();
    for (const f of fieldsConfig) {
        const field = await prisma.field.create({
            data: {
                name: f.name,
                category: f.category,
                description: `${f.name} Department`,
                teamId: mainTeam.id
            }
        });
        fieldMap.set(f.name, field);
    }

    // 4. USERS
    const credentialsLog: any[] = [];
    const createdUsers: any[] = [];

    // 4a. CHATS (Empty Structure)
    console.log('Creating chat rooms...');
    const generalChat = await prisma.chat.create({
        data: {
            name: 'General Chat',
            isGroup: true,
            visibility: ChatVisibility.PUBLIC
        }
    });

    const createUser = async (email: string, fullName: string, role: Role, status: UserStatus = UserStatus.MEMBER) => {
        const user = await prisma.user.create({
            data: {
                email,
                fullName,
                password,
                role,
                status,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName.replace(/ /g, '')}`
            }
        });
        credentialsLog.push({ Role: role, Name: fullName, Email: email, Password: 'password123' });
        createdUsers.push(user);
        return user;
    };

    const president = await createUser('president@gdsc.dev', 'Muhammad Ali Jinnah', Role.PRESIDENT);
    const faculty = await createUser('faculty@gdsc.dev', 'Dr. Abdul Qadeer', Role.FACULTY_HEAD);

    // Field Users & Chats
    for (const f of fieldsConfig) {
        const slug = f.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const fieldId = fieldMap.get(f.name).id;

        // Create Chat for Field
        const chatName = `${f.name} Chat`;
        const fieldChat = await prisma.chat.create({
            data: {
                name: chatName,
                isGroup: true,
                visibility: ChatVisibility.MEMBERS_ONLY,
                fieldId: fieldId
            }
        });

        // Lead
        const lead = await createUser(`${slug}.lead@gdsc.dev`, getRandomName(), Role.TEAM_LEAD);
        await prisma.fieldMember.create({ data: { userId: lead.id, fieldId } });
        await prisma.teamMember.create({ data: { userId: lead.id, teamId: mainTeam.id, role: Role.TEAM_LEAD } });

        // Welcome message
        await prisma.chatMessage.create({
            data: {
                content: `Welcome to the ${f.name} channel!`,
                chatId: fieldChat.id,
                senderId: lead.id
            }
        });


        // Co-Lead
        const coLead = await createUser(`${slug}.co@gdsc.dev`, getRandomName(), Role.CO_LEAD);
        await prisma.fieldMember.create({ data: { userId: coLead.id, fieldId } });
        await prisma.teamMember.create({ data: { userId: coLead.id, teamId: mainTeam.id, role: Role.CO_LEAD } });

        // Members (3 verified members)
        for (let i = 1; i <= 3; i++) {
            const mem = await createUser(`${slug}.mem${i}@gdsc.dev`, getRandomName(), Role.GENERAL_MEMBER);
            await prisma.fieldMember.create({ data: { userId: mem.id, fieldId } });
            await prisma.teamMember.create({ data: { userId: mem.id, teamId: mainTeam.id, role: Role.GENERAL_MEMBER } });
        }
    }

    // 5. CONTENT (Announcements, Events, Gallery)
    console.log('Creating content...');

    // Announcements
    for (let i = 0; i < 12; i++) {
        await prisma.announcement.create({
            data: {
                title: `Important Announcement ${i + 1}`,
                content: descriptions[i % descriptions.length] + " Verify details on the portal.",
                postedBy: president.id,
                coverImage: `https://picsum.photos/seed/announcement${i}/800/400`
            }
        });
    }

    // Events
    for (let i = 0; i < 12; i++) {
        const isPast = i < 5;
        const date = new Date();
        date.setDate(date.getDate() + (isPast ? -i - 1 : i + 1));

        await prisma.event.create({
            data: {
                title: `Tech Event ${i + 1}: ${fieldsConfig[i % fieldsConfig.length].name}`,
                description: "Deep dive session with industry experts.",
                date: date,
                location: isPast ? "Auditorium A" : "Online / Main Hall",
                type: i % 2 === 0 ? "Workshop" : "Seminar",
                tags: ["Tech", "Learning", fieldsConfig[i % fieldsConfig.length].name],
                coverImage: `https://picsum.photos/seed/event${i}/800/400`
            }
        });
    }

    // Gallery
    for (let i = 0; i < 12; i++) {
        await prisma.galleryItem.create({
            data: {
                title: `Event Highlights ${i + 1}`,
                // description: "Memorable moments from our recent gathering.", // Not in schema
                url: `https://picsum.photos/seed/gallery${i}/800/600`,
                type: MediaType.IMAGE,
                uploadedBy: president.id
            }
        });
    }

    // 6. FORMS & SUBMISSIONS
    console.log('Creating forms...');

    // Membership Form
    const membershipForm = await prisma.form.create({
        data: {
            title: "Membership Application Fall 2024",
            slug: "membership",
            description: "Join the Developer Society to learn and grow.",
            schema: {
                fields: [
                    { id: "f1", label: "Full Name", type: "text", required: true },
                    { id: "f2", label: "Registration Number", type: "text", required: true },
                    { id: "f3", label: "Email", type: "email", required: true },
                    { id: "f4", label: "Semester", type: "text", required: true },
                    { id: "f5", label: "Why do you want to join?", type: "textarea", required: true },
                    { id: "f6", label: "Technical Field", type: "technical-selection", required: true },
                    { id: "f7", label: "Non-Technical Field", type: "non-technical-selection", required: true }
                ]
            },
            isPublic: true,
            createdBy: president.id
        }
    });

    // Lead Application Form
    const leadForm = await prisma.form.create({
        data: {
            title: "Team Lead Application",
            slug: "lead-application",
            description: "Apply to lead a technical or non-technical team.",
            schema: {
                fields: [
                    { id: "l1", label: "Full Name", type: "text", required: true },
                    { id: "l2", label: "Email", type: "email", required: true },
                    { id: "l3", label: "Preferred Team", type: "unified-selection", required: true },
                    { id: "l4", label: "Leadership Experience", type: "textarea", required: true }
                ]
            },
            isPublic: true,
            createdBy: president.id
        }
    });

    // Submissions (Pending)
    for (let i = 0; i < 5; i++) {
        const name = getRandomName();
        // Pending Membership
        await prisma.formSubmission.create({
            data: {
                formId: membershipForm.id,
                data: {
                    fullName: name,
                    email: `applicant${i}@example.com`,
                    regNo: `FA21-BCS-${100 + i}`,
                    semester: "5th",
                    whyJoin: "I want to learn web development.",
                    technicalFields: ["Web Development"],
                    nonTechnicalFields: ["Marketing"],
                },
                status: "PENDING"
            }
        });

        // Pending Lead
        await prisma.formSubmission.create({
            data: {
                formId: leadForm.id,
                data: {
                    fullName: getRandomName(),
                    email: `lead.aspirant${i}@example.com`,
                    preferredField: fieldsConfig[i % fieldsConfig.length].name,
                    role: "TEAM_LEAD"
                },
                status: "PENDING"
            }
        });
    }

    console.table(credentialsLog);
    console.log('🎉 Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
