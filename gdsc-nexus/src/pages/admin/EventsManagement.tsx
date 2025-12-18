import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Upload, Image as ImageIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EventsManagement = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        registrationLink: ""
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const createMutation = useMutation({
        mutationFn: async () => {
            const body = new FormData();
            body.append("title", formData.title);
            body.append("description", formData.description);
            body.append("date", formData.date);
            if (formData.registrationLink) body.append("registrationLink", formData.registrationLink);
            if (file) body.append("file", file);

            const res = await fetch("http://localhost:3000/events", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body
            });
            if (!res.ok) throw new Error("Failed to create event");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Event created successfully!");
            queryClient.invalidateQueries({ queryKey: ["events"] });
            navigate("/events");
        },
        onError: () => toast.error("Failed to create event")
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Event</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Event Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Google Cloud Hero"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Event details..."
                                    className="min-h-[120px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date & Time</Label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Registration Link (Optional)</Label>
                                    <Input
                                        value={formData.registrationLink}
                                        onChange={e => setFormData({ ...formData, registrationLink: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <div
                                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="max-h-64 rounded shadow-sm object-contain" />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>Click to upload cover image</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                variant="googleBlue"
                                size="lg"
                                onClick={() => createMutation.mutate()}
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? "Creating Event..." : "Publish Event"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EventsManagement;
