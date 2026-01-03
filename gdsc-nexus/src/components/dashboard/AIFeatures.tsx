import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
    Brain, Sparkles, FileText, Users, TrendingUp, Calendar,
    Lightbulb, AlertTriangle, CheckCircle, Clock, Loader2,
    BookOpen, Target, BarChart3, MessageSquare, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIFeatureCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const AIFeatureCard = ({ title, description, icon: Icon, color, isLoading, children }: AIFeatureCardProps) => (
    <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "border-l-4",
        color
    )}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16" />
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl", color.replace("border-l-", "bg-").replace("/50", "/10"))}>
                        <Icon className={cn("w-5 h-5", color.replace("border-l-", "text-").replace("/50", ""))} />
                    </div>
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            {title}
                            <Sparkles className="w-4 h-4 text-google-yellow" />
                        </CardTitle>
                        <CardDescription className="text-xs">{description}</CardDescription>
                    </div>
                </div>
                {isLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
            </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

// AI Meeting Summary Generator
interface MeetingSummaryProps {
    onGenerate?: (notes: string) => void;
}

export const AIMeetingSummary = ({ onGenerate }: MeetingSummaryProps) => {
    const [notes, setNotes] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [summary, setSummary] = useState<{
        keyPoints: string[];
        actionItems: string[];
        decisions: string[];
    } | null>(null);

    const handleGenerate = async () => {
        if (!notes.trim()) return;
        setIsGenerating(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ transcript: notes })
            });

            if (!res.ok) throw new Error("Failed to generate summary");
            const data = await res.json();

            // The AI returns a string summary, let's try to parse or just show it
            // For now, if it's just a string, we'll display it in a simpler way
            // or we can ask the AI to return structured JSON in the prompt

            setSummary({
                keyPoints: [data.summary],
                actionItems: [],
                decisions: []
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AIFeatureCard
            title="Meeting Summary Generator"
            description="Auto-generate summaries from your session notes"
            icon={FileText}
            color="border-l-google-blue/50"
            isLoading={isGenerating}
        >
            {!summary ? (
                <div className="space-y-4">
                    <Textarea
                        placeholder="Paste your meeting notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[120px] text-sm"
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={!notes.trim() || isGenerating}
                        className="w-full bg-google-blue hover:bg-google-blue/90"
                    >
                        <Brain className="w-4 h-4 mr-2" />
                        {isGenerating ? "Analyzing..." : "Generate Summary"}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-google-blue/5 border border-google-blue/20">
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-google-blue" /> Key Points
                        </h4>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                            {summary.keyPoints.map((p, i) => <li key={i}>• {p}</li>)}
                        </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-google-green/5 border border-google-green/20">
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-google-green" /> Action Items
                        </h4>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                            {summary.actionItems.map((a, i) => <li key={i}>• {a}</li>)}
                        </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-google-yellow/5 border border-google-yellow/20">
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-google-yellow" /> Decisions Made
                        </h4>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                            {summary.decisions.map((d, i) => <li key={i}>• {d}</li>)}
                        </ul>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSummary(null)} className="w-full">
                        Generate New Summary
                    </Button>
                </div>
            )}
        </AIFeatureCard>
    );
};

