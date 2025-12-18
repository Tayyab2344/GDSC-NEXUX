import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from '../events/events.service'; // Mistake in original file? No, just adding imports.
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('announcements')
export class AnnouncementsController {
    constructor(
        private readonly announcementsService: AnnouncementsService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Req() req: any, @Body() body: any, @UploadedFile() file: any) {
        let coverImage = null;
        if (file) {
            const upload = await this.cloudinaryService.uploadImage(file);
            coverImage = upload.secure_url;
        }

        return this.announcementsService.create(req.user.id, {
            ...body,
            coverImage
        });
    }

    @Get()
    findAll(@Req() req: any) {
        return this.announcementsService.findAll(req.user);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.announcementsService.delete(id);
    }
}
