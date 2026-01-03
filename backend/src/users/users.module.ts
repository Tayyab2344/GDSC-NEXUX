import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { BadgesService } from './badges.service';

@Module({
    imports: [CloudinaryModule],
    controllers: [UsersController],
    providers: [UsersService, BadgesService],
    exports: [UsersService, BadgesService]
})
export class UsersModule { }
