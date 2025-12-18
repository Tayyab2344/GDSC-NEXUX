import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlumniService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        fullName: string;
        graduationYear: number;
        currentRole?: string;
        company?: string;
        linkedinProfile?: string;
        email?: string;
    }) {
        return this.prisma.alumni.create({ data });
    }

    async findAll() {
        return this.prisma.alumni.findMany({
            orderBy: { graduationYear: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.alumni.findUnique({ where: { id } });
    }

    async update(id: string, data: Partial<{
        fullName: string;
        graduationYear: number;
        currentRole: string;
        company: string;
        linkedinProfile: string;
        email: string;
    }>) {
        return this.prisma.alumni.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.alumni.delete({ where: { id } });
    }
}
