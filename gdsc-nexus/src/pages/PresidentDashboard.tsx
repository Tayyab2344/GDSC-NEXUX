import React from 'react';
import {
    BarChart3, PieChart as PieChartIcon, Activity, TrendingUp,
    Award, Zap, Shield, Grid, FileText, Search,
    Bell, Calendar, Users, Target, Rocket, Briefcase,
    Layers, Globe, LifeBuoy, Fingerprint, Brain, Sparkles
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AISocietyHealth, AIStrategicRecommendations, AISentimentAnalysis, AIBudgetOptimizer } from "@/components/dashboard/AIPresidentFeatures";

const PresidentDashboard = ({ user }: { user: any }) => {
    // Stats and data
    const weeklyEngagement = [
        { day: 'Mon', engagement: 65, active: 40 },
        { day: 'Tue', engagement: 59, active: 35 },
        { day: 'Wed', engagement: 80, active: 55 },
        { day: 'Thu', engagement: 81, active: 60 },
        { day: 'Fri', engagement: 56, active: 45 },
        { day: 'Sat', engagement: 40, active: 20 },
        { day: 'Sun', engagement: 45, active: 25 },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-google-blue/20 via-google-red/10 to-transparent p-8 border border-white/10 glass">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Badge variant="outline" className="mb-4 bg-google-blue/10 text-google-blue border-google-blue/20">
                            PRESIDENT DASHBOARD
                        </Badge>
                        <h1 className="text-5xl font-extrabold tracking-tighter">
                            The Society Horizon
                        </h1>
                        <p className="text-muted-foreground mt-2 text-xl max-w-2xl">
                            Hello, {user.fullName}. Leading the next generation of developers.
                            Today is a great day to innovate.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { icon: Rocket, label: '1: Society Sprint', color: 'bg-google-blue' },
                            { icon: Target, label: '2: Goal Tracker', color: 'bg-google-green' },
                            { icon: Fingerprint, label: '3: ID Verification', color: 'bg-google-yellow' }
                        ].map((btn, i) => (
                            <Button key={i} className={`${btn.color} hover:opacity-90 shadow-lg`}>
                                <btn.icon className="w-4 h-4 mr-2" /> {btn.label}
                            </Button>
                        ))}
                    </div>
                </div>
                {/* Background Decorative Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-google-blue/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
            </div>

            {/* 20 Features Layout Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 4: Global Society Health */}
                <Card className="glass-card md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="text-google-green" /> 4: Society Health & Engagement
                        </CardTitle>
                        <CardDescription>Real-time activity metrics across all fields</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyEngagement}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '16px' }}
                                />
                                <Bar dataKey="engagement" fill="#4285F4" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="active" fill="#34A853" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 5: Recent Lead Milestones */}
                <Card className="glass-card border-none bg-gradient-to-b from-google-yellow/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="text-lg">5: Lead Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { lead: 'Alex', field: 'AI/ML', action: '6: Launched Quiz', time: '2h ago' },
                            { lead: 'Sarah', field: 'Web', action: '7: Shared Track', time: '5h ago' },
                            { lead: 'Mike', field: 'App', action: '8: New Project', time: '1d ago' },
                        ].map((m, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all">
                                <Avatar className="h-10 w-10 border-2 border-google-blue">
                                    <AvatarFallback>{m.lead[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold">{m.lead} <span className="text-xs font-normal text-muted-foreground">({m.field})</span></p>
                                    <p className="text-xs text-muted-foreground">{m.action}</p>
                                </div>
                                <span className="ml-auto text-[10px] text-muted-foreground">{m.time}</span>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-xs hover:bg-white/5">9: View All Field Activity →</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Command Grid (Features 10-20) */}
            <h2 className="text-2xl font-bold tracking-tight px-2">Presidential Command Center</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: '10: Team Lead Hub', icon: Users, color: 'text-google-blue', bg: 'bg-google-blue' },
                    { label: '11: Recruitment Brief', icon: Briefcase, color: 'text-google-green', bg: 'bg-google-green' },
                    { label: '12: Budget Approvals', icon: BarChart3, color: 'text-google-red', bg: 'bg-google-red' },
                    { label: '13: Partnership CRM', icon: Globe, color: 'text-google-yellow', bg: 'bg-google-yellow' },
                    { label: '14: Policy Editor', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500' },
                    { label: '15: Alumni Network', icon: Layers, color: 'text-indigo-500', bg: 'bg-indigo-500' },
                    { label: '16: Society Pulse', icon: Activity, color: 'text-pink-500', bg: 'bg-pink-500' },
                    { label: '17: Event Master', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500' },
                    { label: '18: Gallery Admin', icon: Grid, color: 'text-teal-500', bg: 'bg-teal-500' },
                    { label: '19: Broadcast Tool', icon: Bell, color: 'text-sky-500', bg: 'bg-sky-500' },
                    { label: '20: Support Desk', icon: LifeBuoy, color: 'text-slate-400', bg: 'bg-slate-400' },
                ].map((item, i) => (
                    <Card key={i} className="glass-card hover:bg-white/10 cursor-pointer group transition-all duration-500 hover:-translate-y-2">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className={`p-4 rounded-3xl ${item.bg}/10 ${item.color} mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight">{item.label}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* AI Intelligence Hub */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-google-blue/20 via-google-green/20 to-google-yellow/20">
                        <Brain className="w-8 h-8 text-google-blue" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            AI Intelligence Hub
                            <Sparkles className="w-5 h-5 text-google-yellow" />
                        </h2>
                        <p className="text-muted-foreground">AI-powered insights for strategic decision making</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <AISocietyHealth />
                    <AIStrategicRecommendations />
                    <AISentimentAnalysis />
                    <AIBudgetOptimizer />
                </div>
            </div>

            {/* Feature 21: Society Pulse (AI Summary) */}
            <Card className="glass-card overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-google-yellow" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="text-google-yellow" /> Society Pulse (AI Enhanced)
                    </CardTitle>
                    <CardDescription>Generated based on last 30 days of activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 italic text-muted-foreground relative">
                        "Our society is currently performing at peak levels. **Field engagement is up 24%**, primarily driven by Web and AI fields. Recruitment is on track with 85% of positions filled. Recommended action: 12: Review Budget for Upcoming Workshop."
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default PresidentDashboard;
