import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            localStorage.setItem("token", token);
            window.dispatchEvent(new Event("storage")); // Trigger storage event for listeners

            try {
                const decoded: any = jwtDecode(token);
                const role = decoded.role;
                if (['PRESIDENT', 'VICE_PRESIDENT', 'GENERAL_SECRETARY', 'FACULTY_HEAD'].includes(role)) {
                    navigate("/admin");
                } else {
                    navigate("/chat");
                }
            } catch (e) {
                // If decode fails, default to chat
                navigate("/chat");
            }
        } else {
            navigate("/login");
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
};

export default AuthCallback;
