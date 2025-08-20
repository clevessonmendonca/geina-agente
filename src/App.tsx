import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import { IdeiasEmVotao } from './pages/ProjectsPage/ProjectsPage';
import { NovaIdeiaPage } from './pages/NovaIdeiaPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/projects" replace /> : <AuthPage />} 
      />
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
            <IdeiasEmVotao />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/nova-ideia" 
        element={
          <ProtectedRoute>
            <NovaIdeiaPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/projects" : "/auth"} replace />} 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
