import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Search, Edit, Trash2, Globe, Lock, Send, Users, Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  content: string;
  visibility: "PUBLIC" | "MEMBERS_ONLY" | "LEADS_ONLY";
  category: string;
  createdAt: string;
  creator: {
    fullName: string;
    role: string;
  };
}

const AnnouncementsManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    visibility: "PUBLIC"
  });

  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Announcement[]>;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newAnnouncement: any) => {
      const res = await fetch("http://localhost:3000/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAnnouncement)
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Announcement published!");
      setShowCreateModal(false);
      setFormData({ title: "", content: "", category: "general", visibility: "PUBLIC" });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: () => toast.error("Failed to publish announcement")
  });

  const handlePublish = () => {
    if (!formData.title || !formData.content) return toast.error("Please fill required fields");
    createMutation.mutate(formData);
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "PUBLIC": return <Globe className="w-4 h-4 text-google-green" />;
      case "MEMBERS_ONLY": return <Users className="w-4 h-4 text-google-blue" />;
      case "LEADS_ONLY": return <Lock className="w-4 h-4 text-google-yellow" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
              <p className="text-muted-foreground">Recent updates and news</p>
            </div>

            {/* Create Button - simplified permission check, ideally check role */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button variant="googleBlue" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Announcement title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your announcement..." className="min-h-[150px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="membership">Membership</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Visibility</Label>
                      <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PUBLIC">Public (All)</SelectItem>
                          <SelectItem value="MEMBERS_ONLY">Members Only</SelectItem>
                          <SelectItem value="LEADS_ONLY">Leads Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="googleBlue" className="flex-1 gap-2" onClick={handlePublish} disabled={createMutation.isPending}>
                      <Send className="w-4 h-4" />
                      {createMutation.isPending ? "Publishing..." : "Publish"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* List */}
          <div className="space-y-4">
            {isLoading ? <div>Loading announcements...</div> : announcements?.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">{announcement.title}</h3>
                        <Badge variant="secondary">{announcement.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {getVisibilityIcon(announcement.visibility)}
                          <span>{announcement.visibility.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                        <span>By {announcement.creator.fullName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {announcements?.length === 0 && <div className="text-center text-muted-foreground">No announcements yet.</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnnouncementsManagement;
