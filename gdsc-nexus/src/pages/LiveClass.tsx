import { API_BASE_URL } from '@/config/api';
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Video, ExternalLink, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";

interface ClassDetail {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    durationMin: number;
    meetingUrl: string;
    instructor: {
        id: string;
        fullName: string;
        avatarUrl: string;
    };
    _count?: {
        attendance: number;
    };
}

const LiveClass = () => {
    const { fieldId, classId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [isJoining, setIsJoining] = useState(false);

    const { data: classData, isLoading, error } = useQuery({
        queryKey: ["class", classId],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch class details");
            return res.json() as Promise<ClassDetail>;
        }
    });

    const handleJoinClass = async () => {
        if (!classData?.meetingUrl) {
            toast.error("No meeting URL available");
            return;
        }

        try {
            setIsJoining(true);
            // Mark attendance
            const res = await fetch(`${API_BASE_URL}/classes/${classId}/join`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("Joined class & attendance marked!");
            } else {
                console.error("Failed to mark attendance");
            }

            // Open Jitsi in new tab
            window.open(classData.meetingUrl, "_blank");
        } catch (error) {
            console.error("Error joining class:", error);
            toast.error("Something went wrong while joining");
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Class</h2>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
                <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>

                <Card className="w-full shadow-lg border-t-4 border-t-google-blue">
                    <CardHeader className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-bold font-display">{classData.title}</CardTitle>
                                <CardDescription className="text-lg">
                                    Hosted by {classData.instructor.fullName}
                                </CardDescription>
                            </div>
                            <Badge variant={new Date(classData.scheduledAt) > new Date() ? "outline" : "secondary"} className="text-sm px-3 py-1">
                                {new Date(classData.scheduledAt) > new Date() ? "Upcoming" : "Live / Ended"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* key info grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-secondary/20 rounded-lg">
                                <Calendar className="h-5 w-5 text-google-blue" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                                    <p className="font-semibold">{format(new Date(classData.scheduledAt), "EEEE, MMMM do")}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-secondary/20 rounded-lg">
                                <Clock className="h-5 w-5 text-google-green" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Time & Duration</p>
                                    <p className="font-semibold">
                                        {format(new Date(classData.scheduledAt), "h:mm a")} • {classData.durationMin} min
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-secondary/20 rounded-lg">
                                <Avatar className="h-10 w-10 border-2 border-background">
                                    <AvatarImage src={classData.instructor.avatarUrl} />
                                    <AvatarFallback>{classData.instructor.fullName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Instructor</p>
                                    <p className="font-semibold">{classData.instructor.fullName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">About this Class</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {classData.description || "No description provided."}
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 border-t bg-secondary/5">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto text-lg gap-2 shadow-md hover:shadow-lg transition-all"
                            onClick={handleJoinClass}
                            disabled={isJoining}
                        >
                            {isJoining ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Joining...
                                </>
                            ) : (
                                <>
                                    <Video className="h-5 w-5" />
                                    Join Live Class
                                </>
                            )}
                        </Button>

                        {classData.meetingUrl && (
                            <div className="w-full sm:w-auto flex items-center justify-center text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" />
                                    Opens in Jitsi Meet
                                </span>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default LiveClass;
