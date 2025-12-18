import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { FormsService } from './src/forms/forms.service';
import { UsersService } from './src/users/users.service';
import { AuthService } from './src/auth/auth.service';
import { Role, SubmissionStatus } from '@prisma/client';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const formsService = app.get(FormsService);
    const usersService = app.get(UsersService);
    const authService = app.get(AuthService);
    const prisma = (app.get(FormsService) as any).prisma; // Access prisma via service

    console.log('🚀 Starting Verification Script...');

    try {
        // 1. Login as President to get Token (Simulated)
        const president = await usersService.findByIdentifier('president@gdsc.dev');
        if (!president) throw new Error('President not found');
        console.log('✅ President found:', president.email);

        // 2. Create a specific Test Form
        console.log('📝 Creating Test Form...');
        const form = await formsService.create({
            createdBy: president.id,
            title: 'Automated Test Form',
            description: 'Testing via script',
            slug: 'auto-test-form-' + Date.now(),
            schema: {
                fields: [
                    { id: 'q1', type: 'text', label: 'Name', required: true },
                    { id: 'q2', type: 'email', label: 'Email', required: true }
                ]
            }
        });
        console.log('✅ Form Created:', form.slug);

        // 3. Submit Response (as Guest)
        const testEmail = `test.user.${Date.now()}@example.com`;
        console.log(`📨 Submitting response for ${testEmail}...`);
        const submission = await formsService.submitForm(form.id, {
            fullName: 'Test User',
            email: testEmail,
            regNo: 'FA24-BCS-000',
            technicalFields: ['Web Development'], // Simulating a membership form structure for approval logic
            nonTechnicalFields: []
        });
        console.log('✅ Submission Received:', submission.id);

        // 4. Approve Submission (Mocking the Membership Approval Flow)
        // We need to treat this as a membership form for the approval logic to trigger user creation
        // The service logic checks generic fields, so strictly passing 'technicalFields' in data helps.

        console.log('👍 Approving Submission...');
        // We can use verifyApplication which acts as a public entry point that delegates
        const result = await formsService.verifyApplication(submission.id);
        console.log('✅ Application Approved. User ID:', result.userId);

        // 5. Verify User Creation
        const newUser = await usersService.findOne(result.userId);
        if (!newUser) throw new Error('New User not found in DB');
        console.log('👤 New User found in DB:', newUser.email);

        if (newUser.role !== 'GENERAL_MEMBER') throw new Error(`Wrong Role: ${newUser.role}`);
        if (newUser.status !== 'MEMBER') throw new Error(`Wrong Status: ${newUser.status}`);

        // 6. Verify Login with Default Password
        console.log('🔑 Verifying Login with "password123"...');
        try {
            const loginResult = await authService.validateUserLocal(testEmail, 'password123');
            console.log('✅ Login Successful! Token:', loginResult.access_token ? 'Generated' : 'Missing');
        } catch (e) {
            console.error('❌ Login Failed:', e.message);
            throw e;
        }

        console.log('🎉 All Checks Passed!');

    } catch (e) {
        console.error('❌ Verification Failed:', e);
    } finally {
        await app.close();
    }
}

bootstrap();
