import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceType } from '@prisma/client';

@Injectable()
export class ResourcesService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        title: string;
        description?: string;
        link: string;
        type: ResourceType;
        fieldId: string;
        addedBy: string;
    }) {
        return this.prisma.learningResource.create({ data });
    }

    async findAllByField(fieldId: string) {
        return this.prisma.learningResource.findMany({
            where: { fieldId },
            include: { adder: { select: { id: true, fullName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async delete(id: string) {
        return this.prisma.learningResource.delete({ where: { id } });
    }
}
