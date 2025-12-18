import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Edit, Mail, Calendar, Users, BookOpen, Award, CheckCircle,
  Code, Smartphone, Brain
} from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  usePageTitle("Profile");
  const user = {
    name: "John Doe",
    email: "john.doe@university.edu",
    avatar: "",
    role: "Member",
    joinedAt: "October 2024",
    university: "State University",
    major: "Computer Science",
    year: "3rd Year",
  };

  const teams = [
    { name: "Web Development", role: "Member", icon: Code, color: "google-blue" },
    { name: "Mobile Development", role: "Member", icon: Smartphone, color: "google-green" },
  ];

  const fields = [
    { name: "Frontend Development", team: "Web Development", progress: 65 },
    { name: "React Native", team: "Mobile Development", progress: 40 },
  ];

  const stats = {
    classesAttended: 24,
    classesTotal: 30,
    eventsAttended: 8,
    achievements: 5,
  };

  const achievements = [
    { name: "First Class", description: "Attended your first class", icon: BookOpen },
    { name: "Team Player", description: "Joined 2 teams", icon: Users },
    { name: "Rising Star", description: "Completed 10 classes", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl bg-google-blue text-white">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{user.university}</span>
                        <span>•</span>
                        <span>{user.major}</span>
                        <span>•</span>
                        <span>{user.year}</span>
                      </div>
                    </div>
                    <Link to="/settings">
                      <Button variant="outline" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-google-green/10 text-google-green border-google-green/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active Member
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {user.joinedAt}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Teams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    My Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {teams.map((team, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-${team.color}/10 flex items-center justify-center`}>
                          <team.icon className={`w-6 h-6 text-${team.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{team.name}</h4>
                          <Badge variant="secondary" className="text-xs">{team.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Field Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">{field.name}</h4>
                            <p className="text-sm text-muted-foreground">{field.team}</p>
                          </div>
                          <span className="text-sm font-medium text-foreground">{field.progress}%</span>
                        </div>
                        <Progress value={field.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="text-center p-4 rounded-lg border border-border"
                      >
                        <div className="w-12 h-12 rounded-full bg-google-yellow/10 flex items-center justify-center mx-auto mb-3">
                          <achievement.icon className="w-6 h-6 text-google-yellow" />
                        </div>
                        <h4 className="font-medium text-foreground text-sm">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Classes Attended</span>
                      <span className="font-medium text-foreground">
                        {stats.classesAttended}/{stats.classesTotal}
                      </span>
                    </div>
                    <Progress value={(stats.classesAttended / stats.classesTotal) * 100} className="h-2" />
                  </div>
                  <div className="flex justify-between py-2 border-t border-border">
                    <span className="text-muted-foreground">Events Attended</span>
                    <span className="font-medium text-foreground">{stats.eventsAttended}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-border">
                    <span className="text-muted-foreground">Achievements</span>
                    <span className="font-medium text-foreground">{stats.achievements}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-border">
                    <span className="text-muted-foreground">Teams Joined</span>
                    <span className="font-medium text-foreground">{teams.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/teams" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Users className="w-4 h-4" />
                      Explore Teams
                    </Button>
                  </Link>
                  <Link to="/events" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      View Events
                    </Button>
                  </Link>
                  <Link to="/settings" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Settings
                    </Button>
                  </Link>
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

export default Profile;
