import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('alumni')
export class AlumniController {
    constructor(private readonly alumniService: AlumniService) { }

    // Public endpoint for alumni registration
    @Post()
    async create(@Body() data: {
        fullName: string;
        graduationYear: number;
        currentRole?: string;
        company?: string;
        linkedinProfile?: string;
        email?: string;
    }) {
        return this.alumniService.create(data);
    }

    // Admin-only for viewing all alumni
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.alumniService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.alumniService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.alumniService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.alumniService.delete(id);
    }
}
