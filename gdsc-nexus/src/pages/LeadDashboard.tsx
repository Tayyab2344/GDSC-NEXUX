import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    MessageSquare, Calendar, Users, Video, ClipboardList, Trash2,
    FileText, UserPlus, Shield, Megaphone, Mail, Send, Upload, Image as ImageIcon, Camera, Plus
} from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CreateClassDialog from "@/components/dashboard/CreateClassDialog";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { toast } from "sonner";
import { usePageTitle } from "@/hooks/use-page-title";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    role: string;
    fields: { field: { id: string; name: string; chats: { id: string; name: string }[] } }[];
}

interface Member {
    id: string;
    userId: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        avatarUrl: string;
        role: string;
    };
    joinedAt: string;
}

interface ClassSession {
    id: string;
    title: string;
    scheduledAt: string;
    durationMin: number;
    _count: {
        attendance: number;
    }
}

interface LeadDashboardProps {
    user: UserProfile;
}

const LeadDashboard = ({ user }: LeadDashboardProps) => {
    usePageTitle("Lead Dashboard");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");
    // Assuming the lead is associated with one primary technical field for this dashboard view
    // or we take the first field found.
    const field = user.fields?.[0]?.field;
    const fieldId = field?.id;

    const { data: members } = useQuery({
        queryKey: ["members", fieldId],
        queryFn: async () => {
            if (!fieldId) return [];
            const res = await fetch(`http://localhost:3000/fields/${fieldId}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch members");
            return res.json() as Promise<Member[]>;
        },
        enabled: !!fieldId
    });


    const { data: classes } = useQuery({
        queryKey: ["classes", fieldId],
        queryFn: async () => {
            if (!fieldId) return [];
            const res = await fetch(`http://localhost:3000/classes?fieldId=${fieldId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch classes");
            return res.json() as Promise<ClassSession[]>;
        },
        enabled: !!fieldId && field?.name !== 'Management'
    });

    const isManagement = field?.name === 'Management';
    const isMarketing = field?.name === 'Marketing';

    // Marketing Upload State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadLink, setUploadLink] = useState("");
    const [uploadType, setUploadType] = useState<"BANNER" | "GALLERY">("BANNER");

    // Announcement Form State
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementContent, setAnnouncementContent] = useState("");
    const [announcementCategory, setAnnouncementCategory] = useState("General");
    const [announcementVisibility, setAnnouncementVisibility] = useState("PUBLIC");
    const [announcementImage, setAnnouncementImage] = useState<File | null>(null);

    // Event Form State
    const [isEventOpen, setIsEventOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("10:00 AM");
    const [eventLocation, setEventLocation] = useState("");
    const [eventTags, setEventTags] = useState(""); // Comma separated
    const [eventLink, setEventLink] = useState(""); // Registration Link
    const [eventImage, setEventImage] = useState<File | null>(null);

    // Manual Email State
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [manualEmailSubject, setManualEmailSubject] = useState("");
    const [manualEmailContent, setManualEmailContent] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Fetch Data for Marketing
    const { data: announcements, refetch: refetchAnnouncements } = useQuery({
        queryKey: ["announcements", "marketing"],
        queryFn: async () => {
            if (!isMarketing) return [];
            const res = await fetch("http://localhost:3000/announcements");
            return res.json();
        },
        enabled: isMarketing
    });

    const { data: events, refetch: refetchEvents } = useQuery({
        queryKey: ["events", "marketing"],
        queryFn: async () => {
            if (!isMarketing) return [];
            const res = await fetch("http://localhost:3000/events");
            return res.json();
        },
        enabled: isMarketing
    });

    const { data: galleryItems, refetch: refetchGallery } = useQuery({
        queryKey: ["gallery", "marketing"],
        queryFn: async () => {
            if (!isMarketing) return [];
            const res = await fetch("http://localhost:3000/gallery");
            return res.json();
        },
        enabled: isMarketing
    });

    // Delete Handlers
    const deleteItem = async (type: "announcements" | "events" | "gallery", id: string) => {
        try {
            const res = await fetch(`http://localhost:3000/${type}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Deleted successfully");
                if (type === "announcements") refetchAnnouncements();
                if (type === "events") refetchEvents();
                if (type === "gallery") refetchGallery();
            } else {
                toast.error("Failed to delete");
            }
        } catch (e) {
            toast.error("Error deleting item");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) return;
        try {
            const formData = new FormData();
            formData.append("file", uploadFile);
            formData.append("eventName", uploadTitle);
            formData.append("location", uploadLink); // Use location field for the Link URL
            formData.append("title", uploadType); // Use Title field as the tag (BANNER | GALLERY)
            // formData.append("type", uploadType); // Type is enum (IMAGE|VIDEO), handled by backend auto-detection

            const res = await fetch("http://localhost:3000/gallery", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                toast.success(`${uploadType === 'BANNER' ? 'Banner' : 'Gallery item'} posted successfully!`);
                setIsUploadOpen(false);
                setIsGalleryOpen(false);
                setUploadFile(null);
                setUploadTitle("");
                setUploadLink("");
            } else {
                const errData = await res.json().catch(() => ({ message: res.statusText }));
                throw new Error(errData.message || "Upload failed");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to upload");
        }
    };

    if (!field) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-8 pt-24 text-center">
                    <h1 className="text-2xl font-bold">No Field Assigned</h1>
                    <p className="text-muted-foreground">You are a lead but not assigned to any field yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background" >
            <Navbar />
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold">Lead Dashboard</h1>
                        <p className="text-muted-foreground">Manage the {field.name} Team</p>
                    </div>
                    {/* Quick Chat Links */}
                    <div className="flex gap-2">
                        {/* General Chat Redirect */}
                        <Button variant="outline" onClick={() => navigate("/chat")}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            General Chat
                        </Button>
                        {/* Field Chat Redirect */}
                        <Button variant="googleBlue" onClick={() => navigate(`/fields/${fieldId}/chat`)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {field.name} Chat
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{members?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                            <Video className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{classes?.length || 0}</div>
                        </CardContent>
                    </Card>
                    {isManagement ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">--</div>
                                <Link to="/admin/memberships" className="text-xs text-google-blue hover:underline">
                                    Review Applications
                                </Link>
                            </CardContent>
                        </Card>
                    ) : isMarketing ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
                                <Megaphone className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">Ready to promote</p>
                            </CardContent>
                        </Card>
                    ) : null}
                </div>

                <Tabs defaultValue="classes" className="space-y-6">
                    <TabsList>
                        {!isManagement && !isMarketing && <TabsTrigger value="classes">Classes & Attendance</TabsTrigger>}
                        {isManagement && <TabsTrigger value="management">Management Tools</TabsTrigger>}
                        {isMarketing && <TabsTrigger value="marketing">Marketing Tools</TabsTrigger>}
                        <TabsTrigger value="members">Members</TabsTrigger>
                    </TabsList>

                    {isManagement && (
                        <TabsContent value="management" className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="hover:border-google-blue/50 transition-colors cursor-pointer" onClick={() => navigate('/admin/forms')}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-google-blue" />
                                            Form Builder
                                        </CardTitle>
                                        <CardDescription>Create and manage forms for recruitment and surveys.</CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="hover:border-google-green/50 transition-colors cursor-pointer" onClick={() => navigate('/admin/memberships')}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-google-green" />
                                            Verify Members
                                        </CardTitle>
                                        <CardDescription>Review pending applications and verify new members.</CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                        </TabsContent>
                    )}

                    {isMarketing && (
                        <TabsContent value="marketing" className="space-y-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Card className="hover:border-google-blue/50 transition-colors cursor-pointer" onClick={() => navigate('/admin/forms')}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Megaphone className="h-5 w-5 text-google-blue" />
                                            Promote Forms
                                        </CardTitle>
                                        <CardDescription>View active forms and copy links.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button size="sm" variant="outline" className="w-full">Open Form List</Button>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-google-red/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="h-5 w-5 text-google-red" />
                                            Post Banner
                                        </CardTitle>
                                        <CardDescription>Upload mini-banners for ads.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Dialog open={isUploadOpen} onOpenChange={(open) => { setIsUploadOpen(open); if (open) setUploadType("BANNER"); }}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full text-google-red border-google-red/20 hover:bg-google-red/5">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload Banner
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Post Marketing Banner</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Banner Image</Label>
                                                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Banner Title</Label>
                                                        <Input
                                                            placeholder="e.g. Winter Sale"
                                                            value={uploadTitle}
                                                            onChange={(e) => setUploadTitle(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Action Link (Form URL)</Label>
                                                        <Input
                                                            placeholder="e.g. https://gdsc.dev/forms/membership"
                                                            value={uploadLink}
                                                            onChange={(e) => setUploadLink(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleUpload} disabled={!uploadFile}>Post Banner</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-google-green/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Camera className="h-5 w-5 text-google-green" />
                                            Update Gallery
                                        </CardTitle>
                                        <CardDescription>Post event photos and videos.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Dialog open={isGalleryOpen} onOpenChange={(open) => { setIsGalleryOpen(open); if (open) setUploadType("GALLERY"); }}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full text-google-green border-google-green/20 hover:bg-google-green/5">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload to Gallery
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Upload to Gallery</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Photo or Video</Label>
                                                        <Input type="file" accept="image/*,video/*" onChange={handleFileChange} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Event Label / Caption</Label>
                                                        <Input
                                                            placeholder="e.g. Tech Talk 2024"
                                                            value={uploadTitle}
                                                            onChange={(e) => setUploadTitle(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleUpload} disabled={!uploadFile}>Upload Item</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-google-yellow/50 transition-colors md:col-span-2 lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Mail className="h-5 w-5 text-google-yellow" />
                                            Post Announcement
                                        </CardTitle>
                                        <CardDescription>Post news or updates.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input placeholder="Announcement Title" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Content</Label>
                                            <Textarea placeholder="Type your message here..." value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Select value={announcementCategory} onValueChange={setAnnouncementCategory}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="General">General</SelectItem>
                                                        <SelectItem value="Events">Events</SelectItem>
                                                        <SelectItem value="Learning">Learning</SelectItem>
                                                        <SelectItem value="Membership">Membership</SelectItem>
                                                        <SelectItem value="Community">Community</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Visibility</Label>
                                                <Select value={announcementVisibility} onValueChange={setAnnouncementVisibility}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PUBLIC">Public</SelectItem>
                                                        <SelectItem value="MEMBERS_ONLY">Members Only</SelectItem>
                                                        <SelectItem value="LEADS_ONLY">Leads Only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Side Image (Optional)</Label>
                                            <Input type="file" accept="image/*" onChange={(e) => e.target.files && setAnnouncementImage(e.target.files[0])} />
                                        </div>

                                        <Button
                                            className="w-full"
                                            onClick={async () => {
                                                try {
                                                    const formData = new FormData();
                                                    formData.append("title", announcementTitle);
                                                    formData.append("content", announcementContent);
                                                    formData.append("category", announcementCategory);
                                                    formData.append("visibility", announcementVisibility);
                                                    if (announcementImage) formData.append("file", announcementImage);

                                                    const res = await fetch("http://localhost:3000/announcements", {
                                                        method: "POST",
                                                        headers: { Authorization: `Bearer ${token}` },
                                                        body: formData
                                                    });
                                                    if (res.ok) {
                                                        toast.success("Announcement Posted!");
                                                        setAnnouncementTitle("");
                                                        setAnnouncementContent("");
                                                        setAnnouncementImage(null);
                                                    } else {
                                                        toast.error("Failed to post");
                                                    }
                                                } catch (e) { toast.error("Error posting announcement"); }
                                            }}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Post Update
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-google-blue/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-google-blue" />
                                            Create Event
                                        </CardTitle>
                                        <CardDescription>Schedule a new workshop or session.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full text-google-blue border-google-blue/20 hover:bg-google-blue/5">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Event
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Create New Event</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Event Cover Image</Label>
                                                        <Input type="file" accept="image/*" onChange={(e) => e.target.files && setEventImage(e.target.files[0])} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Title</Label>
                                                        <Input placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Textarea placeholder="Details about the event..." value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Date</Label>
                                                            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Time</Label>
                                                            <Input placeholder="10:00 AM" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Location</Label>
                                                        <Input placeholder="e.g. Auditorium A or Zoom Link" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Registration Link</Label>
                                                        <Input placeholder="https://..." value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Tags (comma separated)</Label>
                                                        <Input placeholder="React, Workshop, Technical" value={eventTags} onChange={(e) => setEventTags(e.target.value)} />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        onClick={async () => {
                                                            if (!eventImage || !eventTitle || !eventDate) {
                                                                toast.error("Image, Title and Date are required");
                                                                return;
                                                            }
                                                            try {
                                                                const formData = new FormData();
                                                                formData.append("title", eventTitle);
                                                                formData.append("description", eventDescription);
                                                                formData.append("date", eventDate);
                                                                formData.append("registrationLink", eventLink);
                                                                formData.append("location", eventLocation);

                                                                const tagsArray = eventTags.split(',').map(t => t.trim());
                                                                tagsArray.forEach(tag => formData.append("tags", tag));

                                                                if (eventImage) formData.append("file", eventImage);

                                                                const res = await fetch("http://localhost:3000/events", {
                                                                    method: "POST",
                                                                    headers: { Authorization: `Bearer ${token}` },
                                                                    body: formData
                                                                });

                                                                if (res.ok) {
                                                                    toast.success("Event Created!");
                                                                    setIsEventOpen(false);
                                                                    setEventTitle("");
                                                                    setEventDescription("");
                                                                } else {
                                                                    toast.error("Failed to create event");
                                                                }
                                                            } catch (e) { toast.error("Error creating event"); }
                                                        }}
                                                    >Create Event</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-google-yellow/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Mail className="h-5 w-5 text-google-yellow" />
                                            Email Society
                                        </CardTitle>
                                        <CardDescription>Send a manual email to all members.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full text-google-yellow border-google-yellow/20 hover:bg-google-yellow/5">
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Compose Email
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl">
                                                <DialogHeader>
                                                    <DialogTitle>Send Manual Email Broadcast</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Subject</Label>
                                                        <Input
                                                            placeholder="Email Subject"
                                                            value={manualEmailSubject}
                                                            onChange={(e) => setManualEmailSubject(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Message Content</Label>
                                                        <Textarea
                                                            placeholder="Write your message here. It will be sent to ALL registered members."
                                                            value={manualEmailContent}
                                                            onChange={(e) => setManualEmailContent(e.target.value)}
                                                            className="min-h-[200px]"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        className="bg-google-yellow hover:bg-google-yellow/90 text-white"
                                                        disabled={isSendingEmail || !manualEmailSubject || !manualEmailContent}
                                                        onClick={async () => {
                                                            setIsSendingEmail(true);
                                                            try {
                                                                const res = await fetch("http://localhost:3000/email/broadcast", {
                                                                    method: "POST",
                                                                    headers: {
                                                                        "Content-Type": "application/json",
                                                                        Authorization: `Bearer ${token}`
                                                                    },
                                                                    body: JSON.stringify({
                                                                        subject: manualEmailSubject,
                                                                        content: manualEmailContent
                                                                    })
                                                                });

                                                                if (res.ok) {
                                                                    toast.success("Broadcast email sent successfully!");
                                                                    setIsEmailOpen(false);
                                                                    setManualEmailSubject("");
                                                                    setManualEmailContent("");
                                                                } else {
                                                                    toast.error("Failed to send email broadcast");
                                                                }
                                                            } catch (err) {
                                                                toast.error("Error sending email");
                                                            } finally {
                                                                setIsSendingEmail(false);
                                                            }
                                                        }}
                                                    >
                                                        {isSendingEmail ? "Sending..." : "Send Broadcast"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Management Lists */}
                            <div className="space-y-8 mt-8">
                                {/* Announcements Management */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Manage Announcements</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Visibility</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {announcements?.map((item: any) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.title}</TableCell>
                                                        <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                                        <TableCell><Badge variant="secondary">{item.visibility}</Badge></TableCell>
                                                        <TableCell className="text-right">
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button size="icon" variant="ghost" className="text-destructive">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This will permanently remove "{item.title}". This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => deleteItem("announcements", item.id)}
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {/* Events Management */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Manage Events</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {events?.map((item: any) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.title}</TableCell>
                                                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                                        <TableCell>{item.location}</TableCell>
                                                        <TableCell className="text-right">
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button size="icon" variant="ghost" className="text-destructive">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This will permanently remove the event "{item.title}". This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => deleteItem("events", item.id)}
                                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {/* Gallery Management */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Manage Gallery & Banners</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {galleryItems?.map((item: any) => (
                                                <div key={item.id} className="relative group rounded-lg overflow-hidden border">
                                                    <img src={item.url} alt="Gallery" className="w-full h-32 object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="icon" variant="destructive">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Gallery Item?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to remove this item from the gallery?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-white text-black hover:bg-gray-100 border-none">Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => deleteItem("gallery", item.id)}
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 text-xs truncate">
                                                        {item.title || "No Title"}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    )}

                    <TabsContent value="classes" className="space-y-6">
                        {!isManagement && !isMarketing && (
                            <>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">Class Sessions</h2>
                                    <CreateClassDialog fieldId={fieldId} />
                                </div>

                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Date & Time</TableHead>
                                                    <TableHead>Duration</TableHead>
                                                    <TableHead>Attendance</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {classes?.map((session) => (
                                                    <TableRow key={session.id}>
                                                        <TableCell className="font-medium">{session.title}</TableCell>
                                                        <TableCell>
                                                            {format(new Date(session.scheduledAt), "MMM d, yyyy h:mm a")}
                                                        </TableCell>
                                                        <TableCell>{session.durationMin} min</TableCell>
                                                        <TableCell>{session._count?.attendance || 0} Students</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/fields/${fieldId}/class/${session.id}`)}>
                                                                    View Class
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    onClick={async () => {
                                                                        if (window.confirm("Are you sure you want to delete this class? This cannot be undone.")) {
                                                                            try {
                                                                                const res = await fetch(`http://localhost:3000/classes/${session.id}`, {
                                                                                    method: "DELETE",
                                                                                    headers: { Authorization: `Bearer ${token}` }
                                                                                });
                                                                                if (res.ok) {
                                                                                    toast.success("Class deleted successfully");
                                                                                    queryClient.invalidateQueries({ queryKey: ["classes", fieldId] });
                                                                                } else {
                                                                                    throw new Error("Failed to delete");
                                                                                }
                                                                            } catch (err) {
                                                                                toast.error("Failed to delete class");
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {classes?.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                            No classes scheduled yet.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                        {(isManagement) && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Button variant="link" onClick={() => navigate('/admin/forms')}>Go to Form Builder</Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="members">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>All members assigned to {field.name}.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members?.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={member.user.avatarUrl} />
                                                        <AvatarFallback>{member.user.fullName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{member.user.fullName}</div>
                                                        <div className="text-xs text-muted-foreground">{member.user.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{member.user.role.replace('_', ' ')}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(member.joinedAt), "MMM d, yyyy")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div >
            <Footer />
        </div >
    );
};

export default LeadDashboard;
