import { Controller, Get, Post, Delete, Param, Body, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Get()
    findAll() {
        return this.eventsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file')) // Expecting 'file' field
    async create(@Body() body: any, @UploadedFile() file: any) {
        let coverImage = null;
        if (file) {
            const upload = await this.cloudinaryService.uploadImage(file);
            coverImage = upload.secure_url;
        }

        // If no file but URL provided? logic can be added. 
        // Usually admin provides details.

        let tags: string[] = [];
        if (body.tags) {
            if (Array.isArray(body.tags)) {
                tags = body.tags;
            } else if (typeof body.tags === 'string') {
                // Check if it's a JSON array string
                try {
                    const parsed = JSON.parse(body.tags);
                    if (Array.isArray(parsed)) {
                        tags = parsed;
                    } else {
                        tags = body.tags.split(',').map((t: string) => t.trim());
                    }
                } catch {
                    tags = body.tags.split(',').map((t: string) => t.trim());
                }
            }
        }

        return this.eventsService.create({
            ...body,
            tags,
            coverImage
        });
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.eventsService.delete(id);
    }
}
