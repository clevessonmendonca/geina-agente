import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, User } from '../types/authTypes';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface LoginRequest {
  matricula: string;
  senha: string;
}

interface LoginResponse {
  isValid: boolean;
  message: string;
  usuario: User | null;
  status: 'success' | 'error';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Verificar se há usuário salvo no localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('hacktoon_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('hacktoon_user');
      }
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.isValid && data.usuario) {
        setUser(data.usuario);
        localStorage.setItem('hacktoon_user', JSON.stringify(data.usuario));
        
        // Toast de sucesso
        showToast(`Bem-vindo(a), ${data.usuario.nome}!`, 'success', 3000);
        
        return true;
      } else {
        // Melhorar mensagens de erro específicas
        let errorMessage = data.message || 'Erro no login';
        
        // Mapear mensagens específicas do backend
        if (errorMessage.includes('Matrícula ou senha incorreta')) {
          errorMessage = 'Matrícula ou senha incorreta. Verifique suas credenciais.';
        } else if (errorMessage.includes('Usuário não encontrado')) {
          errorMessage = 'Usuário não encontrado. Verifique sua matrícula.';
        } else if (errorMessage.includes('Senha incorreta')) {
          errorMessage = 'Senha incorreta. Tente novamente.';
        } else if (errorMessage.includes('Usuário inativo')) {
          errorMessage = 'Usuário inativo. Entre em contato com o administrador.';
        } else if (errorMessage.includes('Aguardando aprovação')) {
          errorMessage = 'Seu cadastro ainda está aguardando aprovação. Entre em contato com seu gestor.';
        } else if (errorMessage.includes('relation "usuario" does not exist')) {
          errorMessage = 'Sistema temporariamente indisponível. Tente novamente em alguns minutos.';
        }
        
        setError(errorMessage);
        
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      
      // Melhorar mensagens de erro de rede
      let errorMessage = 'Erro de conexão.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      } else if (error instanceof Error) {
        errorMessage = `Erro de conexão: ${error.message}`;
      }
      
      setError(errorMessage);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hacktoon_user');
    
    // Toast de logout
    showToast('Você foi desconectado com sucesso.', 'info', 3000);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
