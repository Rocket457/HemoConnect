import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaPrivadaBanco({ children }) {
  const userType = localStorage.getItem('userType');
  const isAuthenticated = localStorage.getItem('userId');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== 'banco') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaPrivadaBanco; 