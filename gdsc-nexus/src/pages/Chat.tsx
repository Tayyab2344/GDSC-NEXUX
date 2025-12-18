import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare, Send, Image as ImageIcon, Paperclip, Smile, Lock,
  Hash, Users, Pin, Search, Settings, Phone, Video, Loader2, Mic, X,
  Play, Pause
} from "lucide-react";

// ... (previous imports)


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode"; // You might need to install this or parse manually if not available, but assuming standard JWT usage. 
// If jwt-decode is not available, we'll parse the token manually or just send it raw.
// Let's assume for now we just send the token/userId directly if we have it, 
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/use-page-title";

interface ChatRoom {
  id: string;
  name: string;
  visibility: "PUBLIC" | "MEMBERS_ONLY" | "LEADS_ONLY" | "HIDDEN";
  isGroup: boolean;
  fieldId?: string;
  teamId?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO';
  fileUrl?: string;
  sender: {
    id: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

const Chat = () => {
  usePageTitle("Chat");
  const navigate = useNavigate();
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map()); // userId -> userName
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to get user ID from token (simple parse)
  const getUserIdFromToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).sub;
    } catch (e) {
      return null;
    }
  };

  const userId = token ? getUserIdFromToken(token) : null;
  // Get full name for typing indicator (would ideally come from user profile context)
  // For now using placeholder or ID if not available in context. 
  // Ideally we should fetch user profile. Let's assume we have it or send "Someone".
  const userName = "Someone"; // TODO: Fetch real user name

  // Initialize Socket
  useEffect(() => {
    if (!token || !userId) return;

    const newSocket = io("http://localhost:3000/chat", {
      transports: ["websocket"],
      query: { token } // Optional, if backend supports handshake auth, but we use 'authenticate' event
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      newSocket.emit("authenticate", { userId });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, userId]);

  // Fetch Rooms
  const { data: channels, isLoading: isChannelsLoading } = useQuery({
    queryKey: ["chat", "rooms"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/chat/rooms", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return res.json() as Promise<ChatRoom[]>;
    },
    enabled: !!token
  });

  // Set default active channel (Prioritize General Chat)
  useEffect(() => {
    if (channels && channels.length > 0 && !activeChannelId) {
      const generalChat = channels.find(c => c.name === "General Chat");
      setActiveChannelId(generalChat ? generalChat.id : channels[0].id);
    }
  }, [channels, activeChannelId]);

  // Handle Room Joining & Messages
  useEffect(() => {
    if (!socket || !activeChannelId) return;

    // Join new room
    socket.emit("joinRoom", activeChannelId);

    // Initial fetch of messages for this room (API)
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3000/chat/${activeChannelId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const initialMessages = await res.json();
          setRealtimeMessages(initialMessages);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      }
    };
    fetchMessages();
    setTypingUsers(new Map()); // Clear typing users on switch

    // Listeners
    const handleNewMessage = (msg: ChatMessage) => {
      if (msg.chatId === activeChannelId || !msg.chatId) { // !msg.chatId check in case backend doesn't send it in event (though it should)
        setRealtimeMessages(prev => [...prev, msg]);
      }
    };

    const handleUserTyping = (data: { userId: string, userName: string }) => {
      if (data.userId !== userId) {
        setTypingUsers(prev => new Map(prev).set(data.userId, data.userName));
      }
    };

    const handleUserStoppedTyping = (data: { userId: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.emit("leaveRoom", activeChannelId);
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket, activeChannelId, token, userId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [realtimeMessages, typingUsers]);


  const handleSendMessage = () => {
    if ((!message.trim()) || !socket || !activeChannelId || !userId) return;

    const payload = {
      chatId: activeChannelId,
      content: message,
      senderId: userId,
      senderName: userName, // Backend might look this up, but sending for safety
      type: "TEXT"
    };

    socket.emit("sendMessage", payload);
    setMessage("");
    socket.emit("stopTyping", { chatId: activeChannelId, userId });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!socket || !activeChannelId || !userId) return;

    socket.emit("typing", { chatId: activeChannelId, userId, userName });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId: activeChannelId, userId });
    }, 2000);
  };

  // Upload Logic
  const handleFileUpload = async (file: File, type: 'IMAGE' | 'AUDIO') => {
    if (!activeChannelId || !userId || !socket) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await fetch("http://localhost:3000/chat/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      // Cloudinary response has .secure_url or .url
      const fileUrl = data.secure_url || data.url;

      const payload = {
        chatId: activeChannelId,
        content: type === 'IMAGE' ? 'Sent an image' : 'Sent a voice message',
        senderId: userId,
        senderName: userName,
        type: type,
        fileUrl: fileUrl
      };

      socket.emit("sendMessage", payload);

    } catch (error) {
      console.error("Upload error", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // Image Helper
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], 'IMAGE');
    }
  };

  // Voice Helper
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

        // Validation for empty or too short recordings
        if (blob.size < 500) {
          toast.error("Recording too short. Please speak longer.");
          return;
        }

        const file = new File([blob], "voice_message.webm", { type: 'audio/webm' });
        handleFileUpload(file, 'AUDIO');
        stream.getTracks().forEach(track => track.stop()); // cleanup
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error", err);
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

  const activeChannel = channels?.find(c => c.id === activeChannelId);

  const AudioPlayer = ({ src, senderId, currentUserId }: { src: string, senderId: string, currentUserId: string | null }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isOwner = senderId === currentUserId;

    // Simulated waveform bars
    const waveformBars = [30, 60, 40, 80, 50, 20, 70, 40, 60, 30, 50, 70, 45, 25, 85, 60, 40, 75, 50, 20, 40, 60, 30, 80, 50];

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

    const formatTime = (time: number) => {
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }, []);

    return (
      <div className={`flex items-center gap-4 py-1.5 px-1 min-w-[240px] ${isOwner ? 'text-white' : 'text-foreground'}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOwner
            ? 'bg-white/15 hover:bg-white/25 text-white'
            : 'bg-google-blue/10 hover:bg-google-blue/20 text-google-blue'
            }`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </Button>

        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-end gap-[2px] h-8 pt-2">
            {waveformBars.map((height, i) => {
              const barProgress = (i / waveformBars.length) * 100;
              const isActive = progress >= barProgress;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${isActive
                    ? (isOwner ? 'bg-white' : 'bg-google-blue')
                    : (isOwner ? 'bg-white/30' : 'bg-muted-foreground/30')
                    }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[10px] font-medium opacity-80 uppercase tracking-tight">
            <span>{isPlaying ? formatTime(audioRef.current?.currentTime || 0) : 'Voice Message'}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>
        <audio ref={audioRef} src={src} className="hidden" />
      </div>
    );
  };

  const getRoleColor = (role: string) => {
    if (role?.includes("LEAD") || role?.includes("PRESIDENT") || role?.includes("HEAD")) return "text-google-blue";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">


        <div className="h-[calc(100vh-300px)] min-h-[600px]">
          {/* Chat Area - Full Width */}
          <Card className="flex flex-col overflow-hidden h-full">
            {activeChannel ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    {activeChannel.visibility === 'PUBLIC' ? <Hash className="h-5 w-5 text-google-blue" /> : <Lock className="h-5 w-5 text-google-blue" />}
                    <div>
                      <h2 className="font-semibold">{activeChannel.name}</h2>
                      <p className="text-xs text-muted-foreground capitalize">{activeChannel.visibility?.replace('_', ' ').toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Actions placeholders */}
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-6">
                    {realtimeMessages.length === 0 && (
                      <div className="text-center text-muted-foreground py-10">No messages yet. Start the conversation!</div>
                    )}
                    {realtimeMessages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 group ${msg.sender.id === userId ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-google-blue/20 text-google-blue">
                            {msg.sender.fullName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col ${msg.sender.id === userId ? 'items-end' : 'items-start'} max-w-[80%]`}>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-semibold text-sm">{msg.sender.fullName}</span>
                            {msg.sender.role && <span className={`text-[10px] ${getRoleColor(msg.sender.role)}`}>{msg.sender.role}</span>}
                            <span className="text-[10px] text-muted-foreground">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className={`p-3 rounded-lg text-sm transition-all ${msg.sender.id === userId
                            ? 'bg-google-blue text-white rounded-tr-none'
                            : 'bg-muted rounded-tl-none border border-border/50'
                            }`}>
                            {msg.type === 'TEXT' && <p className="leading-relaxed">{msg.content}</p>}
                            {msg.type === 'IMAGE' && (
                              <div className="overflow-hidden rounded-md my-1">
                                <img
                                  src={msg.fileUrl}
                                  alt="Shared"
                                  className="max-w-[280px] max-h-[280px] w-auto h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                  onClick={() => window.open(msg.fileUrl, '_blank')}
                                />
                              </div>
                            )}
                            {msg.type === 'AUDIO' && msg.fileUrl && (
                              <AudioPlayer src={msg.fileUrl} senderId={msg.sender.id} currentUserId={userId} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {typingUsers.size > 0 && (
                      <div className="text-xs text-muted-foreground italic ml-12">
                        {Array.from(typingUsers.values()).join(', ')} is typing...
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={onFileSelect}
                    />

                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </Button>

                    <Input
                      placeholder={`Message #${activeChannel.name}`}
                      className="flex-1"
                      value={message}
                      onChange={handleTyping}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      disabled={isUploading}
                    />

                    {/* Voice Button */}
                    <Button
                      variant={isRecording ? "destructive" : "ghost"}
                      size="icon"
                      onClick={toggleRecording}
                      className={isRecording ? "animate-pulse" : ""}
                    >
                      {isRecording ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5 text-muted-foreground" />}
                    </Button>

                    <Button variant="google" size="icon" onClick={handleSendMessage} disabled={isUploading || (!message.trim() && !isUploading)} >
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a channel to start chatting
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
