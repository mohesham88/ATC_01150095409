import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../store/adminAuthStore";
import { Login } from "../admin/pages/Login";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const { isAdminAuthenticated, isLoading, checkAuth } = useAdminAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAdminAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
