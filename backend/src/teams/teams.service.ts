import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class TeamsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; description?: string }) {
        return this.prisma.team.create({ data });
    }

    async findAll() {
        return this.prisma.team.findMany({
            include: {
                members: {
                    include: { user: { select: { id: true, fullName: true, avatarUrl: true, role: true } } },
                },
                fields: true,
                _count: { select: { members: true, fields: true } },
            },
        });
    }

    async findOne(id: string) {
        const team = await this.prisma.team.findUnique({
            where: { id },
            include: {
                members: {
                    include: { user: { select: { id: true, fullName: true, avatarUrl: true, role: true } } },
                },
                fields: true,
                chats: true,
                meetings: true,
            },
        });
        if (!team) throw new NotFoundException('Team not found');
        return team;
    }

    async update(id: string, data: { name?: string; description?: string }) {
        return this.prisma.team.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.team.delete({ where: { id } });
    }

    async addMember(teamId: string, userId: string, role?: Role) {
        return this.prisma.teamMember.create({
            data: { teamId, userId, role },
        });
    }

    async removeMember(teamId: string, userId: string) {
        return this.prisma.teamMember.deleteMany({
            where: { teamId, userId },
        });
    }

    async setMemberRole(teamId: string, userId: string, role: Role) {
        return this.prisma.teamMember.updateMany({
            where: { teamId, userId },
            data: { role },
        });
    }

    async getTeamMembers(teamId: string) {
        return this.prisma.teamMember.findMany({
            where: { teamId },
            include: { user: true },
        });
    }
}
