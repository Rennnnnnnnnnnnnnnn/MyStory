import { useState, useEffect } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoginRegisterModal from "../../components/modals/LoginRegisterModal";
import Spinner from "../../components/others/Spinner";

export default function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth();
    const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            setShowLoginRegisterModal(true);
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
        <LoginRegisterModal
            onSuccess={() => {
                setShowLoginRegisterModal(false);
                navigate("/profile");
            }}
            onCancel={() => setCancelled(true)}
        />
    );
}
