import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: ReactNode;
    className?: string;
}

const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            {/* Main Content Area */}
            <main className={cn(
                "min-h-screen transition-all duration-300",
                "md:ml-64", // Account for sidebar width on desktop
                "pt-16 md:pt-0", // Account for mobile header space
                className
            )}>
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
