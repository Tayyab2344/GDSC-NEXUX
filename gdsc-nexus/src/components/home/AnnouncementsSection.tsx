import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Pin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: string;
  coverImage: string | null;
  creator: {
    fullName: string;
    role: string;
    avatarUrl: string | null;
  };
}

const AnnouncementsSection = () => {
  const navigate = useNavigate();
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements", "public"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/announcements");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Announcement[]>;
    }
  });

  if (isLoading) {
    return <div className="py-24 text-center">Loading updates...</div>;
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Events': return "bg-google-red/10 text-google-red";
      case 'Learning': return "bg-google-blue/10 text-google-blue";
      case 'Membership': return "bg-google-green/10 text-google-green";
      case 'Community': return "bg-google-yellow/10 text-google-yellow";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-google-green/10 text-google-green text-sm font-medium mb-4">
              <Bell className="w-3 h-3 inline mr-1" />
              Latest Updates
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Announcements
            </h2>
          </div>
          <Button variant="outline" className="group shrink-0" onClick={() => navigate('/announcements')}>
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements?.slice(0, 3).map((announcement, index) => (
            <div
              key={announcement.id}
              className="group bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar */}
                <img
                  src={announcement.creator.avatarUrl || `https://ui-avatars.com/api/?name=${announcement.creator.fullName}`}
                  alt={announcement.creator.fullName}
                  className="w-12 h-12 rounded-full border-2 border-border shrink-0"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(announcement.category)}>
                      {announcement.category || "General"}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(announcement.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {announcement.content}
                  </p>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{announcement.creator.fullName}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{announcement.creator.role.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Optional Image Thumbnail if present */}
                {announcement.coverImage && (
                  <div className="hidden md:block w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img src={announcement.coverImage} className="w-full h-full object-cover" alt="" />
                  </div>
                )}

                {/* Arrow */}
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 hidden sm:block self-center" />
              </div>
            </div>
          ))}
          {announcements?.length === 0 && (
            <p className="text-center text-muted-foreground">No recent announcements.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
