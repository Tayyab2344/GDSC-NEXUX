import { API_BASE_URL } from '@/config/api';
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Search, Image as ImageIcon, ExternalLink, Calendar, MapPin, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageTitle } from "@/hooks/use-page-title";

interface GalleryItem {
    id: string;
    url: string;
    title?: string;
    eventName?: string;
    location?: string;
    type: string;
    createdAt: string;
}

const Gallery = () => {
    usePageTitle("Gallery");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    const { data: items, isLoading } = useQuery({
        queryKey: ["gallery"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/gallery`);
            if (!res.ok) throw new Error("Failed to fetch gallery");
            const data = await res.json() as GalleryItem[];
            return data.filter(item => item.title !== 'BANNER');
        }
    });

    const filteredItems = items?.filter(item =>
        item.eventName?.toLowerCase().includes(search.toLowerCase()) ||
        item.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Moments in Motion</h1>
                            <p className="text-muted-foreground">Reliving the best events from GDSC Nexus</p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    placeholder="Search events..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex bg-muted p-1 rounded-lg border">
                                <Button
                                    variant={view === 'grid' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => setView('grid')}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={view === 'list' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => setView('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <div className={view === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                        }>
                            {filteredItems?.map((item) => (
                                <Card key={item.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500">
                                    <a href={item.url} target="_blank" rel="noreferrer" className="block relative aspect-square overflow-hidden cursor-zoom-in">
                                        <img
                                            src={item.url}
                                            alt={item.eventName || "Gallery image"}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <Badge className="bg-google-blue text-white border-none mb-3">
                                                    {item.type || 'Event'}
                                                </Badge>
                                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.eventName || item.title}</h3>
                                                <div className="flex items-center gap-4 text-white/80 text-sm">
                                                    {item.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {item.location}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredItems?.length === 0 && (
                        <div className="text-center py-24">
                            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-display font-medium text-muted-foreground">No memories found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your search query</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Gallery;
