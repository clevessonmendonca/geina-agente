export interface User {
  user_id: number;
  nome_completo: string;
  email: string;
  cargo: string;
  unidade_departamento: string;
  matricula: string;
  status: boolean;
  role?: 'gestor' | 'funcionario' | string;
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
      }>('/auth/debug-db');
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.users || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async approveUser(userId: number, approverId: number): Promise<{ success: boolean; message: string }>{
    const res = await this.makeRequest<{ success: boolean; message: string }>(`/auth/approve-user?approver_id=${approverId}`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId })
    });
    return res;
  }
}

export const userService = new UserService();
