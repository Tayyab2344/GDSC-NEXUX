import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, Bell, Mail, Shield, Camera, Save, Trash2, Key,
  Lock, Eye, Smartphone, Heart, Palette, AlertCircle, Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { useRef } from "react";

const ProfileUpdateForm = ({ user, formData, setFormData }: { user: any, formData: any, setFormData: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Full Name</Label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-google-blue"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Email Address</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-google-blue"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider opacity-60">New Password (Optional)</Label>
          <Input
            type="password"
            placeholder="Leave blank to keep current"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-google-blue"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Social Handle (@)</Label>
          <Input
            defaultValue={user.github?.replace('https://github.com/', '') || user.email.split('@')[0]}
            placeholder="e.g. github_user"
            className="bg-white/5 border-white/10 h-12 rounded-xl"
            disabled
          />
        </div>
        {/* Read-only fields for context */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider opacity-60">University Roles</Label>
          <div className="flex flex-wrap gap-2 p-3 min-h-[48px] rounded-xl bg-white/5 border border-white/10 items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${user.role.includes('LEAD') ? 'bg-google-blue/20 text-google-blue border border-google-blue/30' :
              user.role === 'PRESIDENT' ? 'bg-google-red/20 text-google-red border border-google-red/30' :
                user.role === 'FACULTY_HEAD' ? 'bg-google-green/20 text-google-green border border-google-green/30' :
                  'bg-white/10 text-muted-foreground border border-white/20'
              }`}>
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  usePageTitle("System Settings");
  const token = localStorage.getItem("token");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!token
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    aiAlerts: true,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

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

  // Initialize form data when user loads
  if (user && !formData.email && !formData.fullName) {
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
    })
  }

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }

      toast.success("Settings updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading settings...</div>;
  if (!user) return <div className="flex h-screen items-center justify-center">Failed to load user data.</div>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Account Command Center</h1>
            <p className="text-muted-foreground mt-1">Configure your digital identity and preferences</p>
          </div>
          <Button onClick={handleSave} disabled={loading} className="bg-google-blue hover:shadow-glow-blue transition-all h-12 px-8 rounded-2xl font-bold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Commit Changes
          </Button>
        </div>

        <Tabs defaultValue="identity" className="w-full">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-4 lg:col-span-3">
              <Card className="glass-card sticky top-28">
                <CardContent className="p-2">
                  <TabsList className="flex flex-col h-auto w-full bg-transparent gap-1 p-0">
                    <TabsTrigger
                      value="identity"
                      className="w-full justify-start gap-3 p-4 rounded-xl data-[state=active]:bg-google-blue/10 data-[state=active]:text-google-blue data-[state=active]:font-bold data-[state=active]:border-google-blue/20 border border-transparent transition-all"
                    >
                      <User className="w-4 h-4" /> Identity
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="w-full justify-start gap-3 p-4 rounded-xl data-[state=active]:bg-google-blue/10 data-[state=active]:text-google-blue data-[state=active]:font-bold transition-all hover:bg-white/5"
                    >
                      <Bell className="w-4 h-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="w-full justify-start gap-3 p-4 rounded-xl data-[state=active]:bg-google-blue/10 data-[state=active]:text-google-blue data-[state=active]:font-bold transition-all hover:bg-white/5"
                    >
                      <Shield className="w-4 h-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="appearance"
                      className="w-full justify-start gap-3 p-4 rounded-xl data-[state=active]:bg-google-blue/10 data-[state=active]:text-google-blue data-[state=active]:font-bold transition-all hover:bg-white/5"
                    >
                      <Palette className="w-4 h-4" /> Appearance
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-8 lg:col-span-9 space-y-8">

              {/* Identity Tab */}
              <TabsContent value="identity" className="mt-0 space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                <Card className="glass-card overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-google-blue/20 via-google-red/20 to-google-yellow/20" />
                  <CardHeader className="relative -mt-12 flex flex-col md:flex-row items-end gap-6 pb-2">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-4 border-background ring-2 ring-white/10 shadow-xl overflow-hidden">
                        <AvatarImage src={user.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-google-blue text-white text-2xl font-black">{user.fullName?.[0]}</AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-100"
                      >
                        {isUploading ? (
                          <Loader2 className="text-white w-6 h-6 animate-spin" />
                        ) : (
                          <Camera className="text-white w-6 h-6" />
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
                    <div className="flex-1 pb-4">
                      <CardTitle className="text-2xl font-bold">Identity Profile</CardTitle>
                      <p className="text-sm text-muted-foreground">This is how the society sees you.</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <ProfileUpdateForm user={user} formData={formData} setFormData={setFormData} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-0 space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="w-5 h-5 text-google-yellow" /> Interaction Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Push Notifications', key: 'push', desc: 'Real-time society alerts' },
                      { label: 'Gemini AI Insights', key: 'aiAlerts', desc: 'AI-curated learning paths' },
                      { label: 'Event Reminders', key: 'email', desc: 'Sync with your calendar' }
                    ].map((item) => (
                      <div key={item.key} className="flex justify-between items-center p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <div>
                          <p className="font-bold text-sm tracking-tight">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          className="data-[state=checked]:bg-google-yellow"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-0 space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lock className="w-5 h-5 text-google-green" /> Safety Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-2xl hover:bg-white/5 transition-colors">
                      <div>
                        <p className="font-bold text-sm tracking-tight">Anonymous Tenure</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Hide identity during reviews</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-2xl hover:bg-white/5 transition-colors">
                      <div>
                        <p className="font-bold text-sm tracking-tight">Incognito Mode</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Hide online status in chats</p>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline" className="w-full rounded-2xl border-white/10 gap-2 h-11 text-xs font-bold uppercase tracking-widest">
                      <Key className="w-4 h-4" /> Reset 2FA Keys
                    </Button>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-google-red/20 bg-google-red/[0.02] overflow-hidden">
                  <CardHeader className="bg-google-red/5">
                    <CardTitle className="text-xl text-google-red flex items-center gap-2">
                      <AlertCircle className="w-6 h-6" /> Destructive Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-foreground/70 mb-6">
                      Removing your account will result in permanent loss of <b>{user.xp} XP</b> and your <b>Level {user.level}</b> elite status. This action is irreversible.
                    </p>
                    <Button variant="outline" className="border-google-red/30 text-google-red hover:bg-google-red/10 rounded-2xl h-12 px-8 font-bold">
                      <Trash2 className="w-4 h-4 mr-2" /> Expunge Identity
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="mt-0 space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
                <Card className="glass-card h-64 flex items-center justify-center border-dashed border-2">
                  <div className="text-center">
                    <Palette className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-bold">Theme & Visuals</h3>
                    <p className="text-muted-foreground">Use the toggle in the navbar to switch themes.</p>
                  </div>
                </Card>
              </TabsContent>

            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};



export default Settings;
