import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Global() // Make it global so we don't need to import it everywhere
@Module({
    imports: [ConfigModule, PrismaModule],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }
