import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  coverImage: string | null;
  registrationLink: string | null;
  location: string | null;
  type: string;
}

const EventsSection = () => {
  const navigate = useNavigate();
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", "public"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/events");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Event[]>;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      full: date.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-google-red/5 skew-x-12 -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-google-red/10 text-google-red text-sm font-medium mb-4">
              <Calendar className="w-3 h-3 inline mr-1" />
              Upcoming Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Don't Miss Out
            </h2>
          </div>
          <Button variant="outline" className="group shrink-0" onClick={() => navigate('/events')}>
            View All Events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.slice(0, 3).map((event, index) => {
              const date = formatDate(event.date);
              return (
                <div
                  key={event.id}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl hover:border-google-red/20 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                      src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px] shadow-lg">
                      <span className="block text-xs font-medium text-google-red uppercase">{date.month}</span>
                      <span className="block text-xl font-bold text-foreground">{date.day}</span>
                    </div>
                    <Badge className="absolute bottom-4 left-4 z-20 bg-google-red hover:bg-google-red/90 border-none">
                      {event.type || "Workshop"}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-google-red transition-colors line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{date.full}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{event.location || "TBA"}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                      {event.description}
                    </p>

                    <Button className="w-full group/btn" variant="outline" asChild>
                      <a href={event.registrationLink || "#"} target="_blank" rel="noopener noreferrer">
                        Register Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
            {events?.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No upcoming events scheduled.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
