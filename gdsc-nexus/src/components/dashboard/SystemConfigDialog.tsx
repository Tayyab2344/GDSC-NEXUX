import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Loader2, Save } from "lucide-react";

interface SystemConfigDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SystemConfigDialog({ open, onOpenChange }: SystemConfigDialogProps) {
    const queryClient = useQueryClient();
    const [config, setConfig] = useState({
        active: true,
        title: "",
        message: "",
        bannerText: ""
    });

    const { data: remoteConfig, isLoading } = useQuery({
        queryKey: ["system-config", "membership_drive"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/config/membership_drive`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data.value;
        },
        enabled: open
    });

    useEffect(() => {
        if (remoteConfig) {
            setConfig(remoteConfig);
        }
    }, [remoteConfig]);

    const updateMutation = useMutation({
        mutationFn: async (newConfig: typeof config) => {
            const res = await fetch(`${API_BASE_URL}/admin/config/membership_drive`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(newConfig)
            });
            if (!res.ok) throw new Error('Failed to update config');
            return res.json();
        },
        onSuccess: () => {
            toast.success("System configuration updated!");
            queryClient.invalidateQueries({ queryKey: ["system-config"] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to save settings.");
        }
    });

    const handleSave = () => {
        updateMutation.mutate(config);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-google-yellow" />
                        Global System Matrix
                    </DialogTitle>
                    <DialogDescription>
                        Control platform-wide visibility and recruitment status. Changes take effect immediately.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-google-blue" />
                    </div>
                ) : (
                    <div className="grid gap-6 py-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Membership Drive</Label>
                                <p className="text-sm text-muted-foreground">Toggle "Join Community" visibility</p>
                            </div>
                            <Switch
                                checked={config.active}
                                onCheckedChange={(val) => setConfig({ ...config, active: val })}
                            />
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Banner Headline</Label>
                                <Input
                                    id="title"
                                    value={config.title}
                                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bannerText">Scroller Text</Label>
                                <Input
                                    id="bannerText"
                                    value={config.bannerText}
                                    onChange={(e) => setConfig({ ...config, bannerText: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message">Welcome Message</Label>
                                <Input
                                    id="message"
                                    value={config.message}
                                    onChange={(e) => setConfig({ ...config, message: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        variant="google"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Apply Global Settings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
