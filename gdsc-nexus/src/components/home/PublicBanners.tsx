import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, ExternalLink, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const PublicBanners = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

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

    const isMarketing = user?.fields?.some((f: any) => f.field.name === 'Marketing');

    // Fetch Banners
    const { data: banners, isLoading } = useQuery({
        queryKey: ["gallery", "banners"],
        queryFn: async () => {
            // We fetch all and filter client-side since the backend endpoint is generic
            // In a real app, we'd want a query param ?type=BANNER
            const res = await fetch("http://localhost:3000/gallery");
            if (!res.ok) throw new Error("Failed to fetch banners");
            const items = await res.json() as GalleryItem[];
            // Filter IN banners based on title tag
            return items.filter(item => item.title === 'BANNER');
        }
    });

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
            toast.success("Banner deleted");
            queryClient.invalidateQueries({ queryKey: ["gallery"] });
        },
        onError: () => toast.error("Failed to delete banner")
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    if (!banners || banners.length === 0) return null;

    return (
        <section className="bg-background border-b border-border/40">
            <div className="container mx-auto py-6 px-4">
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-google-blue border-google-blue/20 bg-google-blue/5">
                        <Megaphone className="w-3 h-3 mr-1" />
                        Featured
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground">Latest Updates from GDSC</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <Card key={banner.id} className="group relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-card/50">
                            {/* Delete Button for Marketing */}
                            {isMarketing && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 z-20 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove this banner from the home page.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => deleteMutation.mutate(banner.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            <a
                                href={banner.location || "#"}
                                target={banner.location ? "_blank" : "_self"}
                                rel="noreferrer"
                                className={`block relative aspect-[2/1] w-full overflow-hidden ${!banner.location ? 'cursor-default' : ''}`}
                                onClick={(e) => !banner.location && e.preventDefault()}
                            >
                                <img
                                    src={banner.url}
                                    alt={banner.eventName || "Banner"}
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                />
                                {(banner.eventName || banner.location) && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                        <h3 className="text-white font-semibold truncate pr-4">
                                            {banner.eventName}
                                        </h3>
                                        {banner.location && (
                                            <div className="flex items-center text-white/80 text-xs mt-1">
                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                Open Link
                                            </div>
                                        )}
                                    </div>
                                )}
                            </a>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PublicBanners;