// AI Member Performance Insights
export const AIMemberInsights = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [insights, setInsights] = useState<any>(null);

    const analyze = async () => {
        setIsAnalyzing(true);
        await new Promise(r => setTimeout(r, 1500));
        setInsights({
            topPerformers: [
                { name: "Ahmed Khan", score: 95, trend: "+12%" },
                { name: "Sara Ali", score: 92, trend: "+8%" },
                { name: "Usman Raza", score: 88, trend: "+5%" }
            ],
            atRisk: [
                { name: "Ali Hassan", attendance: 45, lastActive: "2 weeks ago" },
                { name: "Fatima Noor", attendance: 52, lastActive: "10 days ago" }
            ],
            avgEngagement: 78,
            recommendedActions: [
                "Send reminder to inactive members",
                "Schedule 1-on-1 with at-risk members",
                "Recognize top performers in next meeting"
            ]
        });
        setIsAnalyzing(false);
    };

    return (
        <AIFeatureCard
            title="Member Performance Insights"
            description="AI-powered analysis of member engagement"
            icon={Users}
            color="border-l-google-green/50"
            isLoading={isAnalyzing}
        >
            {!insights ? (
                <Button onClick={analyze} disabled={isAnalyzing} className="w-full bg-google-green hover:bg-google-green/90">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Analyze Members"}
                </Button>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">Avg Engagement Score</span>
                        <div className="flex items-center gap-2">
                            <Progress value={insights.avgEngagement} className="w-20 h-2" />
                            <span className="font-bold text-google-green">{insights.avgEngagement}%</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Top Performers</h4>
                        {insights.topPerformers.map((p: any, i: number) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                <span className="text-sm font-medium">{p.name}</span>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-google-green/10 text-google-green">{p.score}</Badge>
                                    <span className="text-xs text-google-green">{p.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-google-red" /> At Risk
                        </h4>
                        {insights.atRisk.map((m: any, i: number) => (
                            <div key={i} className="flex items-center justify-between py-2 text-sm">
                                <span>{m.name}</span>
                                <span className="text-xs text-muted-foreground">{m.attendance}% attendance</span>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setInsights(null)} className="w-full">
                        Refresh Analysis
                    </Button>
                </div>
            )}
        </AIFeatureCard>
    );
};

// AI Content Suggestion Engine
export const AIContentSuggestions = () => {
    const [suggestions, setSuggestions] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getSuggestions = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setSuggestions({
            quizTopics: [
                "React Hooks Deep Dive",
                "TypeScript Generics",
                "REST API Best Practices"
            ],
            resources: [
                { title: "Advanced CSS Grid Layouts", type: "Article", relevance: 95 },
                { title: "Building Scalable APIs", type: "Video", relevance: 88 },
                { title: "Git Workflow Strategies", type: "Tutorial", relevance: 82 }
            ],
            upcomingTrends: ["AI/ML Integration", "Edge Computing", "WebAssembly"]
        });
        setIsLoading(false);
    };

    return (
        <AIFeatureCard
            title="Content Suggestion Engine"
            description="AI-curated learning resources and quiz topics"
            icon={BookOpen}
            color="border-l-google-yellow/50"
            isLoading={isLoading}
        >
            {!suggestions ? (
                <Button onClick={getSuggestions} disabled={isLoading} className="w-full bg-google-yellow hover:bg-google-yellow/90 text-black">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isLoading ? "Generating..." : "Get Suggestions"}
                </Button>
            ) : (
                <div className="space-y-4">
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Recommended Quiz Topics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.quizTopics.map((t: string, i: number) => (
                                <Badge key={i} variant="outline" className="cursor-pointer hover:bg-google-yellow/10">
                                    {t}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Learning Resources
                        </h4>
                        {suggestions.resources.map((r: any, i: number) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium">{r.title}</p>
                                    <p className="text-xs text-muted-foreground">{r.type}</p>
                                </div>
                                <Badge className="bg-google-blue/10 text-google-blue text-xs">{r.relevance}% match</Badge>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 rounded-lg bg-gradient-to-r from-google-blue/5 to-google-green/5 border border-white/10">
                        <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Trending Topics
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {suggestions.upcomingTrends.map((t: string, i: number) => (
                                <Badge key={i} className="bg-white/10 text-xs">{t}</Badge>
                            ))}
                        </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setSuggestions(null)} className="w-full">
                        Refresh Suggestions
                    </Button>
                </div>
            )}
        </AIFeatureCard>
    );
};

// AI Attendance Predictor
export const AIAttendancePredictor = () => {
    const [prediction, setPrediction] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const predict = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setPrediction({
            nextSession: {
                expected: 28,
                confidence: 85,
                bestTime: "Wednesday 4:00 PM",
                peakDays: ["Wednesday", "Thursday"]
            },
            factors: [
                { name: "Time Slot", impact: "positive", detail: "4 PM slots show +15% attendance" },
                { name: "Exam Week", impact: "negative", detail: "Expected -20% due to upcoming exams" },
                { name: "Topic Interest", impact: "positive", detail: "React topics see +25% engagement" }
            ],
            historicalTrend: [65, 72, 68, 80, 75, 85]
        });
        setIsLoading(false);
    };

    return (
        <AIFeatureCard
            title="Attendance Predictor"
            description="Forecast attendance and optimize scheduling"
            icon={Calendar}
            color="border-l-google-red/50"
            isLoading={isLoading}
        >
            {!prediction ? (
                <Button onClick={predict} disabled={isLoading} className="w-full bg-google-red hover:bg-google-red/90">
                    <Zap className="w-4 h-4 mr-2" />
                    {isLoading ? "Predicting..." : "Predict Attendance"}
                </Button>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-google-red/10 to-google-yellow/10 border border-white/10 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Expected Attendance</p>
                        <p className="text-4xl font-bold text-google-red">{prediction.nextSession.expected}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {prediction.nextSession.confidence}% confidence
                        </p>
                    </div>

                    <div className="p-3 rounded-lg bg-google-green/5 border border-google-green/20">
                        <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-google-green" /> Optimal Time
                        </h4>
                        <p className="text-sm font-medium text-google-green">{prediction.nextSession.bestTime}</p>
                        <p className="text-xs text-muted-foreground">
                            Peak days: {prediction.nextSession.peakDays.join(", ")}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Impact Factors
                        </h4>
                        {prediction.factors.map((f: any, i: number) => (
                            <div key={i} className="flex items-start gap-2 py-2 border-b border-border/50 last:border-0">
                                <div className={cn(
                                    "w-2 h-2 rounded-full mt-1.5",
                                    f.impact === "positive" ? "bg-google-green" : "bg-google-red"
                                )} />
                                <div>
                                    <p className="text-sm font-medium">{f.name}</p>
                                    <p className="text-xs text-muted-foreground">{f.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setPrediction(null)} className="w-full">
                        Refresh Prediction
                    </Button>
                </div>
            )}
        </AIFeatureCard>
    );
};

export const QuizLeaderboard = ({ quizId }: { quizId: string }) => {
    const token = localStorage.getItem("token");
    const { data: leaderboard, isLoading } = useQuery({
        queryKey: ["quiz-leaderboard", quizId],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/quizzes/${quizId}/leaderboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch leaderboard");
            return res.json();
        },
        enabled: !!quizId && !!token
    });

    return (
        <AIFeatureCard
            title="Quiz Leaderboard"
            description="See how you rank among other members"
            icon={Target}
            color="border-l-google-blue/50"
            isLoading={isLoading}
        >
            <div className="space-y-3">
                {leaderboard?.map((entry: any, index: number) => (
                    <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold",
                                index === 0 ? "bg-google-yellow text-white" :
                                    index === 1 ? "bg-slate-300 text-slate-700" :
                                        index === 2 ? "bg-orange-400 text-white" : "bg-muted text-muted-foreground"
                            )}>
                                {index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-google-blue/10 flex items-center justify-center overflow-hidden">
                                    {entry.user.avatarUrl ? (
                                        <img src={entry.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[10px]">{entry.user.fullName[0]}</span>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{entry.user.fullName}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-google-blue">{entry.score} pts</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {(!leaderboard || leaderboard.length === 0) && !isLoading && (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                        No submissions yet. Be the first to take the quiz!
                    </div>
                )}
            </div>
        </AIFeatureCard>
    );
};
