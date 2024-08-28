import { useUser } from 'contexts/userContext';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
