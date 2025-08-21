// Tipos para experimentos
export interface Experiment {
  id: number;
  nome_experimento: string;
  unidade_gestora: string;
  proponente_nome?: string;
  proponente_matricula?: string;
  proponente_cgc?: string;
  desafio: string;
  descricao: string;
  horizonte_inovacao: string;
  volume_impacto: string;
  hipoteses?: string;
  metricas_kpis: string;
  baseline?: string;
  resultados_esperados?: string;
  data_inicio?: string;
  data_fim?: string;
  termos_recursos_unidade: boolean;
  termos_registro_perdas: boolean;
  termos_notificacao_geina: boolean;
  termos_relatorios: boolean;
  aceito_termos: boolean;
  local_assinatura?: string;
  data_assinatura?: string;
  gestor_unidade?: string;
  criador_nome?: string;
  time_membros?: TeamMember[];
  riscos?: Risk[];
  // Campos de score de IA
  score_ia?: number;
  score_impacto?: number;
  score_viabilidade?: number;
  score_urgencia?: number;
  score_alcance?: number;
  score_inovacao?: number;
  prioridade_ia?: string;
  categoria_ia?: string;
  tags_ia?: string;
  resumo_ia?: string;
  data_calculo_ia?: string;
  // Status do experimento
  status_experimento?: string;
}

export interface TeamMember {
  nome: string;
  matricula: string;
}

export interface Risk {
  descricao_risco: string;
  estrategia_mitigacao: string;
}

export interface CreateExperimentRequest {
  nome_experimento: string;
  unidade_gestora: string;
  proponente_nome?: string;
  proponente_matricula?: string;
  proponente_cgc?: string;
  desafio: string;
  descricao: string;
  horizonte_inovacao: string;
  volume_impacto: string;
  hipoteses?: string;
  metricas_kpis: string;
  baseline?: string;
  resultados_esperados?: string;
  data_inicio?: string;
  data_fim?: string;
  termos_recursos_unidade: boolean;
  termos_registro_perdas: boolean;
  termos_notificacao_geina: boolean;
  termos_relatorios: boolean;
  aceito_termos: boolean;
  local_assinatura?: string;
  data_assinatura?: string;
  gestor_unidade?: string;
  time_membros: TeamMember[];
  riscos: Risk[];
}

export interface CreateExperimentResponse {
  success: boolean;
  message: string;
  experimento_id: number;
  experimento: Experiment;
  status: string;
}

export interface ExperimentResponse {
  success: boolean;
  message: string;
  experimento_id?: number;
  experimento?: Experiment;
  status: string;
}

export interface ExperimentListResponse {
  experiments: Experiment[];
  total: number;
  status: string;
}

const API_BASE_URL = 'http://localhost:8000';

class ExperimentService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Experiment service error:', error);
      throw error;
    }
  }

  // Criar novo experimento
  async createExperiment(data: CreateExperimentRequest): Promise<CreateExperimentResponse> {
    return this.makeRequest<CreateExperimentResponse>('/experiments/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Listar experimentos do usuário
  async listUserExperiments(userId?: number): Promise<ExperimentListResponse> {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId.toString());
    }
    
    return this.makeRequest<ExperimentListResponse>(`/experiments/list?${params.toString()}`);
  }

  // Listar todos os experimentos (admin)
  async listAllExperiments(): Promise<ExperimentListResponse> {
    return this.makeRequest<ExperimentListResponse>('/experiments/list?all=true');
  }

  // Obter experimento por ID
  async getExperimentById(experimentId: number): Promise<Experiment> {
    return this.makeRequest<Experiment>(`/experiments/${experimentId}`);
  }

  // Atualizar experimento
  async updateExperiment(experimentId: number, data: Partial<CreateExperimentRequest>): Promise<ExperimentResponse> {
    return this.makeRequest<ExperimentResponse>(`/experiments/${experimentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Deletar experimento
  async deleteExperiment(experimentId: number): Promise<ExperimentResponse> {
    return this.makeRequest<ExperimentResponse>(`/experiments/${experimentId}`, {
      method: 'DELETE',
    });
  }
}

export const experimentService = new ExperimentService();
