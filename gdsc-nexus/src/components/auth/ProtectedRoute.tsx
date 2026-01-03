import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
};

export default ProtectedRoute;
