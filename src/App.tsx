import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Se não estiver autenticado, mostra a página de autenticação
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Se estiver autenticado, mostra o dashboard
  return <DashboardPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
