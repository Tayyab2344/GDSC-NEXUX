import React, { useState } from 'react';
import {
    ShieldCheck, HelpCircle, Star, MessageCircle,
    Send, AlertCircle, CheckCircle2, UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TenureFeedback = () => {
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState('5');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate submission
        toast.success("Feedback submitted anonymously!");
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full glass-card text-center p-8 space-y-6">
                        <div className="w-20 h-20 bg-google-green/10 text-google-green rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Thank You!</h1>
                            <p className="text-muted-foreground mt-2">Your anonymous feedback has been safely recorded. It will help us build a better society.</p>
                        </div>
                        <Button className="w-full bg-google-blue" onClick={() => window.location.href = '/dashboard'}>Return to Dashboard</Button>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-24 max-w-3xl">
                <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-google-red/10 text-google-red">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Tenure Performance Review</h1>
                            <p className="text-muted-foreground">Your voice matters. This form is 100% anonymous.</p>
                        </div>
                    </div>

                    <Card className="bg-google-blue/10 border-google-blue/20 text-google-blue">
                        <CardContent className="p-4 flex gap-3 text-sm font-medium">
                            <UserCheck className="w-5 h-5 flex-shrink-0" />
                            <span>Evaluating: <b>Marketing Lead (Sarah Jenkins)</b> for the Fall 2024 Tenure.</span>
                        </CardContent>
                    </Card>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating Section */}
                    <Card className="glass-card overflow-hidden">
                        <div className="h-2 bg-google-yellow w-full" />
                        <CardHeader>
                            <CardTitle className="text-xl">1. Overall Leadership Rating</CardTitle>
                            <CardDescription>How would you rate the general management and behavior of your lead?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup defaultValue="5" className="flex justify-between max-w-sm mx-auto" onValueChange={setRating}>
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <div key={val} className="flex flex-col items-center gap-2">
                                        <RadioGroupItem value={val.toString()} id={`r${val}`} className="peer sr-only" />
                                        <Label
                                            htmlFor={`r${val}`}
                                            className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all 
                          peer-data-[state=checked]:bg-google-yellow peer-data-[state=checked]:border-google-yellow peer-data-[state=checked]:text-white
                          hover:bg-white/5 active:scale-95 text-lg font-bold"
                                        >
                                            {val}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Written Feedback Section */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-xl">2. Detailed Insights</CardTitle>
                            <CardDescription>What did they do well? What could be improved for next tenure?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-60">Successes</Label>
                                <Textarea
                                    placeholder="e.g. Excellent communication during workshops..."
                                    className="min-h-[120px] bg-white/5 border-white/10 focus:border-google-blue"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-60">Growth Areas</Label>
                                <Textarea
                                    placeholder="e.g. More frequent project updates would be helpful..."
                                    className="min-h-[120px] bg-white/5 border-white/10 focus:border-google-red"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feature 23: AI Sentiment Disclaimer */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
                        <HelpCircle className="w-4 h-4" />
                        <p>Your responses are processed by **Gemini AI** to create a summarized, non-identifiable report for the Faculty Head. <b>Individual identities are never stored.</b></p>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-google-blue to-google-red hover:shadow-glow transition-all">
                        Submit Anonymous Review
                        <Send className="w-5 h-5 ml-3" />
                    </Button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default TenureFeedback;
