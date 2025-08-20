export interface User {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  cargo: string;
  unidade: string;
  tipo: 'funcionario' | 'gestor' | 'admin';
  status: 'ativo' | 'inativo' | 'pendente';
  dataCadastro: string;
}

export interface LoginCredentials {
  matricula: string;
  senha: string;
}

export interface RegisterData {
  matricula: string;
  nome: string;
  email: string;
  cargo: string;
  unidade: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
