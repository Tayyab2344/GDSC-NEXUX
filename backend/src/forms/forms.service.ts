import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { SubmissionStatus, FormType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FormsService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService
    ) { }

    async create(data: { title: string; slug: string; description?: string; schema: any; isPublic?: boolean; type?: FormType; createdBy: string }) {
        return this.prisma.form.create({ data });
    }

    async findAll() {
        return this.prisma.form.findMany({
            include: {
                creator: { select: { id: true, fullName: true } },
                _count: { select: { submissions: true } },
            },
        });
    }

    async findPublic() {
        return this.prisma.form.findMany({
            where: { isPublic: true },
            select: { id: true, title: true, description: true, schema: true },
        });
    }

    async findOne(id: string) {
        const form = await this.prisma.form.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, fullName: true } },
                submissions: {
                    include: { user: { select: { id: true, fullName: true, email: true } } },
                },
            },
        });
        if (!form) throw new NotFoundException('Form not found');
        return form;
    }

    async findBySlug(slug: string) {
        const form = await this.prisma.form.findUnique({
            where: { slug },
            select: { id: true, title: true, description: true, schema: true, isPublic: true },
        });
        if (!form) throw new NotFoundException('Form not found');
        return form;
    }

    async update(id: string, data: { title?: string; description?: string; schema?: any; isPublic?: boolean; type?: any }) {
        return this.prisma.form.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.$transaction(async (tx) => {
            // First delete all submissions associated with this form
            await tx.formSubmission.deleteMany({
                where: { formId: id }
            });
            // Then delete the form itself
            return tx.form.delete({
                where: { id }
            });
        });
    }

    // Submissions
    async submitForm(formId: string, data: any, userId?: string) {
        return this.prisma.formSubmission.create({
            data: {
                formId,
                data,
                userId,
                status: SubmissionStatus.PENDING,
            },
        });
    }

    async getSubmissions(formId: string) {
        return this.prisma.formSubmission.findMany({
            where: { formId },
            include: { user: { select: { id: true, fullName: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getSubmissionsBySlug(slug: string) {
        const form = await this.prisma.form.findUnique({ where: { slug } });
        if (!form) throw new NotFoundException('Form not found');

        return this.prisma.formSubmission.findMany({
            where: { formId: form.id },
            include: {
                user: { select: { id: true, fullName: true, email: true } },
                form: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getSubmissionsByType(type: FormType) {
        return this.prisma.formSubmission.findMany({
            where: { form: { type } },
            include: {
                user: { select: { id: true, fullName: true, email: true } },
                form: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateSubmissionStatus(submissionId: string, status: SubmissionStatus) {
        return this.prisma.formSubmission.update({
            where: { id: submissionId },
            data: { status },
        });
    }

    /**
     * Approve a membership application:
     * 1. Update submission status to APPROVED
     * 2. Find/create user and assign membershipId
     * 3. Add user to the preferred field
     */
    async approveApplication(submissionId: string, fieldId: string) {
        const submission = await this.prisma.formSubmission.findUnique({
            where: { id: submissionId },
            include: { form: true, user: true }
        });

        if (!submission) throw new NotFoundException('Submission not found');

        const formData = submission.data as any;
        const email = formData.email;
        const regNo = formData.regNo;

        // Find or create user
        let user = submission.user;
        if (!user && email) {
            user = await this.prisma.user.findUnique({ where: { email } });
        }

        if (!user) {
            // Create user from form data
            user = await this.prisma.user.create({
                data: {
                    email: email || `temp-${Date.now()}@gdsc.local`,
                    fullName: formData.fullName || 'New Member',
                    regNo: regNo || null,
                    status: 'APPLICANT',
                    role: 'GENERAL_MEMBER'
                }
            });
        }

        // Update submission with userId if not linked
        await this.prisma.formSubmission.update({
            where: { id: submissionId },
            data: {
                userId: user.id,
                status: SubmissionStatus.APPROVED
            }
        });

        // Update user's regNo if provided and not set
        if (regNo && !user.regNo) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { regNo }
            });
        }

        // Assign membershipId and update user status to MEMBER
        const membershipId = await this.usersService.assignMembershipId(user.id);

        // Add user to the specified field (and its parent team)
        const { teamId } = await this.usersService.addUserToField(user.id, fieldId);

        return {
            submissionId,
            userId: user.id,
            membershipId,
            fieldId,
            teamId,
            status: 'APPROVED'
        };
    }

    /**
     * Management team verification - first stage of approval
     * Sets user status to VERIFIED (member of society, pending tech team assignment)
     */
    async verifyApplication(submissionId: string) {
        const submission = await this.prisma.formSubmission.findUnique({
            where: { id: submissionId },
            include: { form: true, user: true }
        });

        if (!submission) throw new NotFoundException('Submission not found');

        const formData = submission.data as any;
        const formSlug = submission.form.slug;

        // Dispatch based on form type (Lead Application vs Membership)
        if (formSlug === 'lead-application' || formData.role === 'TEAM_LEAD') {
            return this.approveLeadApplication(submission, formData);
        } else {
            return this.approveGeneralMember(submission, formData);
        }
    }

    private async approveGeneralMember(submission: any, formData: any) {
        const email = formData.email;
        const regNo = formData.regNo;
        const techFields = formData.technicalFields || [];
        const nonTechFields = formData.nonTechnicalFields || [];
        const allFields = [...(Array.isArray(techFields) ? techFields : [techFields]), ...(Array.isArray(nonTechFields) ? nonTechFields : [nonTechFields])].filter(Boolean);

        // Find or create user
        let user = await this.findOrCreateUser(submission.user, email, formData, 'GENERAL_MEMBER', regNo);

        // Link submission
        if (submission.userId !== user.id) {
            await this.prisma.formSubmission.update({ where: { id: submission.id }, data: { userId: user.id } });
        }

        // Assign Membership ID
        const membershipId = await this.usersService.assignMembershipId(user.id);

        // Add to ALL selected fields
        for (const fieldName of allFields) {
            try {
                // We need to look up the field ID by name first. 
                // Since usersService.addUserToField expects ID, we need a helper or updated method.
                // Assuming we can find field by name via Prisma directly for now to be safe.
                // We usually want findFirst if name is not unique
                const field = await this.prisma.field.findFirst({ where: { name: fieldName } });
                if (field) {
                    await this.usersService.addUserToField(user.id, field.id);
                }
            } catch (e) {
                console.warn(`Failed to add user to field ${fieldName}:`, e);
            }
        }

        // Finalize Submission
        await this.prisma.formSubmission.update({
            where: { id: submission.id },
            data: { status: SubmissionStatus.APPROVED }
        });

        return { submissionId: submission.id, userId: user.id, status: 'APPROVED', membershipId };
    }

    private async approveLeadApplication(submission: any, formData: any) {
        const email = formData.email;
        const regNo = formData.regNo;
        const preferredField = formData.preferredField || formData.technicalFields?.[0] || formData.nonTechnicalFields?.[0]; // Lead applies to ONE field

        // Find or create user - Role is TEAM_LEAD
        let user = await this.findOrCreateUser(submission.user, email, formData, 'TEAM_LEAD', regNo);

        // Link submission
        if (submission.userId !== user.id) {
            await this.prisma.formSubmission.update({ where: { id: submission.id }, data: { userId: user.id } });
        }

        // Assign Membership ID
        const membershipId = await this.usersService.assignMembershipId(user.id);

        // Add to the ONE selected field
        if (preferredField) {
            const field = await this.prisma.field.findFirst({ where: { name: preferredField } });
            if (field) {
                await this.usersService.addUserToField(user.id, field.id);
            }
        }

        // Finalize Submission
        await this.prisma.formSubmission.update({
            where: { id: submission.id },
            data: { status: SubmissionStatus.APPROVED }
        });

        return { submissionId: submission.id, userId: user.id, status: 'APPROVED', role: 'TEAM_LEAD', membershipId };
    }

    private async findOrCreateUser(existingUser: any, email: string, formData: any, role: any, regNo: string) {
        let user = existingUser;
        if (!user && email) {
            user = await this.prisma.user.findUnique({ where: { email } });
        }

        if (!user) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            user = await this.prisma.user.create({
                data: {
                    email: email || `temp-${Date.now()}@gdsc.local`,
                    fullName: formData.fullName || 'New Member',
                    regNo: regNo || null,
                    password: hashedPassword,
                    status: 'MEMBER', // Directly active
                    role: role,
                    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${(formData.fullName || 'New Member').replace(/ /g, '')}`
                }
            });
        } else {
            // Update existing user to MEMBER and update role if upgrading to LEAD
            const updateData: any = { status: 'MEMBER', regNo: regNo || user.regNo };
            if (role === 'TEAM_LEAD') updateData.role = 'TEAM_LEAD'; // Upgrade role

            user = await this.prisma.user.update({
                where: { id: user.id },
                data: updateData
            });
        }
        return user;
    }

    /**
     * Get VERIFIED users who selected a specific field (for tech leads)
     */
    async getVerifiedByField(fieldName: string) {
        const form = await this.prisma.form.findUnique({ where: { slug: 'membership' } });
        if (!form) throw new NotFoundException('Membership form not found');

        const submissions = await this.prisma.formSubmission.findMany({
            where: { formId: form.id },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, status: true, regNo: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Filter: user is VERIFIED and selected this field
        return submissions.filter(sub => {
            const data = sub.data as any;
            const isVerified = sub.user?.status === 'VERIFIED';
            const selectedTechField = data.technicalFields?.includes(fieldName);
            const selectedNonTechField = data.nonTechnicalFields?.includes(fieldName);
            const selectedPreferred = data.preferredField === fieldName;
            return isVerified && (selectedTechField || selectedNonTechField || selectedPreferred);
        });
    }

    /**
     * Get submissions filtered by field preference (for leads) - PENDING only
     */
    async getSubmissionsByField(fieldName: string) {
        const form = await this.prisma.form.findUnique({ where: { slug: 'membership' } });
        if (!form) throw new NotFoundException('Membership form not found');

        const allSubmissions = await this.prisma.formSubmission.findMany({
            where: { formId: form.id, status: 'PENDING' },
            include: { user: { select: { id: true, fullName: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Filter by technicalFields/nonTechnicalFields or preferredField
        return allSubmissions.filter(sub => {
            const data = sub.data as any;
            return data.preferredField === fieldName ||
                data.technicalFields?.includes(fieldName) ||
                data.nonTechnicalFields?.includes(fieldName);
        });
    }

    async getSubmission(id: string) {
        return this.prisma.formSubmission.findUnique({
            where: { id },
            include: { form: true, user: true },
        });
    }
}


