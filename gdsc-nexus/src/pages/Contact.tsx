import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
    usePageTitle("Contact Us");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Message sent successfully! We'll get back to you soon.");
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    const contactInfo = [
        { icon: Mail, label: "Email", value: "gdsc@comsats.edu.pk", href: "mailto:gdsc@comsats.edu.pk" },
        { icon: MapPin, label: "Location", value: "COMSATS University Islamabad", href: "#" },
        { icon: Phone, label: "Phone", value: "+92 51 9247000", href: "tel:+925192470000" },
    ];

    const socialLinks = [
        { icon: Github, label: "GitHub", href: "https://github.com/gdsc-comsats" },
        { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/gdsc-comsats" },
        { icon: Twitter, label: "Twitter", href: "https://twitter.com/gdsc_comsats" },
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-google-blue/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-google-green/5 rounded-full blur-[100px] -z-10 translate-x-1/2 translate-y-1/2" />

            <Navbar />
            <main className="pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="bg-google-blue/10 text-google-blue mb-4 px-4 py-1.5">
                            <MessageCircle className="w-3 h-3 mr-2" />
                            Get In Touch
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            We'd Love to <span className="text-google-blue">Hear From You</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Have questions about joining GDSC? Want to collaborate on a project?
                            Or just want to say hi? Drop us a message!
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Form */}
                        <Card className="lg:col-span-3 glass-card border-white/10">
                            <CardHeader>
                                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                                <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" placeholder="Your name" required className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="you@example.com" required className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" placeholder="What's this about?" required className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us what's on your mind..."
                                            required
                                            className="bg-white/5 border-white/10 min-h-[150px] rounded-xl resize-none"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 bg-google-blue hover:bg-google-blue/90 rounded-xl font-bold text-base"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                Send Message
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="glass-card border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-xl">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {contactInfo.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="p-3 rounded-xl bg-google-blue/10 text-google-blue group-hover:bg-google-blue group-hover:text-white transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                                <p className="font-medium">{item.value}</p>
                                            </div>
                                        </a>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-xl">Connect With Us</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social) => (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 p-4 rounded-xl bg-white/5 hover:bg-google-blue/10 border border-white/10 hover:border-google-blue/30 transition-all flex items-center justify-center group"
                                            >
                                                <social.icon className="w-6 h-6 text-muted-foreground group-hover:text-google-blue transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Info */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-google-blue/10 to-google-green/10 border border-white/10">
                                <h3 className="font-bold mb-2">Office Hours</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                                    Saturday: 10:00 AM - 2:00 PM
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Response time: Usually within 24 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
