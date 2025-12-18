import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        title: string;
        description?: string;
        repoLink?: string;
        demoLink?: string;
        status: ProjectStatus;
        fieldId: string;
        leadId?: string;
        memberIds?: string[];
    }) {
        const { memberIds, ...rest } = data;

        return this.prisma.project.create({
            data: {
                ...rest,
                members: memberIds ? { connect: memberIds.map(id => ({ id })) } : undefined
            }
        });
    }

    async findAllByField(fieldId: string) {
        return this.prisma.project.findMany({
            where: { fieldId },
            include: {
                lead: { select: { id: true, fullName: true, avatarUrl: true } },
                members: { select: { id: true, fullName: true, avatarUrl: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateStatus(id: string, status: ProjectStatus) {
        return this.prisma.project.update({
            where: { id },
            data: { status }
        });
    }

    async delete(id: string) {
        return this.prisma.project.delete({ where: { id } });
    }
}
