import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        }
    }

    async generateContent(prompt: string): Promise<string> {
        if (!this.model) return this.getMockResponse(prompt);
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini AI Error:', error.message);
            // Fallback to mock for certain errors (Quota/Network)
            if (error.status === 429 || error.status === 404 || error.message?.includes('fetch')) {
                console.log('Falling back to Mock AI Response...');
                return this.getMockResponse(prompt);
            }
            return 'Error generating AI content.';
        }
    }

    private getMockResponse(prompt: string): string {
        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes('summarize the following meeting')) {
            if (lowerPrompt.length < 200) {
                return `### 📝 Short Meeting Summary (Demo Mode)
The meeting transcript provided was very brief ("${lowerPrompt.split(':').pop()?.trim()}"). 

**Summary:** 
A quick sync-up or check-in was conducted. No major technical blockers were reported in this short exchange.

**Note:** This is an offline fallback because the AI API quota is currently exhausted.`;
            }
            return `### 📝 Meeting Summary (Demo Mode)
Core focus was on the upcoming Nexus event and final project deliverables. 

**Key Points:**
- **Infrastructure**: Backend stabilization is 90% complete.
- **Frontend**: Dashboard layout finalized.
- **Admin**: Form builder logic for Member Applications is live.

**Action Items:**
- ✅ Finalize AI model fallbacks (Done)
- 🔜 Prepare documentation for deployment.
- 🔜 Conduct final user testing session.`;
        }

        if (lowerPrompt.includes('multiple-choice questions')) {
            return JSON.stringify([
                {
                    "question": "Which hook is used for side effects in React?",
                    "options": ["useState", "useEffect", "useContext", "useReducer"],
                    "correctAnswer": 1
                },
                {
                    "question": "What does DOM stand for?",
                    "options": ["Document Object Model", "Desktop Object Management", "Data Object Mode", "Digital Ordinance Map"],
                    "correctAnswer": 0
                },
                {
                    "question": "Which CSS property is used to change text color?",
                    "options": ["background-color", "font-style", "color", "text-align"],
                    "correctAnswer": 2
                },
                {
                    "question": "How do you pass data from parent to child in React?",
                    "options": ["State", "Props", "Context", "ID"],
                    "correctAnswer": 1
                },
                {
                    "question": "What command starts a development server in Vite?",
                    "options": ["npm start", "npm run dev", "npm build", "npm serve"],
                    "correctAnswer": 1
                }
            ]);
        }

        if (lowerPrompt.includes('summarize the following form submissions')) {
            return `### 📊 Lead Analysis (Demo Mode)
Based on the recent applications, there is a strong trend in **Technical Lead** candidates with React and NestJS experience.

**Top Recommendations:**
1. **Candidate A**: Strong UI/UX background, ideal for Creative Design Lead.
2. **Candidate B**: Backend enthusiast with SQL experience, perfect for Core Lead.

**Key Observation**: 80% of applicants are interested in the Web Development field.`;
        }

        if (lowerPrompt.includes('analyze this resume')) {
            return `### 📑 Resume Feedback (Demo Mode)
Your resume is well-structured and clearly highlights your technical skills.

**Strengths:**
- Clear project sections with quantifiable results.
- Relevant tech stack for GDSC roles.

**Suggestions:**
- Consider adding more "Impact" statements (e.g., 'Improved performance by 20%').
- Ensure your GitHub links are active and repos have READMEs.`;
        }

        return "This is a high-quality AI-generated response optimized for your GDSC Nexus workspace. (Offline Demo Mode)";
    }

    async summarizeSubmissions(submissions: any[]): Promise<string> {
        const prompt = `Summarize the following form submissions and identify key trends and top candidates: ${JSON.stringify(submissions)}`;
        return this.generateContent(prompt);
    }

    async refineAnnouncement(content: string): Promise<string> {
        const prompt = `Refine this announcement to be professional and engaging for a Google Developer Student Club society: ${content}`;
        return this.generateContent(prompt);
    }

    async generateQuizQuestions(topic: string, difficulty: string = 'intermediate'): Promise<any> {
        const prompt = `Generate 5 multiple-choice questions for the topic "${topic}" with difficulty "${difficulty}". 
    Return the response as a valid JSON array of objects, where each object has:
    "question": string,
    "options": string[],
    "correctAnswer": number (index of options array).
    Only return the JSON.`;
        const response = await this.generateContent(prompt);
        try {
            const jsonMatch = response.match(/\[.*\]/s);
            return JSON.parse(jsonMatch ? jsonMatch[0] : response);
        } catch (e) {
            console.error('Failed to parse AI Quiz JSON:', e);
            return [];
        }
    }

    async giveResumeFeedback(resumeContent: string, field: string): Promise<string> {
        const prompt = `Analyze this resume content and provide constructive feedback specifically for someone applying for a position in the "${field}" field of a tech society like GDSC: ${resumeContent}`;
        return this.generateContent(prompt);
    }

    async generateMeetingSummary(transcript: string): Promise<string> {
        const prompt = `Summarize the following meeting transcript. Provide a concise summary, key points discussed, and action items: ${transcript}`;
        return this.generateContent(prompt);
    }
}
