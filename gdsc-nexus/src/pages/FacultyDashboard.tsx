import React from 'react';
import {
    Users, TrendingUp, Grid, FileText, Shield,
    Settings, Bell, Calendar, Award, Zap,
    BarChart3, PieChart as PieChartIcon, Activity,
    Search, Download, Plus, Filter, MoreHorizontal
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];

const FacultyDashboard = ({ user }: { user: any }) => {
    // Mock Data for Viz (Real data would come from UsersService.getExecutiveStats)
    const growthData = [
        { month: 'Jan', members: 400 },
        { month: 'Feb', members: 600 },
        { month: 'Mar', members: 800 },
        { month: 'Apr', members: 1200 },
        { month: 'May', members: 1900 },
        { month: 'Jun', members: 2400 },
    ];

    const fieldData = [
        { name: 'Web Dev', value: 400 },
        { name: 'App Dev', value: 300 },
        { name: 'AI/ML', value: 300 },
        { name: 'Marketing', value: 200 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-google-blue via-google-green to-google-red bg-clip-text text-transparent">
                        Executive Control
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Welcome back, Prof. {user.fullName.split(' ')[0]}. Here is the society pulse.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="glass hover:bg-white/10">
                        <Download className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                    <Button className="bg-gradient-to-r from-google-blue to-google-blue/80 hover:shadow-glow transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Global Update
                    </Button>
                </div>
            </div>

            {/* 20+ Features Grid starts here - Organized by Executive Modules */}

            {/* Module 1: High-Level Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Members', value: '2.4k', icon: Users, color: 'text-google-blue', trend: '+12%', desc: '1: Membership tracking' },
                    { label: 'Active Fields', value: '12', icon: Grid, color: 'text-google-green', trend: 'Full capacity', desc: '2: Field oversight' },
                    { label: 'Upcoming Events', value: '8', icon: Calendar, color: 'text-google-red', trend: 'This month', desc: '3: Event governance' },
                    { label: 'Global XP', value: '124k', icon: Zap, color: 'text-google-yellow', trend: '+18%', desc: '4: Engagement metrics' },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-none">{stat.trend}</Badge>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Module 2: Visualization Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feature 5: Growth Analytics */}
                <Card className="lg:col-span-2 glass-card">
                    <CardHeader>
                        <CardTitle>Member Growth Curve</CardTitle>
                        <CardDescription>Visual trend of sign-ups over 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="members" stroke="#4285F4" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Feature 6: Field Distribution */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Field Activity</CardTitle>
                        <CardDescription>Member distribution by field</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={fieldData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {fieldData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Module 3: Society Governance (Features 7-14) */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Feature 7: AI Recruitment Brief */}
                <Card className="glass-card border-l-4 border-l-google-blue">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recruitment Brief (AI)</CardTitle>
                            <CardDescription>Smart summaries of pending applications</CardDescription>
                        </div>
                        <Badge className="bg-google-blue">New</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <p className="text-sm italic">"AI Analysis: We have 45 new applicants. Top skills identified: Flutter, Cloud Architecture, and UI/UX Design. Recommend reviewing 12 candidates immediately."</p>
                            </div>
                            <Button variant="link" className="text-google-blue p-0 h-auto">8: Open Recruitment Console →</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Feature 9: Tenure Feedback Hub */}
                <Card className="glass-card border-l-4 border-l-google-red">
                    <CardHeader>
                        <CardTitle>Tenure Feedback Hub</CardTitle>
                        <CardDescription>Anonymous evaluations of Team Leads</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-google-red/5 border border-google-red/10">
                            <Shield className="w-8 h-8 text-google-red" />
                            <div>
                                <p className="font-medium">10: Anonymous Review Portal</p>
                                <p className="text-xs text-muted-foreground">Detailed responses are only viewable by you and the President.</p>
                            </div>
                            <Button size="sm" variant="destructive" className="ml-auto">11: Review All</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Features 12-20: Management Controls & Quick Links */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Executive Tools & Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[
                            { icon: Grid, label: '12: Team Setup', color: 'bg-blue-500/10 text-blue-500' },
                            { icon: Shield, label: '13: Permissions', color: 'bg-purple-500/10 text-purple-500' },
                            { icon: FileText, label: '14: Audit Logs', color: 'bg-green-500/10 text-green-500' },
                            { icon: Users, label: '15: Alumni Hub', color: 'bg-orange-500/10 text-orange-500' },
                            { icon: BarChart3, label: '16: Budget Prep', color: 'bg-red-500/10 text-red-500' },
                            { icon: Activity, label: '17: System Health', color: 'bg-yellow-500/10 text-yellow-500' },
                            { icon: Search, label: '18: ID Scans', color: 'bg-slate-500/10 text-slate-500' },
                            { icon: Bell, label: '19: Broadcasts', color: 'bg-pink-500/10 text-pink-500' },
                            { icon: Settings, label: '20: Society Pulse', color: 'bg-indigo-500/10 text-indigo-500' },
                        ].map((tool, i) => (
                            <button key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                                <div className={`p-4 rounded-2xl ${tool.color} group-hover:scale-110 transition-transform shadow-lg`}>
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-center">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyDashboard;
