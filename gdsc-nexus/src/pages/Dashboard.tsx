import { API_BASE_URL } from '@/config/api';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User, Settings, BookOpen, Award, Calendar, MessageSquare,
    Video, Bell, ChevronRight, Trophy, Target, Clock, Shield, Zap
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import LeadDashboard from "./LeadDashboard";
import { usePageTitle } from "@/hooks/use-page-title";

interface Team {
    id: string;
    name: string;
    description: string;
}

interface TeamMember {
    teamId: string;
    team: Team;
    role: string;
}

interface Field {
    id: string;
    name: string;
    category: string;
    chats: { id: string; name: string }[];
    classes: { id: string; title: string; scheduledAt: string; meetingUrl?: string }[];
}

interface FieldMember {
    fieldId: string;
    field: Field;
}

interface AttendanceRecord {
    id: string;
    status: string;
    class?: { title: string };
    meeting?: { title: string };
    createdAt: string;
}

interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    role: string;
    status: string;
    teams: TeamMember[];
    fields: FieldMember[];
    attendance: AttendanceRecord[];
    stats: {
        events: number;
        courses: number;
        certificates: number;
        xp: number;
    };
}

import FacultyDashboard from "./FacultyDashboard";
import PresidentDashboard from "./PresidentDashboard";

