
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function PrivateRoute({ element }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return element
}




