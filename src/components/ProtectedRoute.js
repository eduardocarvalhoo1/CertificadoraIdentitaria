import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export function ProtectedRoute({roles}) {
    const { user } = useContext(AuthContext);
    
    
    // Not authenticated
    if (!user) return <Navigate to="/login" />;
    
    // Unauthorized
    if (roles && !roles.includes(user.role)) {
        alert("Apenas professores podem acessar esta ")
        return <Navigate to="/" />;
    }
    // Access allowed
    return <Outlet />;
}