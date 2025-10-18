import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(localStorage.getItem("accessToken"));

    // Automatically persist login info
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        if (token) localStorage.setItem("accessToken", token);
        console.log(user);
    }, [user, token]);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return  (
        <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};