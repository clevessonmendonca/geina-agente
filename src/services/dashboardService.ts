const API_BASE_URL = 'http://localhost:8000';

export interface DashboardData {
  total_experimentos: number;
  experimentos_aprovados: number;
  experimentos_implementados: number;
  score_medio_ia: number;
  tempo_medio_implementacao: number;
  experimentos_por_categoria: Array<{
    categoria: string;
    quantidade: number;
  }>;
  experimentos_por_status: Array<{
    status: string;
    quantidade: number;
  }>;
  evolucao_mensal: Array<{
    mes: string;
    experimentos: number;
    votos: number;
  }>;
  score_ia_por_categoria: Array<{
    categoria: string;
    score_medio: number;
    implementados: number;
  }>;
  top_experimentos: Array<{
    id: number;
    nome_experimento: string;
    score_ia: number;
    categoria: string;
    proponente_nome: string;
  }>;
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

class DashboardService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  async getDashboardData(timeRange: string = '30dias', dataInicio?: string, dataFim?: string): Promise<DashboardData> {
    try {
      let url = `/experiments/dashboard?time_range=${timeRange}`;
      
      if (timeRange === 'personalizado' && dataInicio && dataFim) {
        url += `&data_inicio=${dataInicio}&data_fim=${dataFim}`;
      }
      
      const response = await this.makeRequest<DashboardData | { error: string }>(url);
      
      // Verificar se há erro na resposta
      if ('error' in response) {
        throw new Error(response.error);
      }
      
      return response as DashboardData;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      // Retornar dados mock apenas em caso de erro real
      return this.getMockData();
    }
  }

  private getMockData(): DashboardData {
    return {
      total_experimentos: 120,
      experimentos_aprovados: 25,
      experimentos_implementados: 15,
      score_medio_ia: 87.3,
      tempo_medio_implementacao: 4.2,
      experimentos_por_categoria: [
        { categoria: 'Tecnologia', quantidade: 35 },
        { categoria: 'Processos', quantidade: 28 },
        { categoria: 'Atendimento', quantidade: 22 },
        { categoria: 'Produtos', quantidade: 15 },
        { categoria: 'Sustentabilidade', quantidade: 12 },
        { categoria: 'Outros', quantidade: 8 }
      ],
      experimentos_por_status: [
        { status: 'Em Votação', quantidade: 45 },
        { status: 'Aprovado', quantidade: 25 },
        { status: 'Implementado', quantidade: 15 },
        { status: 'Rejeitado', quantidade: 15 }
      ],
      evolucao_mensal: [
        { mes: 'Jan', experimentos: 15, votos: 120 },
        { mes: 'Fev', experimentos: 22, votos: 180 },
        { mes: 'Mar', experimentos: 18, votos: 150 },
        { mes: 'Abr', experimentos: 25, votos: 220 },
        { mes: 'Mai', experimentos: 30, votos: 280 },
        { mes: 'Jun', experimentos: 35, votos: 320 }
      ],
      score_ia_por_categoria: [
        { categoria: 'Tecnologia', score_medio: 89.5, implementados: 8 },
        { categoria: 'Processos', score_medio: 82.3, implementados: 6 },
        { categoria: 'Atendimento', score_medio: 85.7, implementados: 5 },
        { categoria: 'Produtos', score_medio: 78.9, implementados: 3 },
        { categoria: 'Sustentabilidade', score_medio: 91.2, implementados: 4 },
        { categoria: 'Outros', score_medio: 75.4, implementados: 2 }
      ],
      top_experimentos: [
        { id: 1, nome_experimento: 'Sistema de IA para Detecção de Fraudes', score_ia: 94.5, categoria: 'Tecnologia', proponente_nome: 'Maria Silva' },
        { id: 2, nome_experimento: 'App Mobile para Atendimento Prioritário', score_ia: 89.2, categoria: 'Atendimento', proponente_nome: 'João Santos' },
        { id: 3, nome_experimento: 'Processo Digital com Blockchain', score_ia: 82.7, categoria: 'Processos', proponente_nome: 'Ana Costa' },
        { id: 4, nome_experimento: 'Sistema de Gestão de Energia IoT', score_ia: 78.4, categoria: 'Sustentabilidade', proponente_nome: 'Carlos Lima' },
        { id: 5, nome_experimento: 'Automação de Processos Críticos', score_ia: 76.8, categoria: 'Processos', proponente_nome: 'Fernanda Silva' }
      ]
    };
  }
}

export const dashboardService = new DashboardService();
