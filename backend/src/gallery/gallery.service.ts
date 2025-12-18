import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class GalleryService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        url: string;
        type: MediaType;
        title?: string;
        eventName?: string;
        location?: string;
        uploadedBy: string;
    }) {
        return this.prisma.galleryItem.create({
            data
        });
    }

    async findAll(eventName?: string) {
        return this.prisma.galleryItem.findMany({
            where: eventName ? { eventName: { contains: eventName, mode: 'insensitive' } } : {},
            include: {
                uploader: { select: { id: true, fullName: true, avatarUrl: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async delete(id: string) {
        return this.prisma.galleryItem.delete({ where: { id } });
    }
}
