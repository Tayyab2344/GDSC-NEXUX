import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class QuizService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
    ) { }

    async createQuiz(data: { title: string; description?: string; fieldId: string; creatorId: string; questions?: any; aiTopic?: string }) {
        let questions = data.questions;

        if (data.aiTopic && (!questions || questions.length === 0)) {
            questions = await this.aiService.generateQuizQuestions(data.aiTopic);
        }

        return this.prisma.quiz.create({
            data: {
                title: data.title,
                description: data.description,
                questions: questions || [],
                field: { connect: { id: data.fieldId } },
                creator: { connect: { id: data.creatorId } },
            },
        });
    }

    async getQuizzesByField(fieldId: string) {
        return this.prisma.quiz.findMany({
            where: { fieldId },
            include: { creator: { select: { fullName: true } } },
        });
    }

    async submitQuiz(data: { quizId: string; userId: string; answers: any }) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id: data.quizId } });
        if (!quiz) throw new NotFoundException('Quiz not found');

        const questions = quiz.questions as any[];
        let score = 0;

        questions.forEach((q, index) => {
            if (data.answers[index] === q.correctAnswer) {
                score++;
            }
        });

        const passed = (score / questions.length) >= 0.6; // 60% pass mark

        // Award XP if passed
        if (passed) {
            await this.prisma.user.update({
                where: { id: data.userId },
                data: { xp: { increment: score * 10 } }
            });
        }

        return this.prisma.quizSubmission.create({
            data: {
                quizId: data.quizId,
                userId: data.userId,
                answers: data.answers,
                score,
                passed,
            },
        });
    }

    async getUserSubmissions(userId: string) {
        return this.prisma.quizSubmission.findMany({
            where: { userId },
            include: { quiz: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getLeaderboard(quizId: string) {
        return this.prisma.quizSubmission.findMany({
            where: { quizId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: [
                { score: 'desc' },
                { createdAt: 'asc' }, // Tie-break with first to finish
            ],
            take: 10,
        });
    }
}
