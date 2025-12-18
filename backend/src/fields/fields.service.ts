import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FieldCategory, ChatVisibility } from '@prisma/client';

@Injectable()
export class FieldsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; description?: string; teamId: string; category?: FieldCategory }) {
        // Create field
        const field = await this.prisma.field.create({ data });

        // Auto-create chat room for this field
        await this.prisma.chat.create({
            data: {
                name: `${field.name} Chat`,
                isGroup: true,
                visibility: ChatVisibility.MEMBERS_ONLY,
                fieldId: field.id
            }
        });

        return field;
    }

    async findAll() {
        return this.prisma.field.findMany({
            include: {
                team: { select: { id: true, name: true } },
                _count: { select: { members: true, classes: true } },
            },
        });
    }

    async findByCategory(category: FieldCategory) {
        return this.prisma.field.findMany({
            where: { category },
            include: {
                team: { select: { id: true, name: true } },
                _count: { select: { members: true, classes: true } },
            },
        });
    }

    async findByTeam(teamId: string) {
        return this.prisma.field.findMany({
            where: { teamId },
            include: {
                _count: { select: { members: true, classes: true } },
            },
        });
    }

    async findOne(id: string) {
        const field = await this.prisma.field.findUnique({
            where: { id },
            include: {
                team: true,
                members: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } },
                classes: true,
                chats: true,
                meetings: true,
            },
        });
        if (!field) throw new NotFoundException('Field not found');
        return field;
    }

    async update(id: string, data: { name?: string; description?: string; category?: FieldCategory }) {
        return this.prisma.field.update({ where: { id }, data });
    }

    async delete(id: string) {
        // Also delete related chats
        await this.prisma.chat.deleteMany({ where: { fieldId: id } });
        await this.prisma.fieldMember.deleteMany({ where: { fieldId: id } });
        return this.prisma.field.delete({ where: { id } });
    }

    async addMember(fieldId: string, userId: string) {
        return this.prisma.fieldMember.create({
            data: { fieldId, userId },
        });
    }

    async removeMember(fieldId: string, userId: string) {
        return this.prisma.fieldMember.deleteMany({
            where: { fieldId, userId },
        });
    }

    async getFieldMembers(fieldId: string) {
        return this.prisma.fieldMember.findMany({
            where: { fieldId },
            include: { user: true },
        });
    }
}

