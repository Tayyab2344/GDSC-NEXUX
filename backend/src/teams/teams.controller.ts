import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { Role } from '@prisma/client';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: { name: string; description?: string }) {
        return this.teamsService.create(data);
    }

    @Get()
    async findAll() {
        return this.teamsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.teamsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: { name?: string; description?: string }) {
        return this.teamsService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.teamsService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/members')
    async addMember(
        @Param('id') teamId: string,
        @Body() data: { userId: string; role?: Role },
    ) {
        return this.teamsService.addMember(teamId, data.userId, data.role);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/members/:userId')
    async removeMember(@Param('id') teamId: string, @Param('userId') userId: string) {
        return this.teamsService.removeMember(teamId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/members/:userId/role')
    async setMemberRole(
        @Param('id') teamId: string,
        @Param('userId') userId: string,
        @Body('role') role: Role,
    ) {
        return this.teamsService.setMemberRole(teamId, userId, role);
    }

    @Get(':id/members')
    async getTeamMembers(@Param('id') teamId: string) {
        return this.teamsService.getTeamMembers(teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/join')
    async join(@Param('id') teamId: string, @Body() body: { userId: string }) {
        return this.teamsService.addMember(teamId, body.userId, Role.GENERAL_MEMBER);
    }
}
