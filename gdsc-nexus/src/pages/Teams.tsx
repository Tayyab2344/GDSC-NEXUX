import { API_BASE_URL } from '@/config/api';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Code, Smartphone, Brain, Gamepad2, Settings, Megaphone, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";

const teams = [
    {
        id: "web",
        name: "Web Development",
        icon: Code,
        color: "google-blue",
        lead: "Sarah Johnson",
        coLead: "Mike Chen",
        members: 45,
        description: "Building modern web applications with React, Next.js, and cutting-edge technologies.",
        skills: ["React", "Next.js", "TypeScript", "Node.js", "TailwindCSS"],
        projects: 12,
        meetings: "Every Tuesday, 6 PM"
    },
    {
        id: "mobile",
        name: "Mobile Development",
        icon: Smartphone,
        color: "google-green",
        lead: "Alex Rivera",
        coLead: "Priya Patel",
        members: 38,
        description: "Creating cross-platform mobile experiences with Flutter and React Native.",
        skills: ["Flutter", "React Native", "Kotlin", "Swift", "Firebase"],
        projects: 8,
        meetings: "Every Wednesday, 5 PM"
    },
    {
        id: "ai",
        name: "AI/ML",
        icon: Brain,
        color: "google-red",
        lead: "David Kim",
        coLead: "Emma Wilson",
        members: 32,
        description: "Exploring machine learning, deep learning, and artificial intelligence applications.",
        skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "OpenAI"],
        projects: 15,
        meetings: "Every Thursday, 7 PM"
    },
    {
        id: "game",
        name: "Game Development",
        icon: Gamepad2,
        color: "google-yellow",
        lead: "Chris Lee",
        coLead: "Nina Garcia",
        members: 28,
        description: "Designing and developing interactive games using Unity and Unreal Engine.",
        skills: ["Unity", "Unreal Engine", "C#", "Blender", "Game Design"],
        projects: 6,
        meetings: "Every Friday, 4 PM"
    },
    {
        id: "core",
        name: "Core Team",
        icon: Settings,
        color: "google-blue",
        lead: "Jordan Taylor",
        coLead: "Sam Martinez",
        members: 15,
        description: "Managing operations, coordinating events, and ensuring smooth functioning of all teams.",
        skills: ["Leadership", "Project Management", "Communication", "Planning"],
        projects: 20,
        meetings: "Every Monday, 5 PM"
    },
    {
        id: "marketing",
        name: "Marketing",
        icon: Megaphone,
        color: "google-green",
        lead: "Ashley Brown",
        coLead: "Ryan Davis",
        members: 22,
        description: "Promoting events, managing social media, and building community engagement.",
        skills: ["Social Media", "Content Creation", "Graphic Design", "SEO", "Analytics"],
        projects: 10,
        meetings: "Every Monday, 6 PM"
    },
    {
        id: "management",
        name: "Management",
        icon: TrendingUp,
        color: "google-red",
        lead: "Faculty Advisor",
        coLead: "President",
        members: 8,
        description: "Strategic planning, resource allocation, and overall society governance.",
        skills: ["Strategy", "Finance", "HR", "Operations", "Partnerships"],
        projects: 5,
        meetings: "Bi-weekly, Saturday 10 AM"
    }
];

const Teams = () => {
    usePageTitle("Teams");
    const { data: recruitmentForm } = useQuery({
        queryKey: ['form', 'recruitment'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/forms/public/recruitment`);
            if (!res.ok) return null;
            return res.json();
        },
        retry: false
    });

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            "google-blue": "bg-google-blue",
            "google-green": "bg-google-green",
            "google-red": "bg-google-red",
            "google-yellow": "bg-google-yellow"
        };
        return colors[color] || "bg-google-blue";
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <section className="py-20 px-4 bg-gradient-to-br from-google-blue/10 via-background to-google-green/10">
                    <div className="container mx-auto text-center">
                        <Badge className="mb-4 bg-google-blue/10 text-google-blue border-google-blue/20">
                            Our Teams
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                            Join a Team, Build the Future
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Each team focuses on a specific domain, offering hands-on experience,
                            mentorship, and collaborative projects.
                        </p>
                        {recruitmentForm && (
                            <Link to="/forms/recruitment">
                                <Button variant="google" size="lg">
                                    Apply to Join
                                </Button>
                            </Link>
                        )}
                    </div>
                </section>

                <section className="py-16 px-4">
                    <div className="container mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teams.map((team) => (
                                <Card key={team.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-google-blue/30">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className={`p-3 rounded-xl ${getColorClass(team.color)} text-white`}>
                                                <team.icon className="h-6 w-6" />
                                            </div>
                                            <Badge variant="secondary">{team.members} members</Badge>
                                        </div>
                                        <CardTitle className="text-xl mt-4">{team.name}</CardTitle>
                                        <CardDescription>{team.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-foreground mb-1">Leadership</p>
                                            <p className="text-sm text-muted-foreground">
                                                Lead: {team.lead} • Co-Lead: {team.coLead}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground mb-2">Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {team.skills.slice(0, 4).map((skill) => (
                                                    <Badge key={skill} variant="outline" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {team.skills.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{team.skills.length - 4}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>{team.projects} projects</span>
                                            <span>{team.meetings}</span>
                                        </div>
                                        <Button variant="outline" className="w-full group-hover:bg-google-blue group-hover:text-white transition-colors">
                                            View Team
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4 bg-muted/50">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl font-display font-bold mb-4">Ready to Make an Impact?</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            Join one of our teams and start building real projects, learning new skills,
                            and connecting with like-minded developers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {recruitmentForm && (
                                <Link to="/forms/recruitment">
                                    <Button variant="google" size="lg">
                                        <Users className="mr-2 h-5 w-5" />
                                        Apply Now
                                    </Button>
                                </Link>
                            )}
                            <Button variant="outline" size="lg">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Teams;
