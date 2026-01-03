import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BadgesService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        await this.ensureDefaultBadges();
    }

    async ensureDefaultBadges() {
        const defaultBadges = [
            {
                name: 'GDSC Member',
                description: 'Official member of the GDSC Nexus community.',
                imageUrl: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-dsc/contentbuilder/GDSC-Logo-Standard.png'
            },
            {
                name: 'Team Lead',
                description: 'Official lead of a technical or non-technical field in GDSC Nexus.',
                imageUrl: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-dsc/contentbuilder/GDSC-Logo-Standard.png' // Adjust if a lead-specific icon is available
            }
        ];

        for (const badge of defaultBadges) {
            await this.prisma.badge.upsert({
                where: { id: badge.name }, // Using name as ID placeholder for simplicity or we can find by name
                update: {},
                create: {
                    name: badge.name,
                    description: badge.description,
                    imageUrl: badge.imageUrl
                }
            }).catch(async () => {
                // If upsert by ID fails, try findByName and then create
                const existing = await this.prisma.badge.findFirst({ where: { name: badge.name } });
                if (!existing) {
                    await this.prisma.badge.create({ data: badge });
                }
            });
        }
    }

    async awardBadge(userId: string, badgeName: string) {
        const badge = await this.prisma.badge.findFirst({ where: { name: badgeName } });
        if (!badge) {
            console.error(`Badge ${badgeName} not found`);
            return;
        }

        const existingAward = await this.prisma.userBadge.findFirst({
            where: { userId, badgeId: badge.id }
        });

        if (!existingAward) {
            return this.prisma.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id
                }
            });
        }
    }
}
