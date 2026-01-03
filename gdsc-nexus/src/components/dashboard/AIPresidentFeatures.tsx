import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Brain, Sparkles, TrendingUp, TrendingDown, AlertTriangle,
    Lightbulb, CheckCircle, Target, BarChart3, MessageSquare,
    Zap, Shield, DollarSign, Heart, Users, Activity, Loader2,
    ThumbsUp, ThumbsDown, Minus, PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";

// AI Society Health Analyzer
export const AISocietyHealth = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [health, setHealth] = useState<any>(null);

    const analyze = async () => {
        setIsAnalyzing(true);
        await new Promise(r => setTimeout(r, 2000));
        setHealth({
            overallScore: 87,
            trend: "+5%",
            metrics: [
                { name: "Member Engagement", score: 92, status: "excellent" },
                { name: "Event Participation", score: 85, status: "good" },
                { name: "Learning Progress", score: 78, status: "moderate" },
                { name: "Community Activity", score: 88, status: "good" }
            ],
            fieldComparison: [
                { field: "Web Development", score: 94, trend: "up" },
                { field: "App Development", score: 88, trend: "up" },
                { field: "AI/ML", score: 82, trend: "stable" },
                { field: "Marketing", score: 76, trend: "down" }
            ],
            alerts: [
                { type: "warning", message: "Marketing field engagement dropped 12% this week" },
                { type: "info", message: "New member signups increased by 25%" }
            ]
        });
        setIsAnalyzing(false);
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-google-green";
        if (score >= 70) return "text-google-blue";
        if (score >= 50) return "text-google-yellow";
        return "text-google-red";
    };

    const getTrendIcon = (trend: string) => {
        if (trend === "up") return <TrendingUp className="w-4 h-4 text-google-green" />;
        if (trend === "down") return <TrendingDown className="w-4 h-4 text-google-red" />;
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    };

    return (
        <Card className="border-l-4 border-l-google-blue/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-google-blue/10 to-transparent rounded-full -mr-20 -mt-20" />
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-google-blue/10">
                            <Activity className="w-5 h-5 text-google-blue" />
                        </div>
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                Society Health Analyzer
                                <Sparkles className="w-4 h-4 text-google-yellow" />
                            </CardTitle>
                            <CardDescription className="text-xs">Real-time society performance scoring</CardDescription>
                        </div>
                    </div>
                    {isAnalyzing && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                </div>
            </CardHeader>
            <CardContent>
                {!health ? (
                    <Button onClick={analyze} disabled={isAnalyzing} className="w-full bg-google-blue hover:bg-google-blue/90">
                        <Brain className="w-4 h-4 mr-2" />
                        {isAnalyzing ? "Analyzing..." : "Analyze Society Health"}
                    </Button>
                ) : (
                    <div className="space-y-4">
                        {/* Overall Score */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-google-blue/10 to-google-green/10 border border-white/10 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Overall Health Score</p>
                            <div className="flex items-center justify-center gap-2">
                                <p className={cn("text-5xl font-bold", getScoreColor(health.overallScore))}>
                                    {health.overallScore}
                                </p>
                                <Badge className="bg-google-green/10 text-google-green">{health.trend}</Badge>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-2">
                            {health.metrics.map((m: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm">{m.name}</span>
                                    <div className="flex items-center gap-2">
                                        <Progress value={m.score} className="w-16 h-2" />
                                        <span className={cn("text-sm font-bold w-8", getScoreColor(m.score))}>{m.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Field Comparison */}
                        <div className="p-3 rounded-lg bg-muted/50">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Field Performance</h4>
                            {health.fieldComparison.map((f: any, i: number) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                                    <span className="text-sm">{f.field}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-sm font-bold", getScoreColor(f.score))}>{f.score}</span>
                                        {getTrendIcon(f.trend)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Alerts */}
                        {health.alerts.map((alert: any, i: number) => (
                            <div key={i} className={cn(
                                "p-3 rounded-lg flex items-start gap-2 text-sm",
                                alert.type === "warning" ? "bg-google-yellow/10 text-google-yellow" : "bg-google-blue/10 text-google-blue"
                            )}>
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                {alert.message}
                            </div>
                        ))}

                        <Button variant="outline" size="sm" onClick={() => setHealth(null)} className="w-full">
                            Refresh Analysis
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// AI Strategic Recommendations
export const AIStrategicRecommendations = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<any>(null);

    const generate = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        setRecommendations({
            growth: [
                { title: "Launch Flutter Workshop Series", impact: "high", effort: "medium", description: "Mobile development is trending. Expected +40 new members." },
                { title: "Partner with Local Tech Companies", impact: "high", effort: "high", description: "Sponsorship opportunities and internship placements." },
                { title: "Create YouTube Channel", impact: "medium", effort: "medium", description: "Expand reach beyond campus. Target: 1000 subscribers in 3 months." }
            ],
            collaboration: [
                { team: "AI/ML + Web Dev", idea: "Build an AI-powered portfolio generator", potential: "Very High" },
                { team: "Marketing + All Fields", idea: "Create unified brand guidelines", potential: "High" }
            ],
            resourceAllocation: {
                current: { events: 40, learning: 35, marketing: 15, operations: 10 },
                recommended: { events: 35, learning: 40, marketing: 20, operations: 5 }
            }
        });
        setIsLoading(false);
    };

    return (
        <Card className="border-l-4 border-l-google-green/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-google-green/10 to-transparent rounded-full -mr-20 -mt-20" />
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-google-green/10">
                        <Lightbulb className="w-5 h-5 text-google-green" />
                    </div>
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            Strategic Recommendations
                            <Sparkles className="w-4 h-4 text-google-yellow" />
                        </CardTitle>
                        <CardDescription className="text-xs">AI-powered growth and collaboration insights</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!recommendations ? (
                    <Button onClick={generate} disabled={isLoading} className="w-full bg-google-green hover:bg-google-green/90">
                        <Target className="w-4 h-4 mr-2" />
                        {isLoading ? "Generating..." : "Generate Recommendations"}
                    </Button>
                ) : (
                    <div className="space-y-4">
                        {/* Growth Initiatives */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Growth Initiatives</h4>
                            {recommendations.growth.map((g: any, i: number) => (
                                <div key={i} className="p-3 rounded-lg bg-muted/30 mb-2 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold">{g.title}</p>
                                        <div className="flex gap-1">
                                            <Badge className={cn("text-[10px]", g.impact === "high" ? "bg-google-green/10 text-google-green" : "bg-google-blue/10 text-google-blue")}>
                                                {g.impact} impact
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{g.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Collaboration Opportunities */}
                        <div className="p-3 rounded-lg bg-google-blue/5 border border-google-blue/20">
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                                <Users className="w-3 h-3 text-google-blue" /> Collaboration Ideas
                            </h4>
                            {recommendations.collaboration.map((c: any, i: number) => (
                                <div key={i} className="py-2 border-b border-border/30 last:border-0">
                                    <p className="text-sm font-medium">{c.team}</p>
                                    <p className="text-xs text-muted-foreground">{c.idea}</p>
                                </div>
                            ))}
                        </div>

                        {/* Resource Optimization */}
                        <div className="p-3 rounded-lg bg-google-yellow/5 border border-google-yellow/20">
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                                <PieChart className="w-3 h-3 text-google-yellow" /> Resource Optimization
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">Recommended budget reallocation:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Learning: <span className="text-google-green font-bold">+5%</span></div>
                                <div>Marketing: <span className="text-google-green font-bold">+5%</span></div>
                                <div>Events: <span className="text-google-red font-bold">-5%</span></div>
                                <div>Operations: <span className="text-google-red font-bold">-5%</span></div>
                            </div>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setRecommendations(null)} className="w-full">
                            Refresh Recommendations
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// AI Sentiment Analysis
export const AISentimentAnalysis = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sentiment, setSentiment] = useState<any>(null);

    const analyze = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1800));
        setSentiment({
            overall: { score: 78, label: "Positive", trend: "+8%" },
            breakdown: {
                positive: 65,
                neutral: 25,
                negative: 10
            },
            topics: [
                { topic: "Workshop Quality", sentiment: "very positive", mentions: 45 },
                { topic: "Event Timing", sentiment: "mixed", mentions: 32 },
                { topic: "Resource Availability", sentiment: "positive", mentions: 28 },
                { topic: "Communication", sentiment: "needs improvement", mentions: 22 }
            ],
            recentFeedback: [
                { text: "The React workshop was incredibly helpful!", type: "positive" },
                { text: "Wish we had more evening sessions", type: "neutral" },
                { text: "Great community support from seniors", type: "positive" }
            ]
        });
        setIsLoading(false);
    };

    const getSentimentColor = (sentiment: string) => {
        if (sentiment.includes("positive")) return "text-google-green";
        if (sentiment.includes("neutral") || sentiment.includes("mixed")) return "text-google-yellow";
        return "text-google-red";
    };

    return (
        <Card className="border-l-4 border-l-google-yellow/50 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-google-yellow/10">
                        <Heart className="w-5 h-5 text-google-yellow" />
                    </div>
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            Sentiment Analysis
                            <Sparkles className="w-4 h-4 text-google-yellow" />
                        </CardTitle>
                        <CardDescription className="text-xs">Member feedback and satisfaction insights</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!sentiment ? (
                    <Button onClick={analyze} disabled={isLoading} className="w-full bg-google-yellow hover:bg-google-yellow/90 text-black">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {isLoading ? "Analyzing..." : "Analyze Sentiment"}
                    </Button>
                ) : (
                    <div className="space-y-4">
                        {/* Overall Sentiment */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-google-yellow/10 to-google-green/10 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Member Satisfaction</p>
                            <div className="flex items-center justify-center gap-3">
                                <ThumbsUp className="w-8 h-8 text-google-green" />
                                <p className="text-4xl font-bold text-google-green">{sentiment.overall.score}%</p>
                                <Badge className="bg-google-green/10 text-google-green">{sentiment.overall.trend}</Badge>
                            </div>
                            <p className="text-sm mt-1 text-google-green font-medium">{sentiment.overall.label}</p>
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 rounded-lg bg-google-green/10 text-center">
                                <ThumbsUp className="w-4 h-4 mx-auto text-google-green" />
                                <p className="text-lg font-bold text-google-green">{sentiment.breakdown.positive}%</p>
                                <p className="text-[10px] text-muted-foreground">Positive</p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50 text-center">
                                <Minus className="w-4 h-4 mx-auto text-muted-foreground" />
                                <p className="text-lg font-bold">{sentiment.breakdown.neutral}%</p>
                                <p className="text-[10px] text-muted-foreground">Neutral</p>
                            </div>
                            <div className="p-2 rounded-lg bg-google-red/10 text-center">
                                <ThumbsDown className="w-4 h-4 mx-auto text-google-red" />
                                <p className="text-lg font-bold text-google-red">{sentiment.breakdown.negative}%</p>
                                <p className="text-[10px] text-muted-foreground">Negative</p>
                            </div>
                        </div>

                        {/* Topic Analysis */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Topic Analysis</h4>
                            {sentiment.topics.map((t: any, i: number) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                    <span className="text-sm">{t.topic}</span>
                                    <span className={cn("text-xs font-medium", getSentimentColor(t.sentiment))}>
                                        {t.sentiment}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setSentiment(null)} className="w-full">
                            Refresh Analysis
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// AI Budget Optimizer
export const AIBudgetOptimizer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [budget, setBudget] = useState<any>(null);

    const optimize = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1800));
        setBudget({
            currentUtilization: 72,
            projectedSavings: 15,
            costPredictions: [
                { event: "Annual Tech Conference", predicted: 45000, actual: null, confidence: 92 },
                { event: "Workshop Series (Q1)", predicted: 12000, actual: 11500, confidence: 88 },
                { event: "Hackathon 2024", predicted: 28000, actual: null, confidence: 85 }
            ],
            roiAnalysis: [
                { activity: "Flutter Bootcamp", cost: 8000, engagement: 120, roi: "+280%" },
                { activity: "Marketing Campaign", cost: 5000, engagement: 45, roi: "+85%" },
                { activity: "Team Building", cost: 3000, engagement: 65, roi: "+120%" }
            ],
            recommendations: [
                "Reduce venue costs by switching to virtual for smaller events",
                "Negotiate bulk discounts for refreshments",
                "Partner with sponsors for major events"
            ]
        });
        setIsLoading(false);
    };

    return (
        <Card className="border-l-4 border-l-google-red/50 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-google-red/10">
                        <DollarSign className="w-5 h-5 text-google-red" />
                    </div>
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            Budget Optimizer
                            <Sparkles className="w-4 h-4 text-google-yellow" />
                        </CardTitle>
                        <CardDescription className="text-xs">Cost predictions and ROI analysis</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!budget ? (
                    <Button onClick={optimize} disabled={isLoading} className="w-full bg-google-red hover:bg-google-red/90">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {isLoading ? "Optimizing..." : "Analyze Budget"}
                    </Button>
                ) : (
                    <div className="space-y-4">
                        {/* Utilization & Savings */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                                <p className="text-xs text-muted-foreground">Budget Utilized</p>
                                <p className="text-2xl font-bold">{budget.currentUtilization}%</p>
                            </div>
                            <div className="p-3 rounded-lg bg-google-green/10 text-center">
                                <p className="text-xs text-muted-foreground">Potential Savings</p>
                                <p className="text-2xl font-bold text-google-green">{budget.projectedSavings}%</p>
                            </div>
                        </div>

                        {/* Cost Predictions */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Cost Predictions</h4>
                            {budget.costPredictions.map((c: any, i: number) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{c.event}</p>
                                        <p className="text-xs text-muted-foreground">{c.confidence}% confidence</p>
                                    </div>
                                    <span className="text-sm font-bold">Rs. {c.predicted.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* ROI Analysis */}
                        <div className="p-3 rounded-lg bg-google-green/5 border border-google-green/20">
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-google-green" /> ROI Analysis
                            </h4>
                            {budget.roiAnalysis.map((r: any, i: number) => (
                                <div key={i} className="flex items-center justify-between py-1.5">
                                    <span className="text-sm">{r.activity}</span>
                                    <Badge className="bg-google-green/10 text-google-green">{r.roi}</Badge>
                                </div>
                            ))}
                        </div>

                        {/* AI Recommendations */}
                        <div className="p-3 rounded-lg bg-google-blue/5 border border-google-blue/20">
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 text-google-blue" /> Savings Tips
                            </h4>
                            <ul className="text-xs space-y-1 text-muted-foreground">
                                {budget.recommendations.map((r: string, i: number) => (
                                    <li key={i}>• {r}</li>
                                ))}
                            </ul>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setBudget(null)} className="w-full">
                            Refresh Analysis
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
