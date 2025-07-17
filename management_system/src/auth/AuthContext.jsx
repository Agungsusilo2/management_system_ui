import {createContext, useContext, useState} from "react";
import {useLocalStorage} from "react-use";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useLocalStorage("token", "");
    const [user, setUser] = useState(null);

    const login = (token, userData) => {
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
    };

    const value = {
        authToken,
        user,
        isAuthenticated: !!authToken,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
