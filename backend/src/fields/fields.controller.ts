import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { FieldCategory } from '@prisma/client';

@Controller('fields')
export class FieldsController {
    constructor(private readonly fieldsService: FieldsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: { name: string; description?: string; teamId: string; category?: FieldCategory }) {
        return this.fieldsService.create(data);
    }

    @Get()
    async findAll(
        @Query('teamId') teamId?: string,
        @Query('category') category?: FieldCategory
    ) {
        if (category) {
            return this.fieldsService.findByCategory(category);
        }
        if (teamId) {
            return this.fieldsService.findByTeam(teamId);
        }
        return this.fieldsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.fieldsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: { name?: string; description?: string; category?: FieldCategory }) {
        return this.fieldsService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.fieldsService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/members')
    async addMember(@Param('id') fieldId: string, @Body('userId') userId: string) {
        return this.fieldsService.addMember(fieldId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/members/:userId')
    async removeMember(@Param('id') fieldId: string, @Param('userId') userId: string) {
        return this.fieldsService.removeMember(fieldId, userId);
    }

    @Get(':id/members')
    async getFieldMembers(@Param('id') fieldId: string) {
        return this.fieldsService.getFieldMembers(fieldId);
    }
}

