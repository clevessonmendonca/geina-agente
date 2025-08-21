export interface User {
  user_id?: number;
  matricula: string;
  nome: string;
  email: string;
  cargo?: string;
  unidade?: string;
  status?: string;
}

export interface LoginCredentials {
  matricula: string;
  senha: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}
