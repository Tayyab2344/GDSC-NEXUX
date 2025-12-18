import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Calendar, Clock, Users, Play, Lock, ExternalLink } from "lucide-react";

const upcomingMeetings = [
  {
    id: 1,
    title: "Web Team Weekly Standup",
    team: "Web Development",
    host: "Sarah Johnson",
    date: "Dec 10, 2025",
    time: "6:00 PM",
    duration: "1 hour",
    participants: 28,
    type: "Team Meeting",
    isLive: true
  },
  {
    id: 2,
    title: "React Advanced Patterns Workshop",
    team: "Web Development",
    host: "Mike Chen",
    date: "Dec 12, 2025",
    time: "5:00 PM",
    duration: "2 hours",
    participants: 45,
    type: "Workshop",
    isLive: false
  },
  {
    id: 3,
    title: "AI/ML Project Review",
    team: "AI/ML",
    host: "David Kim",
    date: "Dec 13, 2025",
    time: "7:00 PM",
    duration: "1.5 hours",
    participants: 18,
    type: "Review Session",
    isLive: false
  },
  {
    id: 4,
    title: "Flutter State Management Deep Dive",
    team: "Mobile Development",
    host: "Alex Rivera",
    date: "Dec 14, 2025",
    time: "4:00 PM",
    duration: "2 hours",
    participants: 32,
    type: "Workshop",
    isLive: false
  }
];

const recordings = [
  {
    id: 1,
    title: "Introduction to Next.js 14",
    team: "Web Development",
    host: "Sarah Johnson",
    date: "Nov 28, 2025",
    duration: "1h 45m",
    views: 234,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"
  },
  {
    id: 2,
    title: "Building ML Models with TensorFlow",
    team: "AI/ML",
    host: "Emma Wilson",
    date: "Nov 25, 2025",
    duration: "2h 10m",
    views: 189,
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"
  },
  {
    id: 3,
    title: "Flutter Animation Masterclass",
    team: "Mobile Development",
    host: "Priya Patel",
    date: "Nov 22, 2025",
    duration: "1h 30m",
    views: 156,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400"
  },
  {
    id: 4,
    title: "Game Physics in Unity",
    team: "Game Development",
    host: "Chris Lee",
    date: "Nov 20, 2025",
    duration: "2h 00m",
    views: 98,
    thumbnail: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400"
  }
];

const Meetings = () => {
  const getTeamColor = (team: string) => {
    const colors: Record<string, string> = {
      "Web Development": "bg-google-blue/10 text-google-blue",
      "Mobile Development": "bg-google-green/10 text-google-green",
      "AI/ML": "bg-google-red/10 text-google-red",
      "Game Development": "bg-google-yellow/10 text-google-yellow"
    };
    return colors[team] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-google-red/10 via-background to-google-blue/10">
          <div className="container mx-auto text-center">
            <Badge className="mb-4 bg-google-red/10 text-google-red border-google-red/20">
              <Video className="h-3 w-3 mr-1" />
              Classes & Meetings
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Learn in Real-Time
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join live classes, team meetings, and workshops. Can't make it? 
              Watch the recordings anytime.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="google" size="lg">
                <Video className="mr-2 h-5 w-5" />
                Join Live Session
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Meeting
              </Button>
            </div>
          </div>
        </section>

        {/* Meetings Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="recordings">Recordings</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {upcomingMeetings.map((meeting) => (
                    <Card key={meeting.id} className={`${meeting.isLive ? 'border-google-red border-2' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {meeting.isLive && (
                                <Badge className="bg-google-red text-white animate-pulse">
                                  🔴 LIVE NOW
                                </Badge>
                              )}
                              <Badge className={getTeamColor(meeting.team)}>
                                {meeting.team}
                              </Badge>
                              <Badge variant="outline">{meeting.type}</Badge>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{meeting.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {meeting.host}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {meeting.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {meeting.time} ({meeting.duration})
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {meeting.participants} registered
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {meeting.isLive ? (
                              <Button variant="googleRed">
                                <Video className="mr-2 h-4 w-4" />
                                Join Now
                              </Button>
                            ) : (
                              <>
                                <Button variant="outline">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Add to Calendar
                                </Button>
                                <Button variant="google">
                                  Register
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recordings">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recordings.map((recording) => (
                    <Card key={recording.id} className="group overflow-hidden">
                      <div className="relative">
                        <img 
                          src={recording.thumbnail} 
                          alt={recording.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                            <Play className="h-6 w-6" fill="currentColor" />
                          </Button>
                        </div>
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          {recording.duration}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <Badge className={`w-fit ${getTeamColor(recording.team)}`}>
                          {recording.team}
                        </Badge>
                        <CardTitle className="text-base line-clamp-2">{recording.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{recording.host}</span>
                          <span>{recording.views} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Premium Notice */}
                <Card className="mt-8 bg-gradient-to-r from-google-yellow/10 to-google-blue/10 border-google-yellow/30">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Lock className="h-8 w-8 text-google-yellow" />
                      <div>
                        <h3 className="font-semibold">Access All Recordings</h3>
                        <p className="text-sm text-muted-foreground">
                          Upgrade to Standard or Premium membership for unlimited access.
                        </p>
                      </div>
                    </div>
                    <Button variant="google">
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Host CTA */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">Want to Host a Session?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Team leads and co-leads can schedule and host meetings for their teams.
            </p>
            <Button variant="google" size="lg">
              <ExternalLink className="mr-2 h-5 w-5" />
              Request to Host
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Meetings;
