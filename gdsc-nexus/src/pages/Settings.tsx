import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePageTitle } from "@/hooks/use-page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User, Bell, Mail, Shield, Camera, Save, Trash2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  usePageTitle("Settings");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    events: true,
    announcements: true,
    teamUpdates: true,
    classReminders: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="text-xl bg-google-blue text-white">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="gap-2">
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input defaultValue="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" defaultValue="john.doe@university.edu" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label>University</Label>
                      <Input defaultValue="State University" />
                    </div>
                    <div className="space-y-2">
                      <Label>Major</Label>
                      <Input defaultValue="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label>Year of Study</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="grad">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn Profile</Label>
                      <Input placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>

                  <Button variant="googleBlue" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <h4 className="font-medium text-foreground">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <h4 className="font-medium text-foreground">Push Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <h4 className="font-medium text-foreground">Event Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get notified about upcoming events</p>
                      </div>
                      <Switch
                        checked={notifications.events}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, events: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <h4 className="font-medium text-foreground">Announcements</h4>
                        <p className="text-sm text-muted-foreground">Society-wide announcements</p>
                      </div>
                      <Switch
                        checked={notifications.announcements}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, announcements: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <h4 className="font-medium text-foreground">Team Updates</h4>
                        <p className="text-sm text-muted-foreground">Updates from your teams</p>
                      </div>
                      <Switch
                        checked={notifications.teamUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, teamUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-foreground">Class Reminders</h4>
                        <p className="text-sm text-muted-foreground">Reminders before scheduled classes</p>
                      </div>
                      <Switch
                        checked={notifications.classReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, classReminders: checked })}
                      />
                    </div>
                  </div>

                  <Button variant="googleBlue" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>Manage your email preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email Digest Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Email Time</Label>
                      <Select defaultValue="morning">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (2 PM)</SelectItem>
                          <SelectItem value="evening">Evening (6 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button variant="googleBlue" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <h4 className="font-medium text-foreground">Profile Visibility</h4>
                        <p className="text-sm text-muted-foreground">Allow other members to see your profile</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <h4 className="font-medium text-foreground">Show Online Status</h4>
                        <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-foreground">Activity Status</h4>
                        <p className="text-sm text-muted-foreground">Show your activity in teams</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-medium text-google-red mb-2">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="outline" className="gap-2 text-google-red border-google-red/20 hover:bg-google-red/10">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
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

export default Settings;
