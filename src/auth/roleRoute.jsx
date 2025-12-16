// src/auth/RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authentication";

export default function RoleRoute({ allow }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="./login" replace />;

  const ok = Array.isArray(allow)
    ? allow.includes(currentUser.role)
    : currentUser.role === allow;

  return ok ? <Outlet /> : <Navigate to="/" replace />;
}
