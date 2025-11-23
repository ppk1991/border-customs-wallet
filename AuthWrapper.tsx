

import React, { useState } from 'react';
import App from './App';
import LoginScreen from './components/LoginScreen';
import SharedCredentialView from './components/SharedCredentialView';

const AuthWrapper: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple router based on URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');

  if (view === 'credential') {
    return <SharedCredentialView />;
  }

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <App onLogout={handleLogout} />
  ) : (
    <LoginScreen onLogin={handleLogin} />
  );
};

export default AuthWrapper;