const API_BASE_URL = 'http://localhost:8000';

export interface ValidatorRequest {
  titulo: string;
  descricao: string;
}

export interface ValidatorResponse {
  decisao: boolean;
  confianca: 'Alta' | 'Média' | 'Baixa';
  justificativa: string;
  recomendacoes: string;
  criterios_atendidos: string[];
  status: string;
}

// Função para limpar JSON da justificativa
const cleanJustificativa = (justificativa: string): string => {
  if (!justificativa) return '';
  
  let cleaned = justificativa.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const jsonPattern = /^\s*\{[^}]*\}\s*/;
  cleaned = cleaned.replace(jsonPattern, '').trim();
  if (cleaned.includes('"justificativa":')) {
    const match = cleaned.match(/"justificativa":\s*"([^"]+)"/);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  cleaned = cleaned.replace(/\{[^}]*\}/g, '').trim();
  
  return cleaned;
};

class ValidatorService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async validateIdea(request: ValidatorRequest): Promise<ValidatorResponse> {
    const response = await this.makeRequest<ValidatorResponse>('/validator/validate-idea', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    // Limpar a justificativa antes de retornar
    return {
      ...response,
      justificativa: cleanJustificativa(response.justificativa)
    };
  }

  async healthCheck(): Promise<Record<string, unknown>> {
    return this.makeRequest('/validator/health');
  }
}

export const validatorService = new ValidatorService();
