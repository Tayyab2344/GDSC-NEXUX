import { Controller, Get, Post, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, Query, BadRequestException, Request } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MediaType } from '@prisma/client';

@Controller('gallery')
export class GalleryController {
    constructor(
        private readonly galleryService: GalleryService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @UploadedFile() file: any,
        @Body() data: { eventName?: string; location?: string, type?: MediaType; title?: string },
        @Request() req: any,
    ) {
        console.log("Gallery Create Request:", { data, fileExists: !!file });
        if (!file) throw new BadRequestException('File is required');

        const uploadResult = await this.cloudinaryService.uploadImage(file);

        // Map Cloudinary resource_type to MediaType
        const mediaType = uploadResult.resource_type === 'video' ? MediaType.VIDEO : MediaType.IMAGE;

        return this.galleryService.create({
            url: uploadResult.secure_url,
            eventName: data.eventName,
            location: data.location,
            title: data.title, // Pass the title (used for BANNER tag)
            type: mediaType,
            uploadedBy: req.user.id
        });
    }

    @Get()
    async findAll(@Query('event') eventName?: string) {
        return this.galleryService.findAll(eventName);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req: any) {
        // Ideally verify ownership or role here, but for now assuming Leads/Marketing have access
        return this.galleryService.delete(id);
    }
}
