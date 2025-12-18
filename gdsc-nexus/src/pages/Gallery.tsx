import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { usePageTitle } from "@/hooks/use-page-title";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Camera, Play, X, ChevronLeft, ChevronRight, Upload, MapPin, Calendar, Loader2, Trash2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // Fetch Gallery Items
  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ["gallery", "all"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/gallery");
      if (!res.ok) throw new Error("Failed to fetch");
      const items = await res.json() as GalleryItem[];
      // Filter out banners based on title tag
      return items.filter(item => item.title !== 'BANNER');
    }
  });

  // Fetch User to check permissions
  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      if (!token) return null;
      try {
        const res = await fetch("http://localhost:3000/users/profile?includeFields=true", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return null;
        return res.json();
      } catch { return null; }
    },
    enabled: !!token
  });

  const isMarketingOrLead = user?.role === 'TEAM_LEAD' || user?.role === 'CO_LEAD' || user?.role === 'FACULTY_HEAD';

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`http://localhost:3000/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Item deleted");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setSelectedImage(null);
    },
    onError: () => toast.error("Failed to delete item")
  });

  const currentIndex = selectedImage && galleryItems ? galleryItems.findIndex(item => item.id === selectedImage.id) : -1;

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage || !galleryItems) return;
    const newIndex = direction === "prev"
      ? (currentIndex - 1 + galleryItems.length) % galleryItems.length
      : (currentIndex + 1) % galleryItems.length;
    setSelectedImage(galleryItems[newIndex]);
  };

  return (
    <div className="min-h-screen bg-background" >
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-google-yellow/10 via-background to-google-red/10">
          <div className="container mx-auto text-center">
            <Badge className="mb-4 bg-google-yellow/10 text-google-yellow border-google-yellow/20">
              <Camera className="h-3 w-3 mr-1" />
              Gallery
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Captured Moments
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Relive the best moments from our events, workshops, and community gatherings.
            </p>


          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-end mb-6">
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="masonry">Masonry</TabsTrigger>
                </TabsList>
              </div>

              {isLoading ? (
                <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>
              ) : (
                <>
                  <TabsContent value="grid">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryItems?.map((item) => (
                        <div
                          key={item.id}
                          className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                          onClick={() => setSelectedImage(item)}
                        >
                          {item.type === 'VIDEO' ? (
                            <div className="w-full h-full bg-black flex items-center justify-center">
                              <video src={item.url} className="w-full h-full object-cover opacity-80" />
                              <Play className="absolute w-12 h-12 text-white opacity-80" />
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title || item.eventName || "Gallery Image"}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-white font-medium truncate">{item.eventName || "Untitled"}</p>
                              <p className="text-white/70 text-sm flex items-center gap-1">
                                {item.location && <><MapPin className="w-3 h-3" /> {item.location}</>}
                              </p>
                            </div>
                          </div>
                          {isMarketingOrLead && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 z-20 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    {item.type === 'VIDEO' ? ' video' : ' image'} from the gallery.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(item.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      ))}
                      {galleryItems?.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground">No media found. Be the first to upload!</div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Masonry Layout Logic would be similar, simplified to Grid for now to ensure consistency */}
                  <TabsContent value="masonry">
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                      {galleryItems?.map((item) => (
                        <div key={item.id} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => setSelectedImage(item)}>
                          <img src={item.url} alt={item.eventName} className="w-full h-auto object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <p className="text-white text-sm">{item.eventName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </section >

        {/* Lightbox */}
        < Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl p-0 bg-black border-none overflow-hidden">
            <div className="relative flex items-center justify-center h-[80vh] bg-black">
              {selectedImage?.type === 'VIDEO' ? (
                <video controls src={selectedImage.url} className="max-w-full max-h-full" />
              ) : (
                <img
                  src={selectedImage?.url}
                  alt={selectedImage?.eventName || "Gallery Image"}
                  className="max-w-full max-h-full object-contain"
                />
              )}

              <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20" onClick={() => setSelectedImage(null)}>
                <X className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="absolute left-4 z-10 text-white hover:bg-white/20" onClick={() => navigateImage("prev")}>
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-4 z-10 text-white hover:bg-white/20" onClick={() => navigateImage("next")}>
                <ChevronRight className="h-8 w-8" />
              </Button>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white text-lg font-medium">{selectedImage?.eventName}</p>
                <p className="text-white/70 flex gap-2 items-center">
                  {selectedImage?.location && <><MapPin className="w-3 h-3" /> {selectedImage.location}</>}
                  {selectedImage && <><Calendar className="w-3 h-3 ml-2" /> {new Date(selectedImage.createdAt).toLocaleDateString()}</>}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog >
      </main >
      <Footer />
    </div >
  );
};

export default Gallery;
