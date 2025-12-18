import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [PrismaModule, UsersModule, CloudinaryModule],
    controllers: [FormsController],
    providers: [FormsService],
    exports: [FormsService],
})
export class FormsModule { }

