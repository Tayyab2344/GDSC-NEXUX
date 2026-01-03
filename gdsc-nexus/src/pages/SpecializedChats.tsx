import React, { useState } from 'react';
import {
    Users, Shield, MessageSquare, Lock,
    Search, Pin, Bell, MoreVertical,
    Send, Image as ImageIcon, Smile, Mic,
    Coffee, GraduationCap, Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SpecializedChats = ({ user }: { user: any }) => {
    const [activeGroup, setActiveGroup] = useState('CORE_GROUP');

    const groups = [
        { id: 'FACULTY_CIRCLE', name: 'Faculty Circle', icon: GraduationCap, color: 'text-google-red', desc: 'Faculty + President + Core Leads' },
        { id: 'CORE_GROUP', name: 'Core Group', icon: Crown, color: 'text-google-blue', desc: 'President + Team Leads' },
        { id: 'LEADS_LOUNGE', name: 'Leads Lounge', icon: Coffee, color: 'text-google-yellow', desc: 'Informal Lead Discussions' },
    ];

    const mockMessages = [
        { sender: 'Prof. Ahmed', content: 'The semester results are looking promising. Great job team!', time: '10:30 AM', role: 'FACULTY_HEAD' },
        { sender: 'President Zaid', content: 'Thank you Prof! AI/ML field has particularly shown 40% growth.', time: '10:32 AM', role: 'PRESIDENT' },
        { sender: 'Sarah (Web Lead)', content: 'We just finished the React workshop planning.', time: '11:05 AM', role: 'TEAM_LEAD' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-24">
                <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-180px)] min-h-[600px]">

                    {/* Sidebar: Group List */}
                    <Card className="glass-card lg:col-span-1 overflow-hidden flex flex-col">
                        <CardHeader className="p-4 border-b">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-google-blue" /> Leadership Hub
                            </CardTitle>
                        </CardHeader>
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-2">
                                {groups.map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => setActiveGroup(g.id)}
                                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${activeGroup === g.id
                                                ? 'bg-google-blue/10 border border-google-blue/20'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-white/5 ${g.color}`}>
                                                <g.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold text-sm truncate ${activeGroup === g.id ? 'text-google-blue' : ''}`}>{g.name}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{g.desc}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>

                    {/* Chat Interface */}
                    <Card className="lg:col-span-3 glass-card overflow-hidden flex flex-col relative">
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between glass">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-2xl bg-google-blue/10 text-google-blue">
                                    {groups.find(g => g.id === activeGroup)?.icon({ className: "w-6 h-6" })}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{groups.find(g => g.id === activeGroup)?.name}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
                                        <span className="text-xs text-muted-foreground">8 members active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full"><Search className="w-5 h-5" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-8">
                                {mockMessages.map((msg, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <Avatar className="h-10 w-10 border-2 border-google-blue/20 shadow-lg">
                                            <AvatarFallback className="bg-google-blue/10 text-google-blue font-bold">{msg.sender[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm tracking-tight">{msg.sender}</span>
                                                <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest scale-90 origin-left border-google-blue/30 text-google-blue">
                                                    {msg.role}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity">{msg.time}</span>
                                            </div>
                                            <div className="p-4 rounded-3xl rounded-tl-none bg-white/5 border border-white/5 backdrop-blur-md">
                                                <p className="text-sm leading-relaxed text-foreground/90">{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input Bar */}
                        <div className="p-6 border-t glass">
                            <div className="flex items-center gap-4 bg-background/50 border border-white/10 p-2 pl-4 rounded-[2rem] shadow-inner">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10"><ImageIcon className="w-5 h-5 text-muted-foreground" /></Button>
                                <Input
                                    placeholder="Type a proposal..."
                                    className="border-none bg-transparent focus-visible:ring-0 text-sm h-12"
                                />
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10"><Smile className="w-5 h-5 text-muted-foreground" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10"><Mic className="w-5 h-5 text-muted-foreground" /></Button>
                                <Button className="rounded-full h-12 w-12 bg-google-blue hover:shadow-glow-blue transition-all">
                                    <Send className="w-5 h-5 text-white" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SpecializedChats;
