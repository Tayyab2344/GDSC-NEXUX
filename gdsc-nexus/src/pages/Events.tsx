import { useQuery } from "@tanstack/react-query";
import { usePageTitle } from "@/hooks/use-page-title";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, ExternalLink, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  coverImage: string | null;
  registrationLink: string | null;
  location: string | null;
  tags: string[];
  type: string;
}

const Events = () => {
  usePageTitle("Events");
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events?.filter((e: Event) => new Date(e.date) >= today) || [];
  const pastEvents = events?.filter((e: Event) => new Date(e.date) < today) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="secondary" className="bg-google-red/10 text-google-red hover:bg-google-red/20 px-4 py-1 rounded-full">
            Events & Workshops
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Learn, Build, Connect
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our workshops, hackathons, and tech talks to level up your skills and connect with the developer community.
          </p>
        </div>

        <div className="mb-12">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="space-y-8">
              {isLoading ? (
                <div className="text-center py-12">Loading events...</div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No upcoming events scheduled. Stay tuned!</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {upcomingEvents.map((event: Event) => (
                    <div key={event.id} className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full group">
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-muted">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Calendar className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-google-blue text-white hover:bg-google-blue/90">
                            {event.type || "Workshop"}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-6 line-clamp-2 flex-grow">
                          {event.description}
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="grid grid-cols-2 gap-2 text-sm text-foreground/80">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-google-blue" />
                              <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-google-green" />
                              <span>{new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-google-red" />
                              <span className="truncate">{event.location || "TBA"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-google-yellow" />
                              <span>Limited Seats</span>
                            </div>
                          </div>
                        </div>

                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {event.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs text-muted-foreground bg-muted/50 border-muted">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button className="flex-1 bg-google-green hover:bg-google-green/90 text-white" asChild>
                            <a href={event.registrationLink || "#"} target="_blank" rel="noopener noreferrer">
                              Register Now
                            </a>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <a href={event.registrationLink || "#"} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              <div className="grid md:grid-cols-2 gap-8 opacity-75">
                {pastEvents.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">No past events found.</div>
                ) : (
                  pastEvents.map((event: Event) => (
                    <div key={event.id} className="bg-card border rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all">
                      {/* Simplified card for past events */}
                      <div className="h-48 bg-muted relative">
                        {event.coverImage && <img src={event.coverImage} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white font-medium">View Recap</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Held on {new Date(event.date).toLocaleDateString()}
                        </p>
                        <Button variant="outline" className="w-full">Event Concluded</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-border/50">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Host an Event?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Have an idea for a workshop or tech talk? We'd love to help you organize it! Reach out to our community leads.
          </p>
          <Button size="lg" className="bg-google-green hover:bg-google-green/90 text-white">
            Propose an Event
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
