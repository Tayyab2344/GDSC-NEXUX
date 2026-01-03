import { API_BASE_URL } from '@/config/api';
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users, MessageCircle, Calendar, Bell, ChevronRight, Code,
    Smartphone, Brain, Gamepad2, Settings, Shield
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const teamIcons: Record<string, any> = {
    web: Code,
    mobile: Smartphone,
    ai: Brain,
    game: Gamepad2,
};

interface TeamMember {
    userId: string;
    role: string;
    user: {
        id: string;
        fullName: string;
        avatarUrl: string;
    };
}

interface TeamField {
    id: string;
    name: string;
}

interface Team {
    id: string;
    name: string;
    description: string;
    members: TeamMember[];
    fields: TeamField[];
    announcements?: any[];
}

const TeamDetail = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const { data: currentUser } = useQuery({
        queryKey: ["user", "profile"],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) return null;
            return res.json();
        },
        enabled: !!token
    });

    const { data: team, isLoading } = useQuery({
        queryKey: ["team", teamId],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/teams/${teamId}`);
            if (!res.ok) throw new Error("Failed to fetch team");
            return res.json() as Promise<Team>;
        }
    });

    const joinMutation = useMutation({
        mutationFn: async () => {
            if (!currentUser) throw new Error("Must be logged in");
            const res = await fetch(`${API_BASE_URL}/teams/${teamId}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId: currentUser.id })
            });
            if (!res.ok) throw new Error("Failed to join team");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Joined team successfully!");
            queryClient.invalidateQueries({ queryKey: ["team", teamId] });
            queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        },
        onError: () => {
            toast.error("Failed to join team. You may already be a member.");
        }
    });

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading team...</div>;
    if (!team) return <div className="flex h-screen items-center justify-center">Team not found</div>;

    const IconComponent = teamIcons[team.name.toLowerCase().includes('web') ? 'web' : 'code'] || Code;
    const isMember = team.members?.some(m => m.user.id === currentUser?.id);
    const isLead = team.members?.some(m => m.user.id === currentUser?.id && ['TEAM_LEAD', 'CO_LEAD'].includes(m.role));

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-2xl bg-google-blue/10 flex items-center justify-center`}>
                                <IconComponent className={`w-8 h-8 text-google-blue`} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{team.name}</h1>
                                <p className="text-muted-foreground">{team.members?.length || 0} members</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground max-w-3xl">{team.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                        <Link to={`/teams/${teamId}/chat`}>
                            <Button variant="googleBlue" className="gap-2">
                                <MessageCircle className="w-4 h-4" />
                                Team Chat
                            </Button>
                        </Link>
                        <Link to="/meetings">
                            <Button variant="outline" className="gap-2">
                                <Calendar className="w-4 h-4" />
                                Meetings
                            </Button>
                        </Link>
                        {!isMember ? (
                            <Button variant="outline" className="gap-2" onClick={() => joinMutation.mutate()} disabled={joinMutation.isPending}>
                                <Users className="w-4 h-4" />
                                {joinMutation.isPending ? 'Joining...' : 'Join Team'}
                            </Button>
                        ) : (
                            <Button variant="secondary" className="gap-2" disabled>
                                <Users className="w-4 h-4" />
                                Member
                            </Button>
                        )}

                        {isLead && (
                            <Button variant="destructive" className="gap-2 bg-google-red hover:bg-google-red/90 text-white" onClick={() => navigate(`/admin/teams?teamId=${teamId}`)}>
                                <Settings className="w-4 h-4" />
                                Manage Team
                            </Button>
                        )}
                    </div>

                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            {isLead && <TabsTrigger value="management">Management</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Code className="w-5 h-5" />
                                                Fields & Specializations
                                            </CardTitle>
                                            <CardDescription>Choose a field to specialize in</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {team.fields?.map((field) => (
                                                <Link
                                                    key={field.id}
                                                    to={`/teams/${teamId}/fields/${field.id}`}
                                                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                                                >
                                                    <div>
                                                        <h4 className="font-medium text-foreground group-hover:text-google-blue transition-colors">
                                                            {field.name}
                                                        </h4>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-google-blue transition-colors" />
                                                </Link>
                                            ))}
                                            {team.fields?.length === 0 && <p className="text-muted-foreground p-4">No fields defined yet.</p>}
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Bell className="w-5 h-5" />
                                                Team Announcements
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                                <h4 className="font-medium text-foreground">Welcome to the team!</h4>
                                                <p className="text-sm text-muted-foreground">Check out the fields and join a chat.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Team Members</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                                            {team.members?.map((member, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={member.user.avatarUrl} />
                                                        <AvatarFallback className="bg-google-blue/10 text-google-blue">
                                                            {member.user.fullName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-foreground">{member.user.fullName}</p>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {member.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {isLead && (
                            <TabsContent value="management">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-google-red" />
                                            Team Management
                                        </CardTitle>
                                        <CardDescription>
                                            As a Team Lead, you can manage fields, members, and settings.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate(`/teams/${teamId}/fields/manage`)}>
                                                <Code className="w-6 h-6 mb-2" />
                                                <span>Manage Fields</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TeamDetail;
