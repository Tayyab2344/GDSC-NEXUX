import { API_BASE_URL } from '@/config/api';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, Users, Calendar, Image, Bell, LogIn, LogOut, User as UserIcon, LayoutDashboard, MessageSquare } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    // Fetch user profile if token exists
    const { data: user, isError } = useQuery({
        queryKey: ["user", "navbar-profile"],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                if (res.status === 401) localStorage.removeItem("token");
                throw new Error("Unauthorized");
            }
            return res.json();
        },
        enabled: !!token,
        retry: false
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        queryClient.clear();
        navigate("/");
        setIsOpen(false);
    };

    const navLinks = [
        { name: "Teams", href: "/teams", icon: Users },
        { name: "Events", href: "/events", icon: Calendar },
        { name: "Gallery", href: "/gallery", icon: Image },
        { name: "Announcements", href: "/announcements", icon: Bell },
    ];

    const isLoggedIn = !!user && !isError;

    const getRoleBasedLink = (role: string) => {
        const adminRoles = ['PRESIDENT', 'VICE_PRESIDENT', 'GENERAL_SECRETARY', 'FACULTY_HEAD', 'CO_LEAD'];
        if (adminRoles.includes(role)) {
            return { name: "Admin Console", href: "/admin", icon: Users };
        }
        if (role === 'TEAM_LEAD') {
            return { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard };
        }
        // General members or others get Chat link
        return { name: "Community Chat", href: "/chat", icon: MessageSquare };
    };

    const roleLink = user ? getRoleBasedLink(user.role) : null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-google-blue flex items-center justify-center shadow-md transition-shadow duration-300">
                                <Code2 className="w-5 h-5 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-bold text-lg text-foreground">GDSC</span>
                            <span className="font-bold text-lg text-google-blue ml-1">Nexus</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href}>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                            <AvatarFallback className="bg-google-blue/10 text-google-blue">{user.fullName?.[0]}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.fullName}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {roleLink && (
                                        <DropdownMenuItem onClick={() => navigate(roleLink.href)}>
                                            <roleLink.icon className="mr-2 h-4 w-4" />
                                            <span>{roleLink.name}</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-google-red focus:text-google-red bg-google-red/5 focus:bg-google-red/10">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="googleBlue" size="sm">
                                        Join Us
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    <div className="md:hidden">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-border animate-fade-in">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Button>
                            </Link>
                        ))}
                        <div className="pt-4 flex flex-col gap-2">
                            {isLoggedIn ? (
                                <>
                                    {roleLink && (
                                        <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => { navigate(roleLink.href); setIsOpen(false); }}>
                                            <roleLink.icon className="w-4 h-4" />
                                            {roleLink.name}
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="w-full justify-start gap-3 text-google-red" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4" />
                                        Log out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                                        <Button variant="googleBlue" className="w-full">
                                            Join Us
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