const Dashboard = () => {
    usePageTitle("Dashboard");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const { data: user, isLoading, error } = useQuery({
        queryKey: ["user", "profile"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/users/profile?includeFields=true`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                throw new Error("Unauthorized");
            }
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json() as Promise<UserProfile>;
        },
        enabled: !!token
    });

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;

    if (error || !user) return <div className="flex h-screen items-center justify-center">Failed to load dashboard. <Button onClick={() => navigate("/login")}>Login</Button></div>;

    // Role-Based Routing
    if (user.role === 'FACULTY_HEAD') {
        return (
            <FacultyDashboard user={user} />
        );
    }

    if (user.role === 'PRESIDENT') {
        return (
            <PresidentDashboard user={user} />
        );
    }

    if (user.role === 'TEAM_LEAD' || user.role === 'CO_LEAD') {
        return (
            <LeadDashboard user={user} />
        );
    }

    // Redirect General Members and Guests to Chat
    if (user.role === 'GENERAL_MEMBER' || user.role === 'GUEST') {
        navigate('/chat');
        return null; // Or a simple "Redirecting..." message
    }

    return (
        <>
            {/* Premium Member Header & ID Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Welcome & Info */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                        <Avatar className="h-24 w-24 border-4 border-google-blue/20">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="text-2xl bg-google-blue text-white">{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-google-blue to-google-green bg-clip-text text-transparent">{user.fullName}</h1>
                                <Badge className="bg-google-green/10 text-google-green">{user.role.replace('_', ' ')}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{user.email}</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-google-blue/30 text-google-blue">Level {user.stats?.xp ? Math.floor(user.stats.xp / 500) + 1 : 1}</Badge>
                                <Badge variant="outline" className="border-google-yellow/30 text-google-yellow font-bold uppercase tracking-wider">{user.stats?.xp || 0} XP</Badge>
                            </div>
                        </div>
                    </div>

                    {/* 21: Society Pulse (Product Feature) */}
                    <div className="glass p-4 rounded-2xl border border-white/10 mb-6 bg-gradient-to-r from-google-blue/5 to-transparent">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-google-yellow" />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Society Pulse</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm">New learning track added in <b>Web Development</b> field. Check it out!</p>
                            <Button variant="ghost" size="sm" className="text-google-blue font-bold gap-1" onClick={() => navigate('/tenure/feedback')}>
                                Evaluate Your Lead <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Feature 22: Digital ID Card (Product Feature) */}
                <div className="relative group perspective-1000 h-[220px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-google-blue via-google-blue/80 to-blue-700 rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden border border-white/20">
                        {/* Card Patterns */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-12 -mb-12" />

                        <div className="relative p-5 h-full flex flex-col justify-between text-white">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white p-1.5 shadow-lg">
                                        <Shield className="w-full h-full text-google-blue" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest leading-none opacity-80">GOOGLE DEVELOPER</p>
                                        <p className="text-[10px] font-bold tracking-widest leading-none opacity-80 uppercase">STUDENT CLUBS</p>
                                    </div>
                                </div>
                                <Badge className="bg-white/20 text-white border-none text-[8px] font-bold">DIGITAL PASS</Badge>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-bold tracking-tight uppercase">{user.fullName}</p>
                                    <p className="text-[10px] opacity-70 mb-1">{user.role}</p>
                                    <p className="text-[10px] font-mono opacity-50">ID: GDSC-24-{user.id.slice(0, 5).toUpperCase()}</p>
                                </div>
                                {/* Fake QR for UI */}
                                <div className="w-16 h-16 bg-white rounded-lg p-1 group-hover:scale-110 transition-transform cursor-pointer">
                                    <div className="w-full h-full bg-[repeating-conic-gradient(#000_0_25%,#fff_0_50%)] bg-[length:4px_4px]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Reflection Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-2xl pointer-events-none" />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Courses', value: user.stats?.courses || 0, icon: BookOpen, color: 'bg-google-blue/10 text-google-blue' },
                    { label: 'Certificates', value: user.stats?.certificates || 0, icon: Award, color: 'bg-google-green/10 text-google-green' },
                    { label: 'Events', value: user.stats?.events || 0, icon: Calendar, color: 'bg-google-red/10 text-google-red' },
                    { label: 'XP Points', value: user.stats?.xp || 0, icon: Trophy, color: 'bg-google-yellow/10 text-google-yellow' },
                ].map((s, i) => (
                    <Card key={i} className="glass-card">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${s.color}`}>
                                    <s.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{s.value}</p>
                                    <p className="text-sm text-muted-foreground">{s.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="learning">Learning</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Field Groups & Chats */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>My Field Groups</CardTitle>
                                <CardDescription>Direct access to your department chats</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.fields && user.fields.length > 0 ? (
                                    user.fields.map((fm) => (
                                        <div key={fm.fieldId} className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">{fm.field.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Category: {fm.field.category}</p>
                                                </div>
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    {fm.field.chats?.map((chat) => (
                                                        <Button
                                                            key={chat.id}
                                                            variant="googleBlue"
                                                            size="sm"
                                                            className="flex-1 md:flex-none gap-2"
                                                            onClick={() => navigate(`/fields/${fm.fieldId}/chat`)}
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            {chat.name}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>You haven't been assigned to any fields yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upcoming Classes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Video className="h-5 w-5 text-google-red" />
                                    Upcoming Classes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.fields?.some(f => f.field.classes?.length > 0) ? (
                                    user.fields.flatMap(f => f.field.classes).map((cls) => (
                                        <div key={cls.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{cls.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(cls.scheduledAt), "MMM d, h:mm a")}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-8" onClick={() => cls.meetingUrl && window.open(cls.meetingUrl, '_blank')}>
                                                Join
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs text-muted-foreground italic">
                                        No upcoming classes scheduled.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admin/Lead Shortcut */}
                    {['PRESIDENT', 'TEAM_LEAD', 'CO_LEAD'].includes(user.role) && (
                        <Card className="bg-google-blue/5 border-google-blue/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-google-blue" />
                                    Admin Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">You have access to management tools.</p>
                                <div className="flex gap-2">
                                    <Button variant="googleBlue" size="sm" onClick={() => navigate('/admin')}>
                                        Go to Admin Console
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => navigate('/leadership/chats')}>
                                        Leadership Hub
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => navigate('/admin/teams')}>
                                        Manage Teams
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="learning">
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Your enrolled courses and learning tracks will appear here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity & Attendance</CardTitle>
                            <CardDescription>Your session history and attendance logs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.attendance && user.attendance.length > 0 ? (
                                <div className="space-y-4">
                                    {user.attendance.map((record) => (
                                        <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${record.status === 'PRESENT' ? 'bg-google-green' : 'bg-google-red'}`} />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {record.class?.title || record.meeting?.title || "Unknown Session"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(record.createdAt), "PPP")}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={record.status === 'PRESENT' ? 'outline' : 'destructive'} className="text-[10px] uppercase font-bold tracking-tight">
                                                {record.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No attendance records found yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certificates">
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Your earned certificates will appear here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Dashboard;
