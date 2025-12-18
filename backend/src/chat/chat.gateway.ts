import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

interface ChatPayload {
    chatId: string;
    content: string;
    senderId: string;
    senderName: string;
    type?: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO';
    fileUrl?: string;
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, { socketId: string; userId: string }> = new Map();

    constructor(private prisma: PrismaService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedUsers.delete(client.id);
    }

    @SubscribeMessage('authenticate')
    handleAuthenticate(
        @MessageBody() data: { userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        this.connectedUsers.set(client.id, {
            socketId: client.id,
            userId: data.userId,
        });
        console.log(`User ${data.userId} authenticated on socket ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(room);
        console.log(`Client ${client.id} joined room ${room}`);
        client.to(room).emit('userJoined', { socketId: client.id, room });
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(room);
        console.log(`Client ${client.id} left room ${room}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() payload: ChatPayload,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            // Save message to database
            const message = await this.prisma.chatMessage.create({
                data: {
                    chatId: payload.chatId,
                    senderId: payload.senderId,
                    content: payload.content,
                    type: payload.type || 'TEXT',
                    fileUrl: payload.fileUrl,
                },
                include: {
                    sender: {
                        select: { id: true, fullName: true, avatarUrl: true },
                    },
                },
            });

            // Broadcast to room
            this.server.to(payload.chatId).emit('newMessage', {
                id: message.id,
                chatId: message.chatId,
                content: message.content,
                type: message.type,
                fileUrl: message.fileUrl,
                sender: message.sender,
                createdAt: message.createdAt,
            });
        } catch (error) {
            console.error('Error saving message:', error);
            client.emit('error', { message: 'Failed to send message' });
        }
    }

    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() data: { chatId: string; userId: string; userName: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(data.chatId).emit('userTyping', {
            userId: data.userId,
            userName: data.userName,
        });
    }

    @SubscribeMessage('stopTyping')
    handleStopTyping(
        @MessageBody() data: { chatId: string; userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(data.chatId).emit('userStoppedTyping', {
            userId: data.userId,
        });
    }
}
