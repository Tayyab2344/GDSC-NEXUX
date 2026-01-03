import { API_BASE_URL } from '@/config/api';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Users, Shield, Settings, Search, UserPlus, MoreVertical,
    ChevronUp, ChevronDown, TrendingUp, Calendar, MessageSquare, FileText,
    Brain, Sparkles, Wand2, FileSearch, BarChart3, PieChart as PieIcon,
    Layers, LayoutDashboard, Bell, Image, BookOpen, Fingerprint
} from "lucide-react";
import { InviteUserDialog } from "@/components/dashboard/InviteUserDialog";
import { AIInteractionDialog } from "@/components/dashboard/AIInteractionDialog";
import { SystemConfigDialog } from "@/components/dashboard/SystemConfigDialog";

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

const Admin = () => {
    usePageTitle("Admin Panel");
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog States
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [aiDialog, setAiDialog] = useState<{ open: boolean; task: 'summarize' | 'refine' | 'quiz' | 'resume' }>({
        open: false,
        task: 'refine'
    });

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/users/admin-stats`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.json();
        }
    });

    const { data: usersList } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.json();
        }
    });

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            "TEAM_LEAD": "bg-google-blue/10 text-google-blue",
            "CO_LEAD": "bg-google-green/10 text-google-green",
            "GENERAL_MEMBER": "bg-muted text-muted-foreground",
            "PRESIDENT": "bg-google-red/10 text-google-red",
            "FACULTY_HEAD": "bg-google-red/10 text-google-red"
        };
        return colors[role] || "bg-muted";
    };

    const getStatusBadge = (status: string) => {
        return status === "MEMBER" || status === "AUTHENTICATED"
            ? "bg-google-green/10 text-google-green"
            : "bg-google-yellow/10 text-google-yellow";
    };

    return (
        <DashboardLayout>
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-google-red/10 rounded-lg">
                            <Shield className="h-5 w-5 text-google-red" />
                        </div>
                        <Badge variant="outline" className="text-google-red border-google-red/20 font-medium tracking-wide">
                            EXECUTIVE PRO DASHBOARD
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-display font-bold tracking-tight bg-gradient-to-r from-google-blue via-google-red to-google-green bg-clip-text text-transparent">
                        GDSC Nexus Command Center
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Enterprise-grade society orchestration & analytics engine
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="hidden md:flex gap-2 border-slate-200 dark:border-slate-800"
                        onClick={() => setIsConfigOpen(true)}
                    >
                        <Settings className="h-4 w-4" />
                        System Config
                    </Button>
                    <Button
                        variant="google"
                        className="shadow-google-blue/20 shadow-lg group"
                        onClick={() => setIsInviteOpen(true)}
                    >
                        <UserPlus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Invite Executive
                    </Button>
                </div>
            </div>

            {/* Main Stats - 4 Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "Total Society Users", value: stats?.totalUsers, icon: Users, color: "google-blue", trend: "+12%" },
                    { label: "Active Fields & Teams", value: stats?.activeTeams, icon: Layers, color: "google-red" },
                    { label: "Events This Month", value: stats?.eventsThisMonth, icon: Calendar, color: "google-yellow" },
                    { label: "Messages (Last 24h)", value: stats?.messagesToday, icon: MessageSquare, color: "google-green" }
                ].map((stat, i) => (
                    <Card key={i} className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}`} />
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-${stat.color}/10 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                                </div>
                                {stat.trend && (
                                    <div className="flex items-center text-google-green text-sm font-semibold bg-google-green/10 px-2 py-1 rounded-full">
                                        <ChevronUp className="h-4 w-4 mr-0.5" />
                                        {stat.trend}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                            <p className="text-4xl font-bold font-display leading-none">
                                {statsLoading ? "..." : stat.value || 0}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="analytics" className="space-y-8">
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 sticky top-20 z-10 shadow-sm overflow-x-auto">
                    <TabsList className="bg-transparent gap-2 h-12">
                        {[
                            { value: "analytics", label: "Analytics & Growth", icon: BarChart3 },
                            { value: "users", label: "Identity & Roles", icon: Fingerprint },
                            { value: "ai-tools", label: "AI Intelligence", icon: Brain },
                            { value: "content", label: "Content Mgmt", icon: LayoutDashboard },
                            { value: "system", label: "System Matrix", icon: Settings }
                        ].map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl px-5 h-9 font-medium transition-all"
                            >
                                <tab.icon className="h-4 w-4 mr-2" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* tab: Analytics */}
                <TabsContent value="analytics" className="space-y-6 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-google-blue" />
                                    Society Growth Matrix
                                </CardTitle>
                                <CardDescription>Visualizing member registrations over time</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] pt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.growth || []}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748B' }}
                                            tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short' })}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#4285F4" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <PieIcon className="h-5 w-5 text-google-red" />
                                    Field Influence Distribution
                                </CardTitle>
                                <CardDescription>Member breakdown across society departments</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] pt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats?.fieldDistribution || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats?.fieldDistribution?.map((_: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={GOOGLE_COLORS[index % GOOGLE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* tab: Users */}
                <TabsContent value="users" className="space-y-6 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {[
                            { title: "Memberships", desc: "Review 15 pending applications", icon: UserPlus, link: "/admin/memberships", color: "google-blue" },
                            { title: "Lead Oversight", desc: "Monitor 24 team leads", icon: Shield, link: "/admin/teams", color: "google-red" },
                            { title: "Automated IDs", desc: "Sequence current: GDSC-045", icon: Fingerprint, link: "#", color: "google-yellow" }
                        ].map((feat, i) => (
                            <Link key={i} to={feat.link}>
                                <Card className="h-full hover:border-google-blue/50 transition-all group hover:-translate-y-1 cursor-pointer">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-xl bg-${feat.color}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                            <feat.icon className={`h-6 w-6 text-${feat.color}`} />
                                        </div>
                                        <CardTitle className="group-hover:text-google-blue transition-colors">{feat.title}</CardTitle>
                                        <CardDescription>{feat.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Society Identity Engine</CardTitle>
                                <CardDescription>Global registry of all authenticated society members</CardDescription>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by name, email or ID..."
                                        className="pl-9 h-10 rounded-xl"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-40 rounded-xl">
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="PRESIDENT">President</SelectItem>
                                        <SelectItem value="TEAM_LEAD">Team Leads</SelectItem>
                                        <SelectItem value="GENERAL_MEMBER">Members</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent">
                                        <TableHead className="font-bold">Identity</TableHead>
                                        <TableHead className="font-bold">Operational Role</TableHead>
                                        <TableHead className="font-bold">Affiliation</TableHead>
                                        <TableHead className="font-bold">Verification</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usersList?.map((user: any) => (
                                        <TableRow key={user.id} className="hover:bg-slate-50/10 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                                        <AvatarFallback className="bg-google-blue/10 text-google-blue text-xs font-bold">
                                                            {user.fullName ? user.fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('') : 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900 dark:text-slate-100">{user.fullName}</span>
                                                        <span className="text-xs text-slate-500">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`${getRoleBadge(user.role)} rounded-md font-medium text-[10px] uppercase tracking-wider`}>
                                                    {user.role.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.fields?.length > 0
                                                        ? user.fields.map((f: any, i: number) => (
                                                            <Badge key={i} variant="outline" className="text-[10px]">{f.field.name}</Badge>
                                                        ))
                                                        : <span className="text-xs text-slate-400 italic">No assigned field</span>
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusBadge(user.status)} rounded-full`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* tab: AI Tools */}
                <TabsContent value="ai-tools" className="space-y-6 outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "AI Summarizer", desc: "Distill bulk registrations into top trends", icon: Sparkles, color: "google-blue", task: 'summarize' },
                            { title: "AI Refiner", desc: "Optimize announcements for engagement", icon: Wand2, color: "google-red", task: 'refine' },
                            { title: "AI Quiz Maker", desc: "Generate technical assessment labs", icon: Brain, color: "google-yellow", task: 'quiz' },
                            { title: "AI Resume Pro", desc: "Field-specific candidate screening", icon: FileSearch, color: "google-green", task: 'resume' }
                        ].map((tool, i) => (
                            <Card key={i} className="group hover:-translate-y-1 transition-all border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-sm hover:shadow-lg">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-xl bg-${tool.color}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                        <tool.icon className={`h-6 w-6 text-${tool.color}`} />
                                    </div>
                                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                                    <CardDescription>{tool.desc}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="link"
                                        className="p-0 text-google-blue font-semibold flex items-center gap-1 group/btn"
                                        onClick={() => setAiDialog({ open: true, task: tool.task as any })}
                                    >
                                        Launch AI Model
                                        <ChevronUp className="h-4 w-4 rotate-90 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* tab: Content */}
                <TabsContent value="content" className="space-y-6 outline-none">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                        {[
                            { label: "Form Builder", icon: FileText, color: "google-blue" },
                            { label: "Events CMS", icon: Calendar, color: "google-red" },
                            { label: "Announcements", icon: MessageSquare, color: "google-yellow" },
                            { label: "Gallery Highlights", icon: Image, color: "google-green" },
                            { label: "Workshops/Classes", icon: BookOpen, color: "indigo" }
                        ].map((item, i) => (
                            <Card key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer border-slate-200 dark:border-slate-800">
                                <CardContent className="pt-6">
                                    <div className={`w-12 h-12 rounded-full bg-${item.color}/10 mx-auto flex items-center justify-center mb-3`}>
                                        <item.icon className={`h-6 w-6 text-${item.color}`} />
                                    </div>
                                    <p className="font-semibold text-sm">{item.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* tab: System */}
                <TabsContent value="system" className="space-y-6 outline-none">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card
                            className="border-google-yellow/20 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setIsConfigOpen(true)}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-google-yellow" />
                                    Global Configuration Matrix
                                </CardTitle>
                                <CardDescription>System-wide variables and switchboard</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                    <div>
                                        <p className="font-bold">Public Recruitment</p>
                                        <p className="text-xs text-muted-foreground">Allow new society applications</p>
                                    </div>
                                    <Badge className="bg-google-green text-white">ACTIVE</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                    <div>
                                        <p className="font-bold">Lead Applications</p>
                                        <p className="text-xs text-muted-foreground">Open recruitment for field leads</p>
                                    </div>
                                    <Badge variant="outline">CLOSED</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-google-blue/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-google-blue" />
                                    Notification Engine Logs
                                </CardTitle>
                                <CardDescription>Real-time society communication status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-3 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0">
                                            <div className="w-2 h-2 rounded-full bg-google-blue mt-1.5" />
                                            <div>
                                                <p className="font-medium">Direct Broadcast Sent</p>
                                                <p className="text-xs text-muted-foreground italic">Target: All Members • 12:45 PM Today</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <InviteUserDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />
            <SystemConfigDialog open={isConfigOpen} onOpenChange={setIsConfigOpen} />
            <AIInteractionDialog
                open={aiDialog.open}
                onOpenChange={(open) => setAiDialog({ ...aiDialog, open })}
                task={aiDialog.task}
            />
        </DashboardLayout>
    );
};

export default Admin;
