export interface User {
  user_id: number;
  nome_completo: string;
  email: string;
  cargo: string;
  unidade_departamento: string;
  matricula: string;
  status: boolean;
}

const API_BASE_URL = 'http://localhost:8000';

class UserService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.makeRequest<{
        error?: string;
        users?: User[];
      }>('/auth/debug-connection');
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.users || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
