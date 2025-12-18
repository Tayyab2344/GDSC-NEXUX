import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { ResourceType } from '@prisma/client';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() body: { title: string; description?: string; link: string; type: ResourceType; fieldId: string },
        @Req() req: any
    ) {
        return this.resourcesService.create({
            ...body,
            addedBy: req.user.id
        });
    }

    @Get('field/:fieldId')
    async findAllByField(@Param('fieldId') fieldId: string) {
        return this.resourcesService.findAllByField(fieldId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.resourcesService.delete(id);
    }
}
