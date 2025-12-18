import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle, Video, Calendar, BookOpen, Users, CheckCircle,
  Shield, PenTool, Layout, FileText, Upload, Plus, ExternalLink, Github
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Field {
  id: string;
  name: string;
  description: string;
  category: "TECHNICAL" | "NON_TECHNICAL";
}

interface UserProfile {
  id: string;
  role: string;
  fields: { fieldId: string }[];
}

interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  type: "VIDEO" | "ARTICLE" | "DOCUMENTATION" | "COURSE";
}

interface Project {
  id: string;
  title: string;
  description: string;
  repoLink: string;
  demoLink: string;
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "MAINTENANCE";
}

const FieldDetail = () => {
  const { teamId, fieldId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // Dialog States
  const [isResourceOpen, setIsResourceOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  // Form States
  const [newResource, setNewResource] = useState({ title: "", description: "", link: "", type: "ARTICLE" });
  const [newProject, setNewProject] = useState({ title: "", description: "", repoLink: "", demoLink: "", status: "PLANNING" });

  // Fetch Current User
  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch("http://localhost:3000/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok ? (res.json() as Promise<UserProfile>) : null;
    },
    enabled: !!token
  });

  // Fetch Field Data
  const { data: field, isLoading } = useQuery({
    queryKey: ["field", fieldId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/teams/${teamId}`);
      if (!res.ok) throw new Error("Failed to fetch team");
      const teamData = await res.json();
      return teamData.fields.find((f: any) => f.id === fieldId) as Field;
    }
  });

  // Fetch Resources
  const { data: resources } = useQuery({
    queryKey: ["resources", fieldId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/resources/field/${fieldId}`);
      if (!res.ok) return [];
      return res.json() as Promise<Resource[]>;
    },
    enabled: !!fieldId
  });

  // Fetch Projects
  const { data: projects } = useQuery({
    queryKey: ["projects", fieldId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/projects/field/${fieldId}`);
      if (!res.ok) return [];
      return res.json() as Promise<Project[]>;
    },
    enabled: !!fieldId
  });

  // Create Resource Mutation
  const createResourceMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("http://localhost:3000/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, fieldId })
      });
      if (!res.ok) throw new Error("Failed to create resource");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Resource added successfully");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      setNewResource({ title: "", description: "", link: "", type: "ARTICLE" });
    }
  });

  // Create Project Mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, fieldId })
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Project added successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNewProject({ title: "", description: "", repoLink: "", demoLink: "", status: "PLANNING" });
    }
  });


  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading...</div>;
  if (!field) return <div className="flex h-screen items-center justify-center">Field not found</div>;

  const isMember = user?.fields.some(f => f.fieldId === fieldId);
  const isLead = user && (['TEAM_LEAD', 'CO_LEAD', 'PRESIDENT', 'FACULTY_HEAD'].includes(user.role));
  const isTechnical = field.category === "TECHNICAL";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link to="/teams" className="hover:text-foreground">Teams</Link>
              <span>/</span>
              <Link to={`/teams/${teamId}`} className="hover:text-foreground">Team</Link>
              <span>/</span>
              <span className="text-foreground">{field.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{field.name}</h1>
                <Badge variant="outline" className="mb-4">{isTechnical ? "Technical Field" : "Creative/Management Field"}</Badge>
              </div>
              {isLead && (
                <Badge className="bg-google-red/10 text-google-red border-google-red/20">
                  <Shield className="w-3 h-3 mr-1" /> Lead Access
                </Badge>
              )}
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl mb-4">{field.description || "No description available."}</p>

            {isMember ? (
              <Badge className="bg-google-green/10 text-google-green border-google-green/20">
                <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
              </Badge>
            ) : (
              // Only show Apply if not member. (Application flow is separate)
              <Button variant="googleBlue" disabled={!user}>Detailed Application Required</Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link to={`/chat`}>
              <Button variant="googleBlue" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Open Chat
              </Button>
            </Link>

            {(isLead || isMember) && (
              <Link to={`/meetings`}>
                <Button variant="outline" className="gap-2">
                  <Video className="w-4 h-4" />
                  Meetings
                </Button>
              </Link>
            )}

            {/* Gallery Upload - Available to all members/leads for now */}
            <Link to="/gallery">
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Work
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Dashboard Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Specialized Tools Section */}
              <Card className="border-google-blue/20 bg-google-blue/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-google-blue" />
                    {isTechnical ? "Development Hub" : "Creative Suite"}
                  </CardTitle>
                  <CardDescription>
                    Tools and resources for {field.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Dynamic Tools based on Category */}
                    {isTechnical ? (
                      <>
                        <Dialog open={isResourceOpen} onOpenChange={setIsResourceOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-background hover:bg-white">
                              <BookOpen className="w-6 h-6 text-google-blue" />
                              <span>Learning Tracks</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Learning Resources</DialogTitle>
                              <DialogDescription>Curated materials for {field.name}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Add Resource Form (Leads Only) */}
                              {isLead && (
                                <Card className="border-dashed">
                                  <CardContent className="pt-4 space-y-3">
                                    <h4 className="font-semibold text-sm">Add New Resource</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Input
                                        placeholder="Title"
                                        value={newResource.title}
                                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                      />
                                      <Select
                                        value={newResource.type}
                                        onValueChange={(v) => setNewResource({ ...newResource, type: v })}
                                      >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="ARTICLE">Article</SelectItem>
                                          <SelectItem value="VIDEO">Video</SelectItem>
                                          <SelectItem value="DOCUMENTATION">Docs</SelectItem>
                                          <SelectItem value="COURSE">Course</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Input
                                      placeholder="Link URL"
                                      value={newResource.link}
                                      onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                                    />
                                    <Textarea
                                      placeholder="Description (optional)"
                                      value={newResource.description}
                                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => createResourceMutation.mutate(newResource)}
                                      disabled={createResourceMutation.isPending}
                                    >
                                      {createResourceMutation.isPending ? "Adding..." : "Add Resource"}
                                    </Button>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Resources List */}
                              <div className="space-y-2">
                                {resources?.map(res => (
                                  <Card key={res.id}>
                                    <CardContent className="p-4 flex items-start justify-between">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="secondary" className="text-[10px]">{res.type}</Badge>
                                          <h4 className="font-semibold">{res.title}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{res.description}</p>
                                        <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-sm text-google-blue flex items-center gap-1 hover:underline">
                                          View Resource <ExternalLink className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                                {resources?.length === 0 && <p className="text-center text-muted-foreground">No resources yet.</p>}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isProjectOpen} onOpenChange={setIsProjectOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-background hover:bg-white">
                              <PenTool className="w-6 h-6 text-google-green" />
                              <span>Projects & Repos</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Projects & Repositories</DialogTitle>
                              <DialogDescription>Community projects for {field.name}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Add Project Form (Leads Only) */}
                              {isLead && (
                                <Card className="border-dashed">
                                  <CardContent className="pt-4 space-y-3">
                                    <h4 className="font-semibold text-sm">Add New Project</h4>
                                    <Input
                                      placeholder="Project Title"
                                      value={newProject.title}
                                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                      <Select
                                        value={newProject.status}
                                        onValueChange={(v) => setNewProject({ ...newProject, status: v })}
                                      >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="PLANNING">Planning</SelectItem>
                                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                          <SelectItem value="COMPLETED">Completed</SelectItem>
                                          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Input
                                        placeholder="Repo Link (GitHub)"
                                        value={newProject.repoLink}
                                        onChange={(e) => setNewProject({ ...newProject, repoLink: e.target.value })}
                                      />
                                    </div>
                                    <Input
                                      placeholder="Demo Link (Live)"
                                      value={newProject.demoLink}
                                      onChange={(e) => setNewProject({ ...newProject, demoLink: e.target.value })}
                                    />
                                    <Textarea
                                      placeholder="Description"
                                      value={newProject.description}
                                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                    <Button
                                      size="sm"
                                      className="bg-google-green hover:bg-google-green/90"
                                      onClick={() => createProjectMutation.mutate(newProject)}
                                      disabled={createProjectMutation.isPending}
                                    >
                                      {createProjectMutation.isPending ? "Adding..." : "Add Project"}
                                    </Button>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Projects List */}
                              <div className="space-y-2">
                                {projects?.map(proj => (
                                  <Card key={proj.id}>
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">{proj.title}</h4>
                                        <Badge variant={proj.status === 'COMPLETED' ? 'default' : 'outline'}>{proj.status.replace('_', ' ')}</Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">{proj.description}</p>
                                      <div className="flex gap-3 text-sm">
                                        {proj.repoLink && (
                                          <a href={proj.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-foreground hover:underline">
                                            <Github className="w-3 h-3" /> Repo
                                          </a>
                                        )}
                                        {proj.demoLink && (
                                          <a href={proj.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-google-blue hover:underline">
                                            <ExternalLink className="w-3 h-3" /> Live Demo
                                          </a>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                                {projects?.length === 0 && <p className="text-center text-muted-foreground">No projects yet.</p>}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    ) : (
                      <>
                        {/* Marketing / Non-Tech Tools */}
                        {(isLead || field.name.toLowerCase().includes("marketing")) && (
                          <Link to="/admin/forms">
                            <Button variant="outline" className="w-full h-full py-4 flex flex-col gap-2 bg-background hover:bg-white">
                              <FileText className="w-6 h-6 text-google-blue" />
                              <span>Form Builder</span>
                            </Button>
                          </Link>
                        )}
                        <Link to="/gallery">
                          <Button variant="outline" className="w-full h-full py-4 flex flex-col gap-2 bg-background hover:bg-white">
                            <Users className="w-6 h-6 text-google-yellow" />
                            <span>Community Outreach</span>
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lead Management Section */}
              {isLead && (
                <Card className="border-google-red/20 bg-google-red/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-google-red" />
                      Lead Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Link to="/admin/memberships">
                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-background hover:bg-white">
                          <Users className="w-6 h-6 text-google-red" />
                          <span>Review Applications</span>
                        </Button>
                      </Link>
                      <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-background hover:bg-white" disabled>
                        <Calendar className="w-6 h-6 text-google-red" />
                        <span>Schedule Event</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Field Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Members</span>
                    <span className="font-medium text-foreground">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upcoming Events</span>
                    <span className="font-medium text-foreground">--</span>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FieldDetail;
