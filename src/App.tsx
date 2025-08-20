import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import RankingPage from './pages/RankingPage';
import DashboardPage from './pages/DashboardPage';
import NovaIdeiaPage from './pages/NovaIdeiaPage';
import RelatarProblemaPage from './pages/RelatarProblemaPage';
import IdeiaDetalhesPage from './pages/IdeiaDetalhesPage';

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
        element={isAuthenticated ? <Navigate to="/ranking" replace /> : <AuthPage />} 
      />
      <Route 
        path="/ranking" 
        element={
          <ProtectedRoute>
            <RankingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/relatar-problema" 
        element={
          <ProtectedRoute>
            <RelatarProblemaPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ideia/:id" 
        element={
          <ProtectedRoute>
            <IdeiaDetalhesPage />
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
        element={<Navigate to={isAuthenticated ? "/ranking" : "/auth"} replace />} 
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
