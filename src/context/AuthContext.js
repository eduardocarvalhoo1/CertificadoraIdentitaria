import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(localStorage.getItem("accessToken"));

    // Automatically persist login info
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userId", user.id);
        }
        if (token) localStorage.setItem("accessToken", token);
        console.log(user);
    }, [user, token]);

    const login = (userData, jwt) => {
        setUser(userData);
        setToken(jwt);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", jwt);
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return  (
        <AuthContext.Provider value={{ user, token, setUser, setToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};