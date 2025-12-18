import { Controller, Get, Param, Put, Body, UseGuards, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { Role, UserStatus } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('admin-stats')
    async getAdminStats() {
        return this.usersService.getAdminStats();
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query('search') search?: string, @Query('status') status?: UserStatus) {
        return this.usersService.findAll(search, status);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any, @Query('includeFields') includeFields?: string) {
        return this.usersService.getDashboardData(req.user.id, includeFields === 'true');
    }

    @UseGuards(JwtAuthGuard)
    @Get('members')
    async getMembers() {
        return this.usersService.getMembers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('applicants')
    async getApplicants() {
        return this.usersService.getApplicants();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/role')
    async updateRole(@Param('id') id: string, @Body('role') role: Role) {
        return this.usersService.updateRole(id, role);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: UserStatus) {
        return this.usersService.updateStatus(id, status);
    }
}
