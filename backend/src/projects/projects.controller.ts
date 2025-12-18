import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { ProjectStatus } from '@prisma/client';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() body: {
            title: string;
            description?: string;
            repoLink?: string;
            demoLink?: string;
            status: ProjectStatus;
            fieldId: string;
            memberIds?: string[];
        },
        @Req() req: any
    ) {
        // If created by a lead, assign them as lead? Or implicit?
        // For now, let's assume the creator is the lead if they are a lead role.
        // But simplified: Just pass the data.
        return this.projectsService.create({
            ...body,
            leadId: req.user.id // Assign creator as lead for now
        });
    }

    @Get('field/:fieldId')
    async findAllByField(@Param('fieldId') fieldId: string) {
        return this.projectsService.findAllByField(fieldId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: ProjectStatus
    ) {
        return this.projectsService.updateStatus(id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.projectsService.delete(id);
    }
}
