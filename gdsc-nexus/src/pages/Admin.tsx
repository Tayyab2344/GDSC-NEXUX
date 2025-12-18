import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import { usePageTitle } from "@/hooks/use-page-title";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users, Shield, Settings, Search, UserPlus, MoreVertical,
  ChevronUp, ChevronDown, TrendingUp, Calendar, MessageSquare, FileText
} from "lucide-react";

const Admin = () => {
  usePageTitle("Admin Panel");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/users/admin-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.json();
    }
  });

  const { data: usersList } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.json();
    }
  });

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      "TEAM_LEAD": "bg-google-blue/10 text-google-blue",
      "CO_LEAD": "bg-google-green/10 text-google-green",
      "GENERAL_MEMBER": "bg-muted text-muted-foreground",
      "PRESIDENT": "bg-google-red/10 text-google-red",
      "FACULTY_HEAD": "bg-google-red/10 text-google-red"
    };
    return colors[role] || "bg-muted";
  };

  const getStatusBadge = (status: string) => {
    return status === "MEMBER" || status === "AUTHENTICATED"
      ? "bg-google-green/10 text-google-green"
      : "bg-google-yellow/10 text-google-yellow";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Badge className="mb-2 bg-google-red/10 text-google-red border-google-red/20">
              <Shield className="h-3 w-3 mr-1" />
              Admin Panel
            </Badge>
            <h1 className="text-3xl font-display font-bold">Administration</h1>
            <p className="text-muted-foreground">Manage users, teams, and platform settings</p>
          </div>
          <Button variant="google">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <div className="flex items-center text-google-green text-sm">
                  <ChevronUp className="h-4 w-4" />
                  12%
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Teams</p>
                  <p className="text-3xl font-bold">{stats?.activeTeams || 0}</p>
                </div>
                <Users className="h-8 w-8 text-google-blue/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Events This Month</p>
                  <p className="text-3xl font-bold">{stats?.eventsThisMonth || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-google-red/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages Today</p>
                  <p className="text-3xl font-bold">{stats?.messagesToday || 0}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-google-green/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="management" className="space-y-6">
          <TabsList>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/admin/memberships">
                <Card className="hover:border-google-blue/50 transition-colors cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 group-hover:text-google-blue">
                      <UserPlus className="h-5 w-5" />
                      Memberships
                    </CardTitle>
                    <CardDescription>Review and verify new applications</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/admin/teams">
                <Card className="hover:border-google-green/50 transition-colors cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 group-hover:text-google-green">
                      <Users className="h-5 w-5" />
                      Teams & Fields
                    </CardTitle>
                    <CardDescription>Manage team structures and leads</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link to="/admin/forms">
                <Card className="hover:border-google-yellow/50 transition-colors cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 group-hover:text-google-yellow">
                      <FileText className="h-5 w-5" />
                      Form Builder
                    </CardTitle>
                    <CardDescription>Create evaluation forms and surveys</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="lead">Leads</SelectItem>
                        <SelectItem value="colead">Co-Leads</SelectItem>
                        <SelectItem value="member">Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Fields/Teams</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList?.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {user.fullName ? user.fullName.split(' ').slice(0, 2).map((n: string) => n[0]).join('') : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadge(user.role)}>{user.role.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.fields && user.fields.length > 0
                            ? user.fields.map((f: any) => f.field.name).join(', ')
                            : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Team management interface coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Role Hierarchy</CardTitle>
                <CardDescription>Define permissions for each role level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { role: "Faculty Head", permissions: ["All permissions", "Manage all teams", "Global settings"], color: "google-red" },
                    { role: "President / Admin", permissions: ["Manage users", "Create events", "View analytics"], color: "google-blue" },
                    { role: "Team Lead", permissions: ["Manage team members", "Host meetings", "Post announcements"], color: "google-green" },
                    { role: "Co-Lead", permissions: ["Co-host meetings", "Manage team chat", "Review projects"], color: "google-yellow" },
                    { role: "Team Member", permissions: ["Access team resources", "Join meetings", "Team chat"], color: "muted" },
                    { role: "General User", permissions: ["View public content", "General chat", "Register for events"], color: "muted" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`w-1 h-full min-h-[60px] rounded-full bg-${item.color}`} />
                      <div className="flex-1">
                        <p className="font-semibold mb-2">{item.role}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Platform settings interface coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
