import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { PageLoader } from "./page-loader";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center h-full w-full">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return <Navigate to="/" replace />;
  }

  return children;
};
