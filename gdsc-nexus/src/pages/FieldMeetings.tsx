import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Video, Calendar, Clock, Users, Play, CheckCircle, ArrowLeft } from "lucide-react";

const FieldMeetings = () => {
  const { fieldId } = useParams();

  const meetings = {
    live: [
      {
        id: 1,
        title: "React Hooks Deep Dive",
        host: "Alex Johnson",
        participants: 18,
        startedAt: "2:45 PM",
        duration: "45 min",
      },
    ],
    upcoming: [
      {
        id: 2,
        title: "Code Review Session",
        host: "Sarah Chen",
        date: "Dec 16, 2024",
        time: "2:00 PM",
        duration: "1 hour",
        attendees: 12,
      },
      {
        id: 3,
        title: "Project Kickoff Meeting",
        host: "Mike Wilson",
        date: "Dec 18, 2024",
        time: "10:00 AM",
        duration: "30 min",
        attendees: 8,
      },
    ],
    past: [
      {
        id: 4,
        title: "Introduction to React",
        host: "Alex Johnson",
        date: "Dec 10, 2024",
        duration: "1 hour",
        attendees: 22,
        attended: true,
      },
      {
        id: 5,
        title: "State Management Workshop",
        host: "Sarah Chen",
        date: "Dec 8, 2024",
        duration: "1.5 hours",
        attendees: 19,
        attended: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link to={`/teams/web/fields/${fieldId}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Field Meetings</h1>
                <p className="text-muted-foreground">Frontend Development</p>
              </div>
            </div>
          </div>

          {/* Live Meetings */}
          {meetings.live.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-google-red animate-pulse" />
                Live Now
              </h2>
              <div className="grid gap-4">
                {meetings.live.map((meeting) => (
                  <Card key={meeting.id} className="border-google-red/30 bg-google-red/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-google-red/10 flex items-center justify-center">
                            <Video className="w-6 h-6 text-google-red" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{meeting.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Hosted by {meeting.host} • Started at {meeting.startedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{meeting.participants} participants</p>
                            <p className="text-sm text-muted-foreground">{meeting.duration} elapsed</p>
                          </div>
                          <Link to={`/fields/${fieldId}/class/${meeting.id}`}>
                            <Button variant="googleRed" className="gap-2">
                              <Play className="w-4 h-4" />
                              Join Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Meetings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Meetings
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {meetings.upcoming.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-google-blue/10 flex items-center justify-center">
                          <Video className="w-5 h-5 text-google-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                          <p className="text-sm text-muted-foreground">Hosted by {meeting.host}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {meeting.attendees}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add to Calendar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Past Meetings */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Past Meetings
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {meetings.past.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-muted">
                            {meeting.host.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-foreground">{meeting.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {meeting.date} • {meeting.duration} • {meeting.attendees} attendees
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {meeting.attended ? (
                          <Badge className="bg-google-green/10 text-google-green border-google-green/20">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Attended
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Missed</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          View Recording
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FieldMeetings;
