import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search, Filter, CheckCircle, XCircle, Eye, Clock,
  User, GraduationCap, Calendar, Loader2, ShieldCheck, UserPlus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { useNavigate } from "react-router-dom";

interface Submission {
  id: string;
  data: any;
  status: string;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
  form?: {
    title: string;
  };
}

interface UserProfile {
  id: string;
  role: string;
  fullName: string;
  fields: { field: { id: string; name: string } }[];
  teams: { team: { id: string; name: string } }[];
}

const MembershipApplications = () => {
  const [filter, setFilter] = useState("PENDING");
  const [categoryFilter, setCategoryFilter] = useState("MEMBERSHIP"); // New state for category
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch current user profile to determine role
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/users/profile?includeFields=true", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json() as Promise<UserProfile>;
    },
    enabled: !!token
  });

  const isManagement = user && (
    ['PRESIDENT', 'FACULTY_HEAD', 'CO_LEAD'].includes(user.role) ||
    user.teams?.some(t => t.team.name === 'Management') ||
    user.fields?.some(f => f.field.name === 'Management')
  );

  // Determine if user is a Tech Lead (has a field assignment and is LEAD)
  const leadField = user?.role === 'TEAM_LEAD' ? user?.fields?.[0]?.field : null;
  const isTechLead = !!leadField && !isManagement; // Simplify: Management takes precedence or separation

  // Fetch applications based on role
  const { data: applications, isLoading } = useQuery({
    queryKey: ["submissions", categoryFilter, isManagement ? "all" : leadField?.name],
    queryFn: async () => {
      if (!token) return [];

      if (isManagement) {
        // Management sees all submissions for the selected category
        const res = await fetch(`http://localhost:3000/forms/type/${categoryFilter}/submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json() as Promise<Submission[]>;
      }

      if (isTechLead && leadField) {
        // Tech Lead sees VERIFIED applicants for their field
        const res = await fetch(`http://localhost:3000/forms/field/${leadField.name}/verified`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch verified applications");
        return res.json() as Promise<Submission[]>;
      }

      return [];
    },
    enabled: !!token && !!user
  });

  // Verify Application (Management)
  const verifyMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const res = await fetch(`http://localhost:3000/forms/submissions/${submissionId}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to verify");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Application approved! User has been added to their selected teams.");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: () => toast.error("Failed to verify application")
  });

  // Approve Application (Tech Lead)
  const approveMutation = useMutation({
    mutationFn: async ({ submissionId, fieldId }: { submissionId: string, fieldId: string }) => {
      const res = await fetch(`http://localhost:3000/forms/submissions/${submissionId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fieldId })
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Member added to team! ID: ${data.membershipId}`);
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: () => toast.error("Failed to approve application")
  });

  // Reject/Update Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`http://localhost:3000/forms/submissions/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: () => toast.error("Failed to update status")
  });

  // Client-side filtering
  const filteredApplications = applications?.filter(app => {
    if (filter === "ALL") return true;
    if (isTechLead) return true; // Tech leads only see relevant ones anyway
    return app.status === filter;
  });


  if (isUserLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {categoryFilter === 'MEMBERSHIP' ? 'Membership Applications' :
                  categoryFilter === 'RECRUITMENT' ? 'Recruitment Submissions' :
                    categoryFilter === 'EVENT_REGISTRATION' ? 'Event Registrations' :
                      categoryFilter === 'FEEDBACK' ? 'Feedback & Surveys' : 'Form Submissions'}
              </h1>
              <p className="text-muted-foreground">
                {isManagement ? "Manage and Verify Applications" : `Review Candidates for ${leadField?.name || 'Your Team'}`}
              </p>
            </div>

            {isManagement && (
              <div className="flex gap-4">
                {/* Category Filter */}
                <div className="w-[200px]">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBERSHIP">Membership</SelectItem>
                      <SelectItem value="RECRUITMENT">Recruitment</SelectItem>
                      <SelectItem value="EVENT_REGISTRATION">Events</SelectItem>
                      <SelectItem value="FEEDBACK">Feedback</SelectItem>
                      <SelectItem value="GENERAL">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {isTechLead && (
              <Badge variant="outline" className="text-base px-4 py-1">
                {leadField?.name} Team Lead
              </Badge>
            )}
          </div>

          {/* Stats / Tabs */}
          {isManagement && (
            <div className="grid sm:grid-cols-4 gap-4 mb-8">
              {["PENDING", "VERIFIED", "APPROVED", "REJECTED"].map((status) => (
                <Card
                  key={status}
                  className={`cursor-pointer hover:shadow-md transition-all ${filter === status ? 'border-primary' : ''}`}
                  onClick={() => setFilter(status)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground capitalize">{status.toLowerCase()}</p>
                      <Badge variant="secondary">{applications?.filter(a => a.status === status).length || 0}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List */}
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin mr-2" /> Loading submissions...</div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications?.length === 0 && <p className="text-center text-muted-foreground py-8">No applications found.</p>}
                  {filteredApplications?.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-google-blue/10 text-google-blue">
                            {app.data.fullName ? app.data.fullName[0] : (app.user?.fullName?.[0] || 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{app.data.fullName || app.user?.fullName}</h4>
                            {app.form?.title && <Badge variant="outline" className="text-[10px] py-0">{app.form.title}</Badge>}
                          </div>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>{app.data.year} Year</span> • <span>{app.data.major}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Array.isArray(app.data.technicalFields)
                              ? app.data.technicalFields.slice(0, 2).map((f: string) => (
                                <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                              ))
                              : app.data.technicalFields && <Badge variant="secondary" className="text-[10px]">{app.data.technicalFields}</Badge>
                            }
                            {Array.isArray(app.data.nonTechnicalFields)
                              ? app.data.nonTechnicalFields.slice(0, 2).map((f: string) => (
                                <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>
                              ))
                              : app.data.nonTechnicalFields && <Badge variant="outline" className="text-[10px]">{app.data.nonTechnicalFields}</Badge>
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant={app.status === 'VERIFIED' ? 'default' : 'secondary'}>{app.status}</Badge>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                              <DialogDescription>submitted on {new Date(app.createdAt).toLocaleDateString()}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                              <div className="flex items-center gap-4 mb-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarFallback className="text-xl">{app.data.fullName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-bold">{app.data.fullName}</h3>
                                  <p className="text-muted-foreground">{app.data.email}</p>
                                  <p className="text-sm">{app.data.university} • {app.data.regNo}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Technical Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(app.data.technicalFields)
                                    ? app.data.technicalFields.map((f: string) => (
                                      <Badge key={f} className="bg-google-blue/10 text-google-blue">{f}</Badge>
                                    ))
                                    : (app.data.technicalFields ? <Badge className="bg-google-blue/10 text-google-blue">{app.data.technicalFields}</Badge> : "None")
                                  }
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Non-Technical Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(app.data.nonTechnicalFields)
                                    ? app.data.nonTechnicalFields.map((f: string) => (
                                      <Badge key={f} className="bg-google-green/10 text-google-green">{f}</Badge>
                                    ))
                                    : (app.data.nonTechnicalFields ? <Badge className="bg-google-green/10 text-google-green">{app.data.nonTechnicalFields}</Badge> : "None")
                                  }
                                </div>
                              </div>

                              <div className="bg-muted p-3 rounded-md">
                                <p className="text-sm font-semibold">Why Join?</p>
                                <p className="text-sm text-muted-foreground">{app.data.whyJoin}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                              {isManagement && app.status === 'PENDING' && (
                                <>
                                  <Button
                                    className="flex-1 bg-google-green hover:bg-google-green/90"
                                    onClick={() => verifyMutation.mutate(app.id)}
                                    disabled={verifyMutation.isPending}
                                  >
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Approve Membership
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateStatusMutation.mutate({ id: app.id, status: "REJECTED" })}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}

                              {app.status === 'APPROVED' && (
                                <p className="text-sm text-center w-full text-google-green font-medium flex items-center justify-center gap-2">
                                  <CheckCircle className="w-4 h-4" /> Application Approved
                                </p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MembershipApplications;
