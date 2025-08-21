// Configuração da API
const API_BASE_URL = 'http://localhost:8000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // Métodos de autenticação
  static async login(credentials: { matricula: string; senha: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData: {
    matricula: string;
    nome_completo: string;
    email: string;
    cargo: string;
    unidade_departamento: string;
    senha: string;
  }) {
    return this.request('/auth/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Métodos de usuário
  static async getUserProfile(userId: string) {
    return this.request(`/users/${userId}`);
  }

  static async updateUserProfile(userId: string, userData: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Métodos de experimentos
  static async getExperimentos(userId: string) {
    return this.request(`/experimentos?user_id=${userId}`);
  }

  static async createExperimento(experimentoData: any) {
    return this.request('/experimentos', {
      method: 'POST',
      body: JSON.stringify(experimentoData),
    });
  }

  static async updateExperimento(experimentoId: string, experimentoData: any) {
    return this.request(`/experimentos/${experimentoId}`, {
      method: 'PUT',
      body: JSON.stringify(experimentoData),
    });
  }

  static async deleteExperimento(experimentoId: string) {
    return this.request(`/experimentos/${experimentoId}`, {
      method: 'DELETE',
    });
  }
}
