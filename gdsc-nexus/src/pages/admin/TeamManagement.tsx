import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Search, Edit, Trash2, Users, Code, Smartphone, Brain,
  Gamepad2, Palette, MoreVertical, UserPlus, Loader2, Shield, Crown, User
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  description: string;
  members: { user: { id: string; fullName: string; avatarUrl?: string; role: string } }[];
  fields: { id: string; name: string }[];
  _count: { members: number; fields: number };
}

interface AppUser {
  id: string;
  fullName: string;
  email: string;
  status: string;
  avatarUrl?: string;
}

const TeamManagement = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const [showCreateFieldModal, setShowCreateFieldModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldDescription, setNewFieldDescription] = useState("");

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [targetFieldId, setTargetFieldId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");

  // Queries
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/teams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json() as Promise<Team[]>;
    }
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", userSearch],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/users?search=${userSearch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Search failed");
      return res.json() as Promise<AppUser[]>;
    },
    enabled: showAddMemberModal
  });

  // Mutations
  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await fetch("http://localhost:3000/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Creation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team created!");
      setShowCreateModal(false);
      setNewTeamName("");
      setNewTeamDescription("");
    }
  });

  const createFieldMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; teamId: string }) => {
      const res = await fetch("http://localhost:3000/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Creation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Field created!");
      setShowCreateFieldModal(false);
      setNewFieldName("");
      setNewFieldDescription("");
    }
  });

  const addMemberMutation = useMutation({
    mutationFn: async ({ fieldId, userId }: { fieldId: string; userId: string }) => {
      const res = await fetch(`http://localhost:3000/fields/${fieldId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to add member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Member added!");
      setShowAddMemberModal(false);
      setUserSearch("");
    },
    onError: () => toast.error("User might already be in this team")
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Society Management</h1>
              <p className="text-muted-foreground">Create teams, manage groups, and assign members.</p>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button variant="googleBlue" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>Add a high-level team (e.g., Tech, Non-Tech, Management)</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Team Name</Label>
                    <Input
                      placeholder="e.g. Technical Department"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the team's focus"
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button
                    variant="googleBlue"
                    onClick={() => createTeamMutation.mutate({ name: newTeamName, description: newTeamDescription })}
                    disabled={createTeamMutation.isPending || !newTeamName}
                  >
                    {createTeamMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Team
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Teams Grid */}
          {isLoadingTeams ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {teams?.map((team) => (
                <Card key={team.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-google-blue/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-google-blue" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription className="line-clamp-1">{team.description}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedTeamId(team.id);
                            setShowCreateFieldModal(true);
                          }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Chat Group (Field)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{team._count.members} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Code className="w-4 h-4" />
                        <span>{team._count.fields} groups</span>
                      </div>
                    </div>

                    {/* Fields (Chat Groups) */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Chat Groups / Fields</p>
                      <div className="space-y-2">
                        {team.fields.map((field) => (
                          <div key={field.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/50">
                            <span className="text-sm font-medium truncate max-w-[150px]">{field.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-google-blue hover:text-google-blue hover:bg-google-blue/10"
                              onClick={() => {
                                setTargetFieldId(field.id);
                                setShowAddMemberModal(true);
                              }}
                            >
                              <UserPlus className="w-3 h-3" />
                              Add User
                            </Button>
                          </div>
                        ))}
                        {team.fields.length === 0 && (
                          <p className="text-xs text-muted-foreground italic">No chat groups created yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Team Members Preview */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Recent Members</p>
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 5).map((m, i) => (
                          <Avatar key={i} className="w-7 h-7 border-2 border-background">
                            <AvatarImage src={m.user.avatarUrl} />
                            <AvatarFallback className="text-[10px]">{m.user.fullName[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 5 && (
                          <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] text-muted-foreground">
                            +{team.members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Dialog: Create Field */}
        <Dialog open={showCreateFieldModal} onOpenChange={setShowCreateFieldModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Chat Group (Field)</DialogTitle>
              <DialogDescription>Add a specific functional group to this team.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Group Name</Label>
                <Input
                  placeholder="e.g. Marketing, Frontend, Logistics"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="What is this group for?"
                  value={newFieldDescription}
                  onChange={(e) => setNewFieldDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateFieldModal(false)}>Cancel</Button>
              <Button
                variant="googleBlue"
                onClick={() => createFieldMutation.mutate({
                  name: newFieldName,
                  description: newFieldDescription,
                  teamId: selectedTeamId!
                })}
                disabled={createFieldMutation.isPending || !newFieldName}
              >
                {createFieldMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Add Member */}
        <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Member to Group</DialogTitle>
              <DialogDescription>Search for a user to add them manually to this group.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {isLoadingUsers ? (
                  <div className="text-center py-4"><Loader2 className="animate-spin inline-block h-4 w-4 mr-2" /> Searching...</div>
                ) : users?.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">No users found.</p>
                ) : (
                  users?.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.avatarUrl} />
                          <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{u.fullName}</p>
                          <p className="text-[10px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="googleBlue"
                        onClick={() => addMemberMutation.mutate({ fieldId: targetFieldId!, userId: u.id })}
                        disabled={addMemberMutation.isPending}
                      >
                        Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default TeamManagement;
