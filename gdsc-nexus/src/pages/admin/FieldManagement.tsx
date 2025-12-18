import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, Plus, UserPlus, UserMinus, Crown, Shield, User,
  CheckCircle, XCircle, MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FieldManagement = () => {
  const { teamId } = useParams();

  const field = {
    name: "Frontend Development",
    teamName: "Web Development",
  };

  const members = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "lead", joinedAt: "Oct 2024" },
    { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "co-lead", joinedAt: "Nov 2024" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", role: "member", joinedAt: "Nov 2024" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "member", joinedAt: "Dec 2024" },
    { id: 5, name: "John Doe", email: "john@example.com", role: "member", joinedAt: "Dec 2024" },
  ];

  const pendingApplications = [
    { id: 1, name: "Chris Brown", email: "chris@example.com", appliedAt: "Dec 12, 2024" },
    { id: 2, name: "Lisa White", email: "lisa@example.com", appliedAt: "Dec 11, 2024" },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "lead":
        return <Crown className="w-4 h-4 text-google-yellow" />;
      case "co-lead":
        return <Shield className="w-4 h-4 text-google-blue" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "lead":
        return <Badge className="bg-google-yellow/10 text-google-yellow border-google-yellow/20">Lead</Badge>;
      case "co-lead":
        return <Badge className="bg-google-blue/10 text-google-blue border-google-blue/20">Co-Lead</Badge>;
      default:
        return <Badge variant="secondary">Member</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{field.teamName}</p>
              <h1 className="text-3xl font-bold text-foreground">{field.name}</h1>
              <p className="text-muted-foreground">Manage field members and applications</p>
            </div>
            <Button variant="googleBlue" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Members List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Members ({members.length})</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search members..." className="pl-10 w-64" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-google-blue/10 text-google-blue">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{member.name}</h4>
                              {getRoleBadge(member.role)}
                            </div>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">Joined {member.joinedAt}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Crown className="w-4 h-4 mr-2" />
                                Promote to Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="w-4 h-4 mr-2" />
                                Promote to Co-Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-google-red">
                                <UserMinus className="w-4 h-4 mr-2" />
                                Remove from Field
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Applications */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Pending Applications
                    <Badge variant="secondary">{pendingApplications.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingApplications.length > 0 ? (
                    <div className="space-y-4">
                      {pendingApplications.map((app) => (
                        <div key={app.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                              <AvatarFallback className="bg-muted">
                                {app.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-foreground">{app.name}</h4>
                              <p className="text-sm text-muted-foreground">{app.email}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">Applied {app.appliedAt}</p>
                          <div className="flex gap-2">
                            <Button variant="googleGreen" size="sm" className="flex-1 gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-1 text-google-red border-google-red/20 hover:bg-google-red/10">
                              <XCircle className="w-3 h-3" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No pending applications
                    </p>
                  )}
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

export default FieldManagement;
