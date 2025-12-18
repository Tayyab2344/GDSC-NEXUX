import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, Download, Filter, UserPlus, ExternalLink, Mail,
  Briefcase, GraduationCap, Calendar, Users
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AlumniManagement = () => {
  const stats = {
    total: 156,
    thisYear: 24,
    employed: 142,
    mentors: 18,
  };

  const alumni = [
    {
      id: 1,
      name: "David Park",
      email: "david.park@google.com",
      graduationYear: "2023",
      company: "Google",
      role: "Software Engineer",
      team: "Web Development",
      linkedin: "https://linkedin.com/in/davidpark",
      isMentor: true,
    },
    {
      id: 2,
      name: "Jennifer Lee",
      email: "jennifer.lee@meta.com",
      graduationYear: "2022",
      company: "Meta",
      role: "Product Designer",
      team: "UI/UX Design",
      linkedin: "https://linkedin.com/in/jenniferlee",
      isMentor: false,
    },
    {
      id: 3,
      name: "Michael Chang",
      email: "m.chang@amazon.com",
      graduationYear: "2023",
      company: "Amazon",
      role: "Full Stack Developer",
      team: "Web Development",
      linkedin: "https://linkedin.com/in/michaelchang",
      isMentor: true,
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@microsoft.com",
      graduationYear: "2021",
      company: "Microsoft",
      role: "ML Engineer",
      team: "AI/ML",
      linkedin: "https://linkedin.com/in/sarahwilliams",
      isMentor: true,
    },
    {
      id: 5,
      name: "James Wilson",
      email: "james.wilson@startup.com",
      graduationYear: "2022",
      company: "TechStartup",
      role: "Co-Founder & CTO",
      team: "Mobile Development",
      linkedin: "https://linkedin.com/in/jameswilson",
      isMentor: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alumni Network</h1>
              <p className="text-muted-foreground">Manage and connect with society alumni</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="googleBlue" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Alumni
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Alumni</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-google-blue" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Class of 2024</p>
                    <p className="text-3xl font-bold text-google-green">{stats.thisYear}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-google-green" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Employed</p>
                    <p className="text-3xl font-bold text-foreground">{stats.employed}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Mentors</p>
                    <p className="text-3xl font-bold text-google-yellow">{stats.mentors}</p>
                  </div>
                  <Users className="w-8 h-8 text-google-yellow" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search alumni..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="mobile">Mobile Development</SelectItem>
                <SelectItem value="ai">AI/ML</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>

          {/* Alumni List */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {alumni.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-google-blue/10 text-google-blue">
                          {person.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{person.name}</h4>
                          {person.isMentor && (
                            <Badge className="bg-google-yellow/10 text-google-yellow border-google-yellow/20">
                              Mentor
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{person.role} at {person.company}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            Class of {person.graduationYear}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {person.team}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`mailto:${person.email}`}>
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniManagement;
