import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
