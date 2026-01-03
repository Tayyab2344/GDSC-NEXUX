import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizController {
    constructor(private quizService: QuizService) { }

    @Post()
    async create(@Body() body: any, @Request() req: any) {
        return this.quizService.createQuiz({
            ...body,
            creatorId: req.user.id,
        });
    }

    @Get('field/:fieldId')
    async getByField(@Param('fieldId') fieldId: string) {
        return this.quizService.getQuizzesByField(fieldId);
    }

    @Post('submit')
    async submit(@Body() body: any, @Request() req: any) {
        return this.quizService.submitQuiz({
            ...body,
            userId: req.user.id,
        });
    }

    @Get('my-submissions')
    async getMySubmissions(@Request() req: any) {
        return this.quizService.getUserSubmissions(req.user.id);
    }

    @Get(':id/leaderboard')
    async getLeaderboard(@Param('id') id: string) {
        return this.quizService.getLeaderboard(id);
    }
}
