import { API_BASE_URL } from '@/config/api';
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, Users, Calendar, MessageSquare, Settings, Bell,
    LogOut, ChevronLeft, ChevronRight, Shield, BookOpen, Megaphone,
    Award, FileText, ClipboardList, BarChart, Code2, Menu, X
} from "lucide-react";

interface SidebarProps {
    className?: string;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    roles?: string[];
}

const Sidebar = ({ className }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const { data: user } = useQuery({
        queryKey: ["user", "sidebar-profile"],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Unauthorized");
            return res.json();
        },
        enabled: !!token,
        retry: false
    });

    const { data: notifications = [] } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            if (!token) return [];
            const res = await fetch(`${API_BASE_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch notifications");
            return res.json();
        },
        enabled: !!token
    });

    const unreadCount = notifications.filter((n: any) => !n.read).length;

    const handleLogout = () => {
        localStorage.removeItem("token");
        queryClient.clear();
        navigate("/");
    };

    const adminRoles = ['PRESIDENT', 'VICE_PRESIDENT', 'GENERAL_SECRETARY', 'FACULTY_HEAD', 'CO_LEAD'];
    const leadRoles = ['TEAM_LEAD', 'CO_LEAD'];

    const navItems: NavItem[] = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Community Chat", href: "/chat", icon: MessageSquare },
        { name: "Teams", href: "/teams", icon: Users },
        { name: "Events", href: "/events", icon: Calendar },
        { name: "Learning", href: "/learning", icon: BookOpen },
        { name: "Announcements", href: "/announcements", icon: Megaphone },
        { name: "Notifications", href: "/notifications", icon: Bell },
    ];

    const adminItems: NavItem[] = [
        { name: "Admin Console", href: "/admin", icon: Shield, roles: adminRoles },
        { name: "Form Builder", href: "/admin/forms", icon: FileText, roles: adminRoles },
        { name: "Memberships", href: "/admin/memberships", icon: ClipboardList, roles: adminRoles },
        { name: "Team Management", href: "/admin/teams", icon: Users, roles: adminRoles },
    ];

    const filteredAdminItems = adminItems.filter(item =>
        item.roles?.includes(user?.role || '')
    );

    const isActive = (path: string) => location.pathname === path;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn(
                "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border",
                isCollapsed && "justify-center"
            )}>
                <div className="w-10 h-10 rounded-xl bg-google-blue flex items-center justify-center shadow-md">
                    <Code2 className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                    <div>
                        <span className="font-bold text-lg text-sidebar-foreground">GDSC</span>
                        <span className="font-bold text-lg text-google-blue ml-1">Nexus</span>
                    </div>
                )}
            </div>

            {/* User Info */}
            {user && (
                <div className={cn(
                    "flex items-center gap-3 px-4 py-4 border-b border-sidebar-border",
                    isCollapsed && "justify-center"
                )}>
                    <Avatar className="h-10 w-10 border-2 border-google-blue/20">
                        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                        <AvatarFallback className="bg-google-blue text-white">{user.fullName?.[0]}</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-sidebar-foreground">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.role?.replace('_', ' ')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {/* Main Nav */}
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setIsMobileOpen(false)}>
                            <Button
                                variant={isActive(item.href) ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 h-10",
                                    isCollapsed && "justify-center px-2",
                                    isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!isCollapsed && (
                                    <div className="flex-1 flex items-center justify-between">
                                        <span>{item.name}</span>
                                        {item.name === "Notifications" && unreadCount > 0 && (
                                            <Badge className="ml-auto bg-google-red text-white h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px]">
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                                {isCollapsed && item.name === "Notifications" && unreadCount > 0 && (
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-google-red rounded-full ring-2 ring-sidebar-background" />
                                )}
                            </Button>
                        </Link>
                    ))}
                </div>

                {/* Admin Section */}
                {filteredAdminItems.length > 0 && (
                    <>
                        <div className={cn("pt-4 pb-2", isCollapsed ? "text-center" : "px-3")}>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {isCollapsed ? "•••" : "Administration"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            {filteredAdminItems.map((item) => (
                                <Link key={item.href} to={item.href} onClick={() => setIsMobileOpen(false)}>
                                    <Button
                                        variant={isActive(item.href) ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3 h-10",
                                            isCollapsed && "justify-center px-2",
                                            isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </nav>

            {/* Footer Actions */}
            <div className="p-3 border-t border-sidebar-border space-y-2">
                <Link to="/settings" onClick={() => setIsMobileOpen(false)}>
                    <Button
                        variant={isActive("/settings") ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start gap-3 h-10",
                            isCollapsed && "justify-center px-2"
                        )}
                    >
                        <Settings className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>Settings</span>}
                    </Button>
                </Link>
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between px-2")}>
                    {!isCollapsed && <ThemeToggle />}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-google-red hover:bg-google-red/10"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Collapse Toggle (Desktop Only) */}
            <div className="hidden md:block p-3 border-t border-sidebar-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full justify-center"
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <Button
                variant="outline"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar-background border-r border-sidebar-border transform transition-transform duration-300 ease-in-out md:hidden",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden md:flex flex-col fixed inset-y-0 left-0 z-30 bg-sidebar-background border-r border-sidebar-border transition-all duration-300",
                isCollapsed ? "w-[70px]" : "w-64",
                className
            )}>
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
