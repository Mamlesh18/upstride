import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const loginTimestamp = localStorage.getItem("loginTimestamp");

  // Check if token exists and is valid
  if (!isAuthenticated || !loginTimestamp) {
    // Clear any stale auth data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("userEmail");
    return <Navigate to="/login" replace />;
  }

  // Check if token has expired (1 hour = 3600000 milliseconds)
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - parseInt(loginTimestamp);
  const oneHour = 3600000;

  if (timeDifference > oneHour) {
    // Token expired, clear auth data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("userEmail");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
