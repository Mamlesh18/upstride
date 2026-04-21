import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === "super_admin") return <Navigate to="/admin" replace />;
    if (role === "project_manager") return <Navigate to="/projects" replace />;
    if (role === "sales_person") return <Navigate to="/sales" replace />;
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
