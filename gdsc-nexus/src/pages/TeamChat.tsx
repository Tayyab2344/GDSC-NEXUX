import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, Users, Circle } from "lucide-react";

const TeamChat = () => {
  const { teamId } = useParams();
  const [message, setMessage] = useState("");

  const teamName = teamId === "web" ? "Web Development" : teamId === "mobile" ? "Mobile Development" : "Team";

  const messages = [
    { id: 1, user: "Alex Johnson", avatar: "", message: "Hey everyone! Ready for the workshop tomorrow?", time: "10:30 AM", isMe: false },
    { id: 2, user: "You", avatar: "", message: "Yes! Can't wait. What topics are we covering?", time: "10:32 AM", isMe: true },
    { id: 3, user: "Sarah Chen", avatar: "", message: "We'll be covering React hooks and state management. Bring your laptops!", time: "10:35 AM", isMe: false },
    { id: 4, user: "Mike Wilson", avatar: "", message: "Perfect. I've been wanting to learn more about useContext", time: "10:38 AM", isMe: false },
    { id: 5, user: "You", avatar: "", message: "That's exactly what I need! See you all there 🙌", time: "10:40 AM", isMe: true },
  ];

  const onlineMembers = [
    { name: "Alex Johnson", status: "online" },
    { name: "Sarah Chen", status: "online" },
    { name: "Mike Wilson", status: "away" },
    { name: "Emily Davis", status: "online" },
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Link to={`/teams/${teamId}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h2 className="font-semibold text-foreground">{teamName} Chat</h2>
                <p className="text-sm text-muted-foreground">{onlineMembers.length} members online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback className="text-xs bg-google-blue/10 text-google-blue">
                      {msg.user.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[70%] ${msg.isMe ? "items-end" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.isMe
                          ? "bg-google-blue text-white rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button variant="ghost" size="icon">
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="googleBlue" size="icon" onClick={handleSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Online Members Sidebar */}
        <div className="w-64 border-l border-border hidden lg:block">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Online Members
            </h3>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4 space-y-3">
              {onlineMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-muted">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Circle
                      className={`w-3 h-3 absolute -bottom-0.5 -right-0.5 fill-current ${
                        member.status === "online" ? "text-google-green" : "text-google-yellow"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-foreground">{member.name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
