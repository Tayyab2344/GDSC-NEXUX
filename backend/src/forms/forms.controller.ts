import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { SubmissionStatus, FormType } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('forms')
export class FormsController {
    constructor(
        private readonly formsService: FormsService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() body: { title: string; slug?: string; description?: string; schema: any; isPublic?: boolean; type?: any },
        @Req() req: any,
    ) {
        const slug = body.slug || body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
        return this.formsService.create({ ...body, slug, createdBy: req.user.id });
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: { title?: string; description?: string; schema?: any; isPublic?: boolean; type?: any }) {
        return this.formsService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: any) {
        if (!file) throw new Error('File is required');
        const result = await this.cloudinaryService.uploadImage(file);
        return {
            url: result.secure_url,
            originalName: file.originalname,
            type: result.resource_type
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.formsService.findAll();
    }

    @Get('public')
    async findPublic() {
        return this.formsService.findPublic();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.formsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.formsService.delete(id);
    }

    // Submissions
    @Post(':id/submit')
    async submitForm(@Param('id') formId: string, @Body() body: { data: any; userId?: string }) {
        return this.formsService.submitForm(formId, body.data, body.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/submissions')
    async getSubmissions(@Param('id') formId: string) {
        return this.formsService.getSubmissions(formId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('submissions/:submissionId/status')
    async updateSubmissionStatus(
        @Param('submissionId') submissionId: string,
        @Body('status') status: SubmissionStatus,
    ) {
        return this.formsService.updateSubmissionStatus(submissionId, status);
    }

    @UseGuards(JwtAuthGuard)
    @Get('submissions/:id')
    async getSubmission(@Param('id') id: string) {
        return this.formsService.getSubmission(id);
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.formsService.findBySlug(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Get('slug/:slug/submissions')
    async getSubmissionsBySlug(@Param('slug') slug: string) {
        return this.formsService.getSubmissionsBySlug(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Get('type/:type/submissions')
    async getSubmissionsByType(@Param('type') type: FormType) {
        return this.formsService.getSubmissionsByType(type);
    }

    /**
     * Get submissions filtered by preferred field (for team leads) - PENDING only
     */
    @UseGuards(JwtAuthGuard)
    @Get('field/:fieldName/submissions')
    async getSubmissionsByField(@Param('fieldName') fieldName: string) {
        return this.formsService.getSubmissionsByField(fieldName);
    }

    /**
     * Get VERIFIED users who selected a specific field (for tech leads to add to team)
     */
    @UseGuards(JwtAuthGuard)
    @Get('field/:fieldName/verified')
    async getVerifiedByField(@Param('fieldName') fieldName: string) {
        return this.formsService.getVerifiedByField(fieldName);
    }

    /**
     * Management team: Verify an application (first stage)
     */
    @UseGuards(JwtAuthGuard)
    @Post('submissions/:submissionId/verify')
    async verifyApplication(@Param('submissionId') submissionId: string) {
        return this.formsService.verifyApplication(submissionId);
    }

    /**
     * Tech Lead: Approve a verified submission and add user to field
     */
    @UseGuards(JwtAuthGuard)
    @Post('submissions/:submissionId/approve')
    async approveApplication(
        @Param('submissionId') submissionId: string,
        @Body('fieldId') fieldId: string,
    ) {
        return this.formsService.approveApplication(submissionId, fieldId);
    }
}


