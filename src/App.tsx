import React from 'react';import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FormValidationProvider } from './contexts/FormValidationContext';
import { ToastProvider } from './contexts/ToastContext';
import AuthPage from './pages/AuthPage';
import RankingPage from './pages/RankingPage';
import DashboardPage from './pages/DashboardPage';
import NovaIdeiaPage from './pages/NovaIdeiaPage';
import RelatarProblemaPage from './pages/RelatarProblemaPage';
import IdeiaDetalhesPage from './pages/IdeiaDetalhesPage';
import ProfilePage from './pages/ProfilePage';
import GestorAprovacoesPage from './pages/GestorAprovacoesPage';
import MinhasIdeiasPage from './pages/MinhasIdeiasPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode, requireGestor?: boolean }> = ({ children, requireGestor = false }) => {
  const { user } = useAuth();
  console.log(user);
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireGestor && user.role !== 'gestor') {
    return <Navigate to="/ranking" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/ranking" replace /> : <AuthPage />} 
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
          <ProtectedRoute requireGestor>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/minhas-ideias" 
        element={
          <ProtectedRoute>
            <MinhasIdeiasPage />
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
        path="/gestao/aprovacoes"
        element={
          <ProtectedRoute requireGestor>
            <GestorAprovacoesPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <FormValidationProvider>
            <AppContent />
          </FormValidationProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;

