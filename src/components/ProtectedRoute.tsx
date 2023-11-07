import { useAuthState } from "@/providers/AuthProvider";
import LoadingState from "./LoadingState";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthState();

  if (auth.state === "loading") {
    return <LoadingState />;
  }

  if (auth.state === "loaded" && auth.isAuthentication) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
