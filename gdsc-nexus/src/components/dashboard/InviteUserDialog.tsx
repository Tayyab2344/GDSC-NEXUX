import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";

interface InviteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        role: "GENERAL_MEMBER"
    });

    const inviteMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST', // We'll need to check if backend handles POST on /users for admin
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to create user');
            return res.json();
        },
        onSuccess: () => {
            toast.success("User invited successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            onOpenChange(false);
            setFormData({ email: "", fullName: "", role: "GENERAL_MEMBER" });
        },
        onError: () => {
            toast.error("Error inviting user. Please try again.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inviteMutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-google-blue" />
                            Invite Executive / Member
                        </DialogTitle>
                        <DialogDescription>
                            Manually add a user to the GDSC Nexus platform. They will receive a default password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="E.g. Ali Ahmed"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GENERAL_MEMBER">General Member</SelectItem>
                                    <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                                    <SelectItem value="CO_LEAD">Co-Lead</SelectItem>
                                    <SelectItem value="TEAM_LEAD">Team Lead</SelectItem>
                                    <SelectItem value="PRESIDENT">President</SelectItem>
                                    <SelectItem value="FACULTY_HEAD">Faculty Head</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" variant="google" disabled={inviteMutation.isPending}>
                            {inviteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Invitation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
