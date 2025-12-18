import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatVisibility, Role } from '@prisma/client';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    saveMessage(payload: any) {
        // Logged in gateway, actually saved there
        console.log('Message payload received:', payload);
    }

    async getUserChats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                fields: true,
                teams: true
            }
        });

        if (!user) return [];

        const isLead = ([Role.TEAM_LEAD, Role.CO_LEAD, Role.PRESIDENT, Role.FACULTY_HEAD] as Role[]).includes(user.role);
        const isFaculty = user.role === Role.FACULTY_HEAD || user.role === Role.PRESIDENT;

        // 1. Public chats
        const publicChats = await this.prisma.chat.findMany({
            where: { visibility: ChatVisibility.PUBLIC }
        });

        // 2. Role-based chats (Leads Only / Hidden)
        let roleChats: any[] = [];
        if (isLead) {
            roleChats = await this.prisma.chat.findMany({
                where: {
                    visibility: { in: [ChatVisibility.LEADS_ONLY, ChatVisibility.HIDDEN] }
                }
            });
        }

        // 3. Team/Field chats
        // Faculty sees ALL field/team chats? "Faculty Lead... able to access all chat groups"
        let membershipChats = [];
        if (isFaculty) {
            membershipChats = await this.prisma.chat.findMany({
                where: {
                    visibility: ChatVisibility.MEMBERS_ONLY
                }
            });
        } else {
            // Regular members/leads see chats for their assigned fields/teams
            const fieldIds = user.fields.map(f => f.fieldId);
            const teamIds = user.teams.map(t => t.teamId);

            membershipChats = await this.prisma.chat.findMany({
                where: {
                    visibility: ChatVisibility.MEMBERS_ONLY,
                    OR: [
                        { fieldId: { in: fieldIds } },
                        { teamId: { in: teamIds } },
                        // If a chat is MEMBERS_ONLY but has no field/team, implied for all members? 
                        // Let's assume General Chat covers that (Public). 
                        // But if there's a "Members Only" general chat:
                        { fieldId: null, teamId: null }
                    ]
                }
            });
        }

        // Merge and deduplicate
        const allChats = [...publicChats, ...roleChats, ...membershipChats];
        const uniqueChats = Array.from(new Map(allChats.map(item => [item.id, item])).values());

        return uniqueChats;
    }

    async getMessages(chatId: string) {
        return this.prisma.chatMessage.findMany({
            where: { chatId },
            include: { sender: { select: { id: true, fullName: true, role: true, avatarUrl: true } } },
            orderBy: { createdAt: 'asc' }
        });
    }
}
