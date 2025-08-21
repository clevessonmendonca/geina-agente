import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthState, LoginCredentials, RegisterData, User } from '../types/authTypes';
import { ApiService } from '../lib/api';

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Tipos de ações
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Validação básica
      if (!credentials.matricula || !credentials.senha) {
        throw new Error('Matrícula e senha são obrigatórias');
      }
      
      if (credentials.matricula.length < 6) {
        throw new Error('Matrícula deve ter pelo menos 6 dígitos');
      }
      
      // Chamada real para a API
      const response = await ApiService.login(credentials);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao fazer login');
      }
      
      // Mapear resposta da API para o tipo User
      const apiUser = response.data;
      
      // Verificar se o login foi válido
      if (!apiUser.isValid) {
        throw new Error(apiUser.message || 'Login inválido');
      }
      
      const user: User = {
        id: apiUser.usuario?.user_id?.toString() || '1',
        matricula: apiUser.usuario?.matricula || credentials.matricula,
        nome: apiUser.usuario?.nome || 'Usuário',
        email: apiUser.usuario?.email || '',
        cargo: apiUser.usuario?.cargo || '',
        unidade: apiUser.usuario?.unidade || '',
        tipo: 'funcionario',
        status: 'ativo',
        dataCadastro: new Date().toISOString(),
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Erro ao fazer login' 
      });
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Validações
      if (data.senha !== data.confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }
      
      if (data.senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      
      if (!data.matricula || data.matricula.length < 6) {
        throw new Error('Matrícula deve ter pelo menos 6 dígitos');
      }
      
      // Preparar dados para a API
      const userData = {
        matricula: data.matricula,
        nome_completo: data.nome,
        email: data.email,
        cargo: data.cargo,
        unidade_departamento: data.unidade,
        senha: data.senha,
      };
      
      // Chamada real para a API
      const response = await ApiService.register(userData);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao fazer cadastro');
      }
      
      // Mapear resposta da API para o tipo User
      const apiUser = response.data;
      const user: User = {
        id: apiUser.usuario?.user_id?.toString() || '2',
        matricula: apiUser.usuario?.matricula || data.matricula,
        nome: apiUser.usuario?.nome || data.nome,
        email: apiUser.usuario?.email || data.email,
        cargo: apiUser.usuario?.cargo || data.cargo,
        unidade: apiUser.usuario?.unidade || data.unidade,
        tipo: 'funcionario',
        status: apiUser.usuario?.status ? 'ativo' : 'pendente',
        dataCadastro: new Date().toISOString(),
      };
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error instanceof Error ? error.message : 'Erro ao fazer cadastro' 
      });
    }
  };

  const logout = (): void => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
