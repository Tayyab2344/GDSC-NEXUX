import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [PrismaModule, UsersModule, CloudinaryModule],
    controllers: [AnnouncementsController],
    providers: [AnnouncementsService],
    exports: [AnnouncementsService],
})
export class AnnouncementsModule { }
