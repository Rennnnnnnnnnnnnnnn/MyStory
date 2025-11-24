
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const isAuthenticated = !!user;

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;