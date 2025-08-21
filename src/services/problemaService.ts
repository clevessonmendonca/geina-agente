const API_BASE_URL = 'http://localhost:8000';

export interface ProblemaRequest {
  titulo: string;
  descricao: string;
  categoria: string;
  area_afetada: string;
  nivel_urgencia: 'baixa' | 'media' | 'alta' | 'critica' | 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  impacto: 'baixo' | 'medio' | 'alto' | 'critico' | 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  contato_acompanhamento?: string;
}

export interface ProblemaResponse {
  success: boolean;
  message: string;
  problema_id: number;
  problema: {
    id: number;
    titulo: string;
    categoria: string;
    area_afetada: string;
    criador_nome: string;
  };
  status: string;
}

export interface SolucaoSugerida {
  id?: number;
  titulo: string;
  descricao: string;
  relevancia?: string;
  justificativa?: string;
}

export interface AnalisarProblemaResponse {
  problema_analisado: {
    titulo: string;
    descricao: string;
    categoria: string;
    area_afetada: string;
  };
  total_experimentos_analisados: number;
  solucoes_sugeridas: SolucaoSugerida[];
  criterios_analise: string[];
  status: string;
}

class ProblemaService {
  private baseURL = `${API_BASE_URL}/problemas`;

  async registrarProblema(problema: ProblemaRequest): Promise<ProblemaResponse> {
    try {
      const response = await fetch(`${this.baseURL}/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problema),
      });

      if (!response.ok) {
        throw new Error(`Erro ao registrar problema: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar problema:', error);
      throw error;
    }
  }

  async analisarProblema(problema: ProblemaRequest): Promise<AnalisarProblemaResponse> {
    try {
      console.log('Enviando problema para análise:', problema);
      
      // Usar a rota automática que busca todos os experimentos internamente
      const response = await fetch(`${this.baseURL}/analisar-auto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problema),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Erro ao analisar problema: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao analisar problema:', error);
      throw error;
    }
  }

  async listarProblemas(): Promise<ProblemaResponse[]> {
    try {
      const response = await fetch(`${this.baseURL}/listar`);
      
      if (!response.ok) {
        throw new Error(`Erro ao listar problemas: ${response.statusText}`);
      }

      const data = await response.json();
      return data.problemas || [];
    } catch (error) {
      console.error('Erro ao listar problemas:', error);
      throw error;
    }
  }

  async obterProblema(id: number): Promise<ProblemaResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter problema: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter problema:', error);
      throw error;
    }
  }
}

export const problemaService = new ProblemaService();
