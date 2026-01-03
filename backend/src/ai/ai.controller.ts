import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(private aiService: AiService) { }

    @Post('refine-announcement')
    async refineAnnouncement(@Body('content') content: string) {
        return { refined: await this.aiService.refineAnnouncement(content) };
    }

    @Post('resume-feedback')
    async resumeFeedback(@Body() body: { resume: string; field: string }) {
        return { feedback: await this.aiService.giveResumeFeedback(body.resume, body.field) };
    }

    @Post('summarize-submissions')
    async summarizeSubmissions(@Body('submissions') submissions: any[]) {
        return { summary: await this.aiService.summarizeSubmissions(submissions) };
    }

    @Post('generate-summary')
    async generateSummary(@Body('transcript') transcript: string) {
        return { summary: await this.aiService.generateMeetingSummary(transcript) };
    }

    @Post('quiz-gen')
    async generateQuiz(@Body('topic') topic: string) {
        return { questions: await this.aiService.generateQuizQuestions(topic) };
    }
}
