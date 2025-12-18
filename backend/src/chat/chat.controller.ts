import { Controller, Get, Post, UseGuards, Request, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('rooms')
    async getUserChats(@Request() req: any) {
        return this.chatService.getUserChats(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':roomId/messages')
    async getMessages(@Param('roomId') roomId: string) {
        return this.chatService.getMessages(roomId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('Upload request received. File:', file ? file.originalname : 'No file');
        if (!file) throw new Error('No file uploaded');
        return this.cloudinaryService.uploadImage(file);
    }
}
