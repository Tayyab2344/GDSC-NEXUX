import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Calendar as CalendarIcon, User as UserIcon, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  coverImage: string | null;
  createdAt: string;
  creator: {
    fullName: string;
    role: string;
  };
}

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/announcements`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return res.json();
    }
  });

  const categories = ["All", "Events", "Learning", "Membership", "General", "Community"];

  const filteredAnnouncements = announcements?.filter((a: Announcement) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="secondary" className="bg-google-green/10 text-google-green hover:bg-google-green/20 px-4 py-1 rounded-full">
            <Bell className="w-3 h-3 mr-2" />
            Announcements
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Stay Updated
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Latest news, updates, and important information from GDSC Nexus.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            className="pl-12 py-6 rounded-full border-muted-foreground/20 shadow-sm focus-visible:ring-google-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-6 ${selectedCategory === cat
                ? "bg-google-blue hover:bg-google-blue/90 text-white border-transparent"
                : "border-muted-foreground/20 text-muted-foreground hover:text-foreground"
                }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Loading announcements...</div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No announcements found.</div>
          ) : (
            filteredAnnouncements.map((item: Announcement) => (
              <div
                key={item.id}
                className="group bg-card border rounded-2xl p-6 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                <div className="flex-grow space-y-4 relative z-10">
                  <Badge
                    variant="secondary"
                    className={`
                                            ${item.category === 'Events' ? 'bg-google-red/10 text-google-red' :
                        item.category === 'Learning' ? 'bg-google-blue/10 text-google-blue' :
                          item.category === 'Membership' ? 'bg-google-green/10 text-google-green' :
                            'bg-gray-100 text-gray-600'}
                                        `}
                  >
                    {item.category || "General"}
                  </Badge>

                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-google-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-2">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{item.creator?.fullName}</span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                        {item.creator?.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="md:hidden flex justify-end">
                    <Button variant="ghost" size="sm" className="text-google-blue hover:text-google-blue/80 p-0 h-auto font-medium">
                      Read More <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                {item.coverImage && (
                  <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="absolute bottom-6 right-6 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="text-google-blue hover:text-google-blue/80 p-0 h-auto font-medium">
                    Read More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Announcements;
