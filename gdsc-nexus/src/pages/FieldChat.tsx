import { API_BASE_URL } from '@/config/api';
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ArrowLeft, Send, Paperclip, Smile, MoreVertical, Users,
    FileText, Image, Trash2, Mic, X, Loader2
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";
import { toast } from "sonner";
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

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string;
}

interface ChatMessage {
    id: string;
    content: string;
    type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO';
    fileUrl?: string;
    sender: User;
    createdAt: string;
    isMe?: boolean;
}

interface FieldMember {
    userId: string;
    user: User;
    joinedAt: string;
}

const FieldChat = () => {
    const { fieldId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
    const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const token = localStorage.getItem("token");

    const { data: currentUser } = useQuery({
        queryKey: ["user", "profile"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json() as Promise<User>;
        },
        enabled: !!token
    });

    const { data: field, isLoading: isFieldLoading } = useQuery({
        queryKey: ["field", fieldId],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/fields/${fieldId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch field");
            return res.json();
        },
        enabled: !!fieldId && !!token
    });

    const chatId = field?.chats?.[0]?.id;

    const { data: historyMessages } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: async () => {
            if (!chatId) return [];
            const res = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch messages");
            return res.json() as Promise<ChatMessage[]>;
        },
        enabled: !!chatId && !!token
    });

    const allMessages = [...(historyMessages || []), ...realtimeMessages];

    useEffect(() => {
        if (!currentUser || !chatId || !token) return;

        const newSocket = io(`${API_BASE_URL}/chat`, {
            auth: { token }
        });

        newSocket.on("connect", () => {
            newSocket.emit("authenticate", { userId: currentUser.id });
            newSocket.emit("joinRoom", chatId);
        });

        newSocket.on("newMessage", (msg: ChatMessage) => {
            setRealtimeMessages((prev) => [...prev, msg]);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        newSocket.on("userTyping", (data: { userId: string, userName: string }) => {
            if (data.userId !== currentUser.id) {
                setTypingUsers(prev => new Map(prev).set(data.userId, data.userName));
            }
        });

        newSocket.on("userStoppedTyping", (data: { userId: string }) => {
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                newMap.delete(data.userId);
                return newMap;
            });
        });

        newSocket.on("error", (err) => {
            toast.error("Connection error");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [currentUser, chatId, token]);

    useEffect(() => {
        setRealtimeMessages([]);
    }, [chatId]);

    const handleSend = () => {
        if ((!message.trim() && !isUploading) || !socket || !chatId || !currentUser) return;

        socket.emit("sendMessage", {
            chatId,
            content: message,
            senderId: currentUser.id,
            senderName: currentUser.fullName,
            type: "TEXT"
        });

        setMessage("");
        socket.emit("stopTyping", { chatId, userId: currentUser.id });
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (!socket || !chatId || !currentUser) return;

        socket.emit("typing", { chatId, userId: currentUser.id, userName: currentUser.fullName });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { chatId, userId: currentUser.id });
        }, 2000);
    };

    const handleFileUpload = async (file: File, type: 'IMAGE' | 'AUDIO' | 'FILE') => {
        if (!chatId || !currentUser || !socket) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/chat/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            const fileUrl = data.secure_url || data.url;

            let content = 'Sent a file';
            if (type === 'IMAGE') content = 'Sent an image';
            if (type === 'AUDIO') content = 'Sent a voice message';

            const payload = {
                chatId,
                content: content,
                senderId: currentUser.id,
                senderName: currentUser.fullName,
                type: type,
                fileUrl: fileUrl
            };

            socket.emit("sendMessage", payload);

        } catch (error) {
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = file.type.startsWith('image/') ? 'IMAGE' : 'FILE';
            handleFileUpload(file, type);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                if (blob.size < 500) {
                    toast.error("Recording too short.");
                    return;
                }
                const file = new File([blob], "voice_message.webm", { type: 'audio/webm' });
                handleFileUpload(file, 'AUDIO');
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            toast.error("Could not access microphone");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            setMediaRecorder(null);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/fields/${fieldId}/members/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to remove member");
            toast.success("Member removed successfully");
            queryClient.invalidateQueries({ queryKey: ["field", fieldId] });
        } catch (error) {
            toast.error("Failed to remove member");
        }
    };

    const AudioPlayer = ({ src, senderId, currentUserId }: { src: string, senderId: string, currentUserId: string | null }) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const [progress, setProgress] = useState(0);
        const audioRef = useRef<HTMLAudioElement>(null);
        const isOwner = senderId === currentUserId;

        const togglePlay = () => {
            if (audioRef.current) {
                if (isPlaying) {
                    audioRef.current.pause();
                } else {
                    audioRef.current.play();
                }
                setIsPlaying(!isPlaying);
            }
        };

        useEffect(() => {
            const audio = audioRef.current;
            if (!audio) return;

            const updateProgress = () => {
                if (audio.duration) {
                    setProgress((audio.currentTime / audio.duration) * 100);
                }
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setProgress(0);
            };

            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('ended', handleEnded);

            return () => {
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('ended', handleEnded);
            };
        }, []);

        return (
            <div className={`flex items-center gap-3 min-w-[200px] ${isOwner ? 'text-white' : 'text-foreground'}`}>
                <button onClick={togglePlay} className={`p-2 rounded-full ${isOwner ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/10 hover:bg-primary/20'} transition-colors`}>
                    {isPlaying ? <span className="h-4 w-4 block bg-current rounded-sm" /> : <span className="h-4 w-4 block border-l-[6px] border-l-current border-y-[4px] border-y-transparent ml-0.5" />}
                </button>
                <div className="flex-1 space-y-1">
                    <div className={`h-1 rounded-full w-full ${isOwner ? 'bg-white/30' : 'bg-primary/10'}`}>
                        <div
                            className={`h-full rounded-full ${isOwner ? 'bg-white' : 'bg-primary'} transition-all duration-100`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <audio ref={audioRef} src={src} className="hidden" />
            </div>
        );
    };

    const isAuthorizedLead = currentUser && ['PRESIDENT', 'FACULTY_HEAD', 'TEAM_LEAD', 'CO_LEAD'].includes(currentUser.role);

    if (isFieldLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!field) return <div className="min-h-screen flex items-center justify-center">Field not found</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 pt-24 flex container mx-auto px-4 pb-4 gap-4 h-[calc(100vh-1rem)]">
                <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-card shadow-sm">
                    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-muted/30">
                        <div className="flex items-center gap-3">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="font-semibold text-foreground">{field.name} Chat</h2>
                                <p className="text-sm text-muted-foreground">Team Discussion</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4 pb-4">
                            {allMessages.map((msg, idx) => {
                                const isMe = msg.sender.id === currentUser?.id;
                                const isInstructor = ['FACULTY_HEAD', 'PRESIDENT'].includes(msg.sender.role);
                                return (
                                    <div
                                        key={msg.id || idx}
                                        className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                                    >
                                        <Avatar className="w-8 h-8 flex-shrink-0">
                                            <AvatarImage src={msg.sender.avatarUrl} />
                                            <AvatarFallback className={`text-xs ${isInstructor ? "bg-google-yellow/10 text-google-yellow" : "bg-google-blue/10 text-google-blue"}`}>
                                                {msg.sender.fullName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`max-w-[70%] ${isMe ? "items-end" : ""}`}>
                                            <div className={`flex items-center gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}>
                                                <span className={`text-sm font-medium ${isInstructor ? "text-google-yellow" : "text-foreground"}`}>
                                                    {isMe ? "You" : msg.sender.fullName}
                                                    {isInstructor && <span className="ml-1 text-xs">(Instructor)</span>}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(msg.createdAt), "h:mm a")}
                                                </span>
                                            </div>
                                            <div
                                                className={`rounded-2xl px-4 py-2 ${isMe
                                                    ? "bg-google-blue text-white rounded-tr-sm"
                                                    : isInstructor
                                                        ? "bg-google-yellow/10 border border-google-yellow/20 rounded-tl-sm text-foreground"
                                                        : "bg-muted rounded-tl-sm text-foreground"
                                                    }`}
                                            >
                                                {msg.type === 'TEXT' && <p className="text-sm">{msg.content}</p>}
                                                {msg.type === 'IMAGE' && msg.fileUrl && (
                                                    <div className="overflow-hidden rounded-md my-1">
                                                        <img
                                                            src={msg.fileUrl}
                                                            alt="Shared"
                                                            className="max-w-[200px] max-h-[200px] w-auto h-auto object-cover cursor-pointer"
                                                            onClick={() => window.open(msg.fileUrl, '_blank')}
                                                        />
                                                    </div>
                                                )}
                                                {msg.type === 'FILE' && msg.fileUrl && (
                                                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-md ${isMe ? "bg-white/20 hover:bg-white/30" : "bg-black/5 hover:bg-black/10"} transition-colors`}>
                                                        <FileText className="w-5 h-5" />
                                                        <span className="text-sm underline cursor-pointer truncate max-w-[150px]">
                                                            Download File
                                                        </span>
                                                    </a>
                                                )}
                                                {msg.type === 'AUDIO' && msg.fileUrl && currentUser && (
                                                    <AudioPlayer src={msg.fileUrl} senderId={msg.sender.id} currentUserId={currentUser.id} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {typingUsers.size > 0 && (
                                <div className="text-xs text-muted-foreground italic ml-12">
                                    {Array.from(typingUsers.values()).join(', ')} is typing...
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-border bg-background">
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={onFileSelect}
                            />
                            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                <Paperclip className="w-5 h-5 text-muted-foreground" />
                            </Button>

                            <Input
                                value={message}
                                onChange={handleTyping}
                                placeholder="Type a message..."
                                className="flex-1"
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                disabled={isUploading}
                            />
                            <Button
                                variant={isRecording ? "destructive" : "ghost"}
                                size="icon"
                                onClick={toggleRecording}
                                className={isRecording ? "animate-pulse" : ""}
                            >
                                {isRecording ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
                            </Button>

                            <Button variant="googleBlue" size="icon" onClick={handleSend} disabled={isUploading || (!message.trim() && !isUploading && !isRecording)}>
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-72 border rounded-lg hidden lg:flex flex-col bg-card shadow-sm h-full">
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-4 border-b border-border">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Members ({field.members?.length || 0})
                            </h3>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-3">
                                {field.members?.map((member: FieldMember) => {
                                    const isLeadUser = ['TEAM_LEAD', 'CO_LEAD'].includes(member.user.role);
                                    const isInstructor = ['FACULTY_HEAD', 'PRESIDENT'].includes(member.user.role);
                                    return (
                                        <div key={member.userId} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="relative shrink-0">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={member.user.avatarUrl} />
                                                        <AvatarFallback className={`text-xs ${isInstructor ? "bg-google-yellow/10 text-google-yellow" : "bg-muted"}`}>
                                                            {member.user.fullName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-sm text-foreground truncate block">{member.user.fullName}</span>
                                                    {(isLeadUser || isInstructor) && (
                                                        <p className={`text-[10px] ${isInstructor ? "text-google-yellow" : "text-google-blue"}`}>
                                                            {member.user.role.replace('_', ' ')}
                                                        </p>)}                         </div>                       </div>                       {isAuthorizedLead && member.user.id !== currentUser?.id && (<AlertDialog>                           <AlertDialogTrigger asChild>                             <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-google-red hover:text-google-red hover:bg-google-red/10 transition-opacity" title="Remove member"                             >                               <Trash2 className="w-3 h-3" />                             </Button>                           </AlertDialogTrigger>                           <AlertDialogContent>                             <AlertDialogHeader>                               <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>                               <AlertDialogDescription>                                 Are you sure you want to remove {member.user.fullName} from this field? They will lose access to this chat.                               </AlertDialogDescription>                             </AlertDialogHeader>                             <AlertDialogFooter>                               <AlertDialogCancel>Cancel</AlertDialogCancel>                               <AlertDialogAction onClick={() => handleRemoveMember(member.userId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90"                               >                                 Remove                               </AlertDialogAction>                             </AlertDialogFooter>                           </AlertDialogContent>                         </AlertDialog>)}                     </div>);
                                })}               </div>             </ScrollArea>           </div>            <div className="h-1/3 border-t border-border flex flex-col">             <div className="p-4 border-b border-border">               <h3 className="font-semibold text-foreground flex items-center gap-2">                 <FileText className="w-4 h-4" />                 Shared Files               </h3>             </div>             <div className="p-4 text-sm text-muted-foreground text-center">               No files shared yet.             </div>           </div>         </div>       </div>     </div>);
}; export default FieldChat;
