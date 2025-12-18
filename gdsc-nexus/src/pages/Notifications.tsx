import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Check, CheckCheck, Trash2, Calendar, Users, MessageCircle,
  BookOpen, Award, Settings
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "event",
      title: "New Workshop Available",
      message: "React Hooks Deep Dive workshop starts tomorrow at 3:00 PM",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "team",
      title: "Added to Web Development Team",
      message: "You've been added to the Web Development team by Alex Johnson",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "message",
      title: "New Message in Team Chat",
      message: "Sarah Chen mentioned you in Web Development chat",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 4,
      type: "class",
      title: "Class Starting Soon",
      message: "Your scheduled class 'State Management' starts in 30 minutes",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 5,
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "You've completed 10 classes. Keep up the great work!",
      time: "1 day ago",
      read: true,
    },
    {
      id: 6,
      type: "announcement",
      title: "New Announcement",
      message: "Check out the upcoming hackathon details",
      time: "2 days ago",
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-5 h-5 text-google-blue" />;
      case "team":
        return <Users className="w-5 h-5 text-google-green" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-google-blue" />;
      case "class":
        return <BookOpen className="w-5 h-5 text-google-yellow" />;
      case "achievement":
        return <Award className="w-5 h-5 text-google-yellow" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-google-red text-white">{unreadCount}</Badge>
                )}
              </h1>
              <p className="text-muted-foreground">Stay updated with the latest activities</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                          notification.read ? "bg-background" : "bg-google-blue/5"
                        } hover:bg-muted/50`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.read ? "bg-muted" : "bg-google-blue/10"
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${notification.read ? "text-foreground" : "text-foreground"}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-google-blue" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-google-red"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unread">
              <Card>
                <CardContent className="pt-6">
                  {notifications.filter(n => !n.read).length > 0 ? (
                    <div className="space-y-2">
                      {notifications.filter(n => !n.read).map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start gap-4 p-4 rounded-lg bg-google-blue/5 hover:bg-muted/50"
                        >
                          <div className="w-10 h-10 rounded-full bg-google-blue/10 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{notification.title}</h4>
                              <span className="w-2 h-2 rounded-full bg-google-blue" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-google-red"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">No unread notifications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
