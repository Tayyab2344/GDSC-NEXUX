import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

interface MembershipDriveConfig {
    active: boolean;
    title: string;
    message: string;
    buttonText: string;
    bannerText: string;
}

const MembershipModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: config } = useQuery({
        queryKey: ["config", "membership_drive"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/admin/config/membership_drive`);
            if (!res.ok) return null;
            const data = await res.json();
            return data?.value as MembershipDriveConfig | null;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    useEffect(() => {
        // Only show if drive is active and user hasn't dismissed it this session
        if (config?.active) {
            const dismissed = sessionStorage.getItem("membership_modal_dismissed");
            if (!dismissed) {
                // Small delay for better UX
                const timer = setTimeout(() => setIsOpen(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [config?.active]);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem("membership_modal_dismissed", "true");
    };

    if (!config?.active) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-lg glass-card border-white/20 p-0 overflow-hidden">
                {/* Header Gradient */}
                <div className="h-2 bg-gradient-to-r from-google-blue via-google-red via-google-yellow to-google-green" />

                <div className="p-6 pt-4">
                    <DialogHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-google-blue to-google-green flex items-center justify-center shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <Badge className="bg-google-green/10 text-google-green border-none mb-3">
                                🎉 Membership Drive Open
                            </Badge>
                            <DialogTitle className="text-2xl font-bold">
                                {config.title || "Join GDSC Nexus!"}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                            {config.message || "Our annual membership drive is now open! Join over 500+ members and build the future together."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-3">
                        <Link to="/signup" onClick={handleClose}>
                            <Button className="w-full h-12 bg-google-blue hover:bg-google-blue/90 rounded-xl font-bold text-base group">
                                {config.buttonText || "Join the Community"}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full h-10 text-muted-foreground hover:text-foreground"
                            onClick={handleClose}
                        >
                            Maybe Later
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-center gap-6 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-google-green" />
                            Free to join
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-google-blue" />
                            No experience needed
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-google-yellow" />
                            Instant access
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MembershipModal;
