import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export function useTokenExpiration() {
    const { token, logout } = useContext(AuthContext);

    useEffect(() => {
        if (!token) return;

        const decode = jwtDecode(token);
        const exp = decode.exp * 1000;
        const now = Date.now();

        if (now >= exp) {
            logout();
        } else {
            const timeout = setTimeout(() => logout(), exp - now);
            return () => clearTimeout(timeout);
        }
    }, [token, logout]);
}