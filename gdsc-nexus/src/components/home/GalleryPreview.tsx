import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface GalleryItem {
  id: string;
  url: string;
  title: string | null;
  type: string;
}

const GalleryPreview = () => {
  const navigate = useNavigate();
  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ["gallery", "preview"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/gallery");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<GalleryItem[]>;
    }
  });

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-google-yellow/10 text-google-yellow text-sm font-medium mb-4">
              <Camera className="w-3 h-3 inline mr-1" />
              Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Captured <span className="text-google-blue">Moments</span>
            </h2>
          </div>
          <Button variant="outline" className="group shrink-0" onClick={() => navigate('/gallery')}>
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading gallery...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages?.slice(0, 5).map((image, index) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer animate-fade-in ${index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`relative ${index === 0 ? "aspect-square md:aspect-video" : "aspect-square"}`}>
                  <img
                    src={image.url}
                    alt={image.title || "Gallery Image"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 rounded-full bg-background/90 text-sm font-medium text-foreground">
                      {image.type || "General"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {galleryImages?.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground p-12">
                No images found.
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Photos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">25</div>
            <div className="text-sm text-muted-foreground">Albums</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">50+</div>
            <div className="text-sm text-muted-foreground">Events Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
