import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const location = useLocation();

  if (!token) {
    const redirect = location.pathname !== "/portal" ? `?redirect=${encodeURIComponent(location.pathname)}` : "";
    return <Navigate to={`/login${redirect}`} replace />;
  }

  // SSO partner users are locked to a single page — never let them out of it.
  if (role === "sso") {
    const scope = localStorage.getItem("ssoScope") || "mock-interview";
    if (location.pathname !== `/${scope}`) {
      return <Navigate to={`/${scope}`} replace />;
    }
    return <>{children}</>;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === "super_admin") return <Navigate to="/admin" replace />;
    if (role === "project_manager") return <Navigate to="/projects" replace />;
    if (role === "sales_person") return <Navigate to="/sales" replace />;
    if (role === "public_user") return <Navigate to="/placements" replace />;
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
