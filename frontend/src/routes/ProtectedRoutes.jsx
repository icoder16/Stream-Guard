import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

// For logged-in users only
export const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// For guests only
export const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
