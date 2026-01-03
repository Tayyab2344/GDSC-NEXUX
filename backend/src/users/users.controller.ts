import { Controller, Get, Param, Put, Body, UseGuards, Req, Query, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { Role, UserStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('admin-stats')
    async getAdminStats() {
        return this.usersService.getAdminStats();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() body: any) {
        return this.usersService.create({
            email: body.email,
            password: 'password123', // Default password
            firstName: body.fullName.split(' ')[0],
            lastName: body.fullName.split(' ').slice(1).join(' ') || '',
        }).then(user => {
            if (body.role) {
                return this.usersService.updateRole(user.id, body.role);
            }
            return user;
        });
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
    @Put('profile')
    async updateProfile(@Req() req: any, @Body() body: { fullName?: string; email?: string; password?: string }) {
        return this.usersService.updateProfile(req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async updateAvatar(@Req() req: any, @UploadedFile() file: any) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        return this.usersService.updateAvatar(req.user.id, uploadResult.secure_url);
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
