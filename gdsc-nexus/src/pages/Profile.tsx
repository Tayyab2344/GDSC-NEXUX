import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit, Mail, Calendar, Users, BookOpen, Award, CheckCircle,
  Github, Linkedin, Globe, Camera, Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

const Profile = () => {
  usePageTitle("My Profile");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem("token");

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
      return res.json();
    },
    enabled: !!token
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success("Profile picture updated!");
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading profile...</div>;
  if (error || !user) return <div className="flex h-screen items-center justify-center">Failed to load profile.</div>;

  const skills = [
    { name: "Frontend", color: "bg-google-blue", value: 85 },
    { name: "Backend", color: "bg-google-red", value: 70 },
    { name: "UI/UX", color: "bg-google-yellow", value: 90 },
    { name: "AI/ML", color: "bg-google-green", value: 45 },
  ];

  return (
    <div className="pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Identity & Quick Stats */}
          <div className="lg:col-span-4 space-y-8">

            {/* Digital ID Card */}
            <div className="relative group perspective-1000">
              <div className="relative h-64 w-full rounded-3xl bg-gradient-to-br from-[#1a1c1e] to-[#0d0e10] p-6 shadow-2xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:shadow-glow-blue group-hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-google-red/20 rounded-full blur-3xl -ml-16 -mb-16" />

                <div className="relative flex justify-between items-start mb-8">
                  <div className="flex gap-4 items-center">
                    <div className="relative group/avatar">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-google-blue to-google-blue/50 p-0.5 shadow-lg overflow-hidden">
                        <Avatar className="w-full h-full rounded-[14px]">
                          <AvatarImage src={user.avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-black text-xl font-bold text-white">
                            {user.fullName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[14px] opacity-0 group-hover/avatar:opacity-100 transition-opacity disabled:opacity-100"
                      >
                        {isUploading ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg tracking-tight">{user.fullName}</h3>
                      <Badge variant="secondary" className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest text-google-blue">
                        {user.role?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-bold text-white/40 uppercase">LVL {Math.floor((user.stats?.xp || 0) / 500) + 1}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-white/30 tracking-widest mb-1">MEMBER ID</p>
                    <p className="text-sm font-mono text-white/80">#GDSC-2024-0492</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-white/30 tracking-widest mb-1">TENURE</p>
                    <p className="text-sm font-mono text-white/80">FALL 2024</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex gap-2">
                    <Github className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
                    <Linkedin className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
                    <Globe className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
                  </div>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=GDSC-TM-0492&color=ffffff&bgcolor=00000000" className="w-10 h-10 opacity-60 invert" alt="QR" />
                </div>
              </div>
            </div>

            {/* XP & Level Progression */}
            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    Growth Progress
                  </CardTitle>
                  <Badge variant="outline" className="text-google-green border-google-green/20">Elite</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-medium">XP: {user.stats?.xp || 0} / {(Math.floor((user.stats?.xp || 0) / 500) + 1) * 500}</span>
                    <span className="text-google-blue font-bold">{Math.round(((user.stats?.xp || 0) % 500) / 5)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-google-blue to-google-green shadow-glow-blue transition-all duration-1000" style={{ width: `${Math.round(((user.stats?.xp || 0) % 500) / 5)}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Rank</p>
                    <p className="font-bold text-lg">Member</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Events</p>
                    <p className="font-bold text-lg">{user.stats?.events || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Onboarding */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Member Onboarding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Complete Profile", done: true },
                  { label: "Join Field Chat", done: true },
                  { label: "First Quiz Passed", done: false },
                  { label: "Verify Identity", done: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-google-green text-white' : 'border-2 border-white/10'}`}>
                      {item.done && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-xs font-medium ${item.done ? 'text-muted-foreground line-through' : ''}`}>{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: AI & Main Details */}
          <div className="lg:col-span-8 space-y-8">

            {/* AI Career Compass */}
            <Card className="glass-card relative overflow-hidden border-google-blue/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      AI Career Compass
                    </CardTitle>
                    <CardDescription>Hyper-personalized roadmap based on your field activity</CardDescription>
                  </div>
                  <Button
                    className="bg-google-blue/10 text-google-blue hover:bg-google-blue/20 border border-google-blue/20"
                  >
                    Recalculate Path
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-google-blue/5 border border-google-blue/10">
                    <h4 className="font-bold text-google-blue flex items-center gap-2 mb-3">
                      Recommended Focus
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Based on your activity, we recommend focus on core technologies within your assigned fields.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    Skills Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {skills.map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{skill.name}</span>
                        <span>{skill.value}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${skill.color} transition-all duration-1000`} style={{ width: `${skill.value}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* smart Badge Collection */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    Achievement Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Verified' },
                      { label: 'Top Scorer' },
                      { label: 'Pro Lead' },
                    ].map((badge, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6`}>
                          <Award className="w-8 h-8 text-google-blue" />
                        </div>
                        <span className="text-[10px] font-bold text-center leading-tight opacity-60">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bio & Social */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Professional Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Passionate full-stack developer with a focus on high-end HCI and AI integration. Currently leading the technical roadmap for GDSC-Nexus and exploring the intersection of generative AI and user interfaces.
                </p>
                <div className="flex gap-4 mt-6">
                  <Button size="sm" variant="outline" asChild className="gap-2 rounded-xl">
                    <Link to="/settings" className="flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Update Bio
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
