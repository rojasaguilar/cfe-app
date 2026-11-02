import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./../context/AuthContext.jsx";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando sesión...</div>; // Puedes poner un Spinner aquí
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // (Opcional) Guard por roles. Si la ruta exige 'admin' y el usuario es 'user'
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // Outlet renderiza las rutas hijas que pongas dentro de este guard
  return <Outlet />;
};
