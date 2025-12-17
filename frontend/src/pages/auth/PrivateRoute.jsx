import { useState, useEffect } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoginModal from "../../components/modals/LoginRegisterModal";
import Spinner from "../../components/others/Spinner";

export default function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        }
    }, [isAuthenticated]);

    if (loading) {
        return <Spinner />;
    }

    if (isAuthenticated) {
        return <Outlet />;
    }

    if (cancelled) {
        return <Navigate to="/feed" replace />;
    }

    return (
        <LoginModal
            onSuccess={() => {
                setShowLoginModal(false);
                navigate("/profile");
            }}
            onCancel={() => setCancelled(true)}
        />
    );
}
