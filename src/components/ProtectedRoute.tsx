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

  // SSO partner users.
  // - If a scope is set on their session, they're locked to that single page.
  // - Otherwise they get the same portal access as a regular student.
  if (role === "sso") {
    const scope = localStorage.getItem("ssoScope");
    if (scope) {
      if (location.pathname !== `/${scope}`) {
        return <Navigate to={`/${scope}`} replace />;
      }
      return <>{children}</>;
    }
    // No scope -> student-like access. Allow any route that admits students.
    if (allowedRoles && !allowedRoles.includes("student") && !allowedRoles.includes("sso")) {
      return <Navigate to="/portal" replace />;
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
