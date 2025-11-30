
import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from './axiosInstance';

const AuthContext = createContext(null);

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const isAuthenticated = !!user;
    const [loading, setLoading] = useState(true);

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axiosInstance.get("/api/auth/verifyUser", {
                    withCredentials: true
                });
                setUser(res.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, [])

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;