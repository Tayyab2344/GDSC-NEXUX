import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { EmailService } from './src/email/email.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const emailService = app.get(EmailService);

    console.log('--- Testing Email Broadcast ---');
    try {
        const result = await emailService.broadcastToAll(
            'Test Broadcast Logic',
            '<h1>This is a test of the broadcast recipient logic.</h1>'
        );
        console.log('Broadcast Result:', result);
    } catch (error) {
        console.error('Broadcast Failed:', error);
    }

    await app.close();
}

bootstrap();
