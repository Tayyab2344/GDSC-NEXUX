import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Download, Filter, Calendar, Users, CheckCircle, 
  XCircle, Clock, TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AttendanceDashboard = () => {
  const { fieldId } = useParams();

  const stats = {
    totalSessions: 12,
    avgAttendance: 78,
    totalMembers: 20,
    perfectAttendance: 5,
  };

  const sessions = [
    { id: 1, title: "React Hooks Deep Dive", date: "Dec 13, 2024", attended: 18, total: 20 },
    { id: 2, title: "State Management", date: "Dec 11, 2024", attended: 16, total: 20 },
    { id: 3, title: "Introduction to React", date: "Dec 9, 2024", attended: 19, total: 20 },
  ];

  const memberAttendance = [
    { name: "Alex Johnson", email: "alex@example.com", attended: 12, total: 12, percentage: 100 },
    { name: "Sarah Chen", email: "sarah@example.com", attended: 11, total: 12, percentage: 92 },
    { name: "Mike Wilson", email: "mike@example.com", attended: 10, total: 12, percentage: 83 },
    { name: "Emily Davis", email: "emily@example.com", attended: 9, total: 12, percentage: 75 },
    { name: "John Doe", email: "john@example.com", attended: 7, total: 12, percentage: 58 },
  ];

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) {
      return <Badge className="bg-google-green/10 text-google-green border-google-green/20">Excellent</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-google-blue/10 text-google-blue border-google-blue/20">Good</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-google-yellow/10 text-google-yellow border-google-yellow/20">Average</Badge>;
    } else {
      return <Badge className="bg-google-red/10 text-google-red border-google-red/20">Low</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Attendance Dashboard</h1>
              <p className="text-muted-foreground">Frontend Development • Track member attendance</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalSessions}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-google-blue" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Attendance</p>
                    <p className="text-3xl font-bold text-google-green">{stats.avgAttendance}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-google-green" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalMembers}</p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Perfect Attendance</p>
                    <p className="text-3xl font-bold text-google-yellow">{stats.perfectAttendance}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-google-yellow" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Member Attendance */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Member Attendance</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-10 w-48" />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {memberAttendance.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-google-blue/10 text-google-blue">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-32">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-muted-foreground">
                                {member.attended}/{member.total}
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {member.percentage}%
                              </span>
                            </div>
                            <Progress value={member.percentage} className="h-2" />
                          </div>
                          {getAttendanceBadge(member.percentage)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Sessions</CardTitle>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-4 rounded-lg border border-border">
                        <h4 className="font-medium text-foreground mb-1">{session.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{session.date}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {session.attended}/{session.total}
                            </span>
                          </div>
                          <Badge variant="secondary">
                            {Math.round((session.attended / session.total) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
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

export default AttendanceDashboard;
