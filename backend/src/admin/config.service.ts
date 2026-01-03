import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfigService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Initialize default configs if they don't exist
        await this.ensureConfig('membership_drive', {
            active: true,
            title: "Join GDSC Nexus 2024",
            message: "Our annual membership drive is now open! Join over 500+ members and build the future together.",
            buttonText: "Join Community",
            bannerText: "Now accepting new members for 2024"
        });
    }

    private async ensureConfig(key: string, defaultValue: any) {
        const existing = await this.prisma.systemConfig.findUnique({ where: { key } });
        if (!existing) {
            await this.prisma.systemConfig.create({
                data: { key, value: defaultValue }
            });
        }
    }

    async getConfig(key: string) {
        return this.prisma.systemConfig.findUnique({ where: { key } });
    }

    async updateConfig(key: string, value: any) {
        return this.prisma.systemConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
    }

    async getAllConfigs() {
        return this.prisma.systemConfig.findMany();
    }
}
