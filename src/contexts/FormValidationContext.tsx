import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AIValidationResponse {
  fieldName: string;
  isValid: boolean;
  score: number;
  category?: string;
  horizon?: string;
  complexity?: string;
  urgency?: string;
  suggestions: Array<{
    type: string;
    message: string;
    example?: string;
  }>;
  feedback: string;
  status: string;
}

interface FormFieldContext {
  field: string;
  value: string | number | boolean | null;
}

interface FormValidationState {
  [fieldName: string]: AIValidationResponse;
}

interface FormValidationContextType {
  // Estado
  validations: FormValidationState;
  isValidating: boolean;
  formData: Record<string, unknown>;
  validationStats: {
    totalAttempts: number;
    successfulValidations: number;
    blockedValidations: number;
  };
  fieldStatus: Record<string, 'idle' | 'validating' | 'valid' | 'warning' | 'error'>;
  
  // Ações
  validateField: (fieldName: string, fieldValue: string | number | boolean | null) => Promise<void>;
  updateFormData: (fieldName: string, value: unknown) => void;
  clearValidation: (fieldName: string) => void;
  clearAllValidations: () => void;
  getFieldValidation: (fieldName: string) => AIValidationResponse | null;
  isFieldValid: (fieldName: string) => boolean;
  getOverallScore: () => number;
  getFieldStatus: (fieldName: string) => 'idle' | 'validating' | 'valid' | 'warning' | 'error';
  getContextForField: (fieldName: string) => Record<string, FormFieldContext>;
}

const FormValidationContext = createContext<FormValidationContextType | undefined>(undefined);

interface FormValidationProviderProps {
  children: ReactNode;
}

export const FormValidationProvider: React.FC<FormValidationProviderProps> = ({ children }) => {
  const [validations, setValidations] = useState<FormValidationState>({});
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const [validationStats, setValidationStats] = useState({
    totalAttempts: 0,
    successfulValidations: 0,
    blockedValidations: 0
  });
  const [fieldStatus, setFieldStatus] = useState<Record<string, 'idle' | 'validating' | 'valid' | 'warning' | 'error'>>({});

  // Mapeamento de campos do formulário CAIXA Sandbox
  const fieldMappings = {
    // Informações básicas
    titulo: 'nome_experimento',
    descricao: 'descricao_experimento',
    
    // Informações do proponente
    nome_proponente: 'nome_proponente',
    matricula: 'matricula',
    cgc: 'cgc',
    unidade_gestora: 'unidade_gestora',
    
    // Detalhes do experimento
    desafio: 'desafio',
    hipoteses: 'hipoteses',
    testes_hipoteses: 'testes_hipoteses',
    horizonte_inovacao: 'horizonte_inovacao',
    
    // Métricas e resultados
    baseline: 'baseline',
    resultados_esperados: 'resultados_esperados',
    metricas_kpis: 'metricas_kpis',
    
    // Impacto e estratégia
    diretrizes_estrategicas: 'diretrizes_estrategicas',
    empregados_impactados: 'empregados_impactados',
    areas_impactadas: 'areas_impactadas',
    
    // Riscos e cronograma
    riscos: 'riscos',
    cronograma_macro: 'cronograma_macro'
  };

  const validateFieldWithAI = useCallback(async (fieldName: string, fieldValue: string | number | boolean | null, context: Record<string, FormFieldContext> = {}) => {
    try {
      setIsValidating(true);
      setFieldStatus(prev => ({ ...prev, [fieldName]: 'validating' }));

      const payload = {
        fieldName,
        fieldValue: String(fieldValue),
        context: context
      };

      const response = await fetch('http://localhost:8000/form/validate-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        setValidations(prev => ({
          ...prev,
          [fieldName]: data
        }));
        
        setFieldStatus(prev => ({ ...prev, [fieldName]: data.isValid ? 'valid' : 'warning' }));
      } else {
        setFieldStatus(prev => ({ ...prev, [fieldName]: 'error' }));
      }
    } catch (error) {
      setFieldStatus(prev => ({ ...prev, [fieldName]: 'error' }));
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Validações client-side antes de chamar a IA
  const validateFieldLocally = (fieldName: string, fieldValue: string | number | boolean | null): boolean => {
    if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
      return false;
    }

    // Validações específicas por campo
    switch (fieldName) {
      case 'titulo':
      case 'nome_experimento': {
        const titulo = String(fieldValue);
        return titulo.length >= 3 && titulo.length <= 120 && 
               /[a-zA-Z]/.test(titulo); // Pelo menos uma letra
      }

      case 'descricao':
      case 'descricao_experimento': {
        const descricao = String(fieldValue);
        return descricao.length >= 10 && descricao.length <= 4000 && 
               /[a-zA-Z]/.test(descricao);
      }

      case 'categoria':
        return ['tecnologia', 'processos', 'atendimento', 'produtos', 'sustentabilidade', 'outros'].includes(String(fieldValue));

      case 'impacto':
        return ['baixo', 'medio', 'alto', 'critico'].includes(String(fieldValue));

      case 'viabilidade':
        return ['baixa', 'media', 'alta', 'muito-alta'].includes(String(fieldValue));

      case 'recursos': {
        const recursos = String(fieldValue);
        return recursos.length >= 10 && recursos.split(' ').length >= 3;
      }

      case 'equipe': {
        const equipe = String(fieldValue);
        return equipe.length >= 2 && /^\d+/.test(equipe); // Deve começar com número
      }

      case 'prazo': {
        const prazo = String(fieldValue);
        return prazo.length >= 3 && /(mes|mês|ano|semana|dia)/i.test(prazo);
      }

      default:
        // Para outros campos, validação básica
        if (typeof fieldValue === 'string') {
          return fieldValue.length >= 3 && fieldValue.trim() !== '';
        }
        return true;
    }
  };

  const validateField = useCallback(async (
    fieldName: string, 
    fieldValue: string | number | boolean | null
  ) => {
    // Validação client-side primeiro
    if (!validateFieldLocally(fieldName, fieldValue)) {
      // Se não passar na validação local, limpa a validação anterior
      setValidations(prev => {
        const newValidations = { ...prev };
        delete newValidations[fieldName];
        return newValidations;
      });
      
      // Atualiza status do campo
      setFieldStatus(prev => ({
        ...prev,
        [fieldName]: 'error'
      }));
      
      // Atualiza estatísticas
      setValidationStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        blockedValidations: prev.blockedValidations + 1
      }));
      return;
    }

    // Marca campo como validando
    setFieldStatus(prev => ({
      ...prev,
      [fieldName]: 'validating'
    }));

    // Cria contexto com todos os outros campos preenchidos
    const context: Record<string, FormFieldContext> = {};
    Object.entries(formData).forEach(([key, value]) => {
      // Inclui todos os campos preenchidos, exceto o campo atual sendo validado
      if (key !== fieldName && value !== null && value !== undefined && value !== '') {
        const mappedField = fieldMappings[key as keyof typeof fieldMappings] || key;
        context[mappedField] = {
          field: mappedField,
          value: value as string | number | boolean | null
        };
      }
    });

    // Log do contexto sendo enviado
    // console.log('📋 Contexto sendo enviado para validação:', {
    //   campoAtual: fieldName,
    //   valorAtual: fieldValue,
    //   camposPreenchidos: Object.keys(context),
    //   contextoCompleto: context
    // });

    // Mapeia o nome do campo para o formato esperado pelo backend
    const mappedFieldName = fieldMappings[fieldName as keyof typeof fieldMappings] || fieldName;

    // Chama a validação diretamente (o debounce será feito na página)
    setValidationStats(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
      successfulValidations: prev.successfulValidations + 1
    }));
    validateFieldWithAI(mappedFieldName, fieldValue, context);
  }, [formData, validateFieldWithAI]);

  const updateFormData = useCallback((fieldName: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const clearValidation = useCallback((fieldName: string) => {
    setValidations(prev => {
      const newValidations = { ...prev };
      delete newValidations[fieldName];
      return newValidations;
    });
  }, []);

  const clearAllValidations = useCallback(() => {
    setValidations({});
    setFormData({});
  }, []);

  const getFieldValidation = useCallback((fieldName: string) => {
    return validations[fieldName] || null;
  }, [validations]);

  const isFieldValid = useCallback((fieldName: string) => {
    const validation = validations[fieldName];
    return validation ? validation.isValid : true; // Assume válido se não foi validado
  }, [validations]);

  const getOverallScore = useCallback(() => {
    const validationsArray = Object.values(validations);
    if (validationsArray.length === 0) return 0;
    
    const totalScore = validationsArray.reduce((sum, validation) => sum + validation.score, 0);
    return Math.round(totalScore / validationsArray.length);
  }, [validations]);

  const getFieldStatus = useCallback((fieldName: string) => {
    return fieldStatus[fieldName] || 'idle';
  }, [fieldStatus]);

  const getContextForField = useCallback((fieldName: string) => {
    const context: Record<string, FormFieldContext> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== fieldName && value !== null && value !== undefined && value !== '') {
        const mappedField = fieldMappings[key as keyof typeof fieldMappings] || key;
        context[mappedField] = {
          field: mappedField,
          value: value as string | number | boolean | null
        };
      }
    });
    return context;
  }, [formData]);

  const value: FormValidationContextType = {
    validations,
    isValidating,
    formData,
    validationStats,
    fieldStatus,
    validateField,
    updateFormData,
    clearValidation,
    clearAllValidations,
    getFieldValidation,
    isFieldValid,
    getOverallScore,
    getFieldStatus,
    getContextForField
  };

  return (
    <FormValidationContext.Provider value={value}>
      {children}
    </FormValidationContext.Provider>
  );
};

export const useFormValidation = (): FormValidationContextType => {
  const context = useContext(FormValidationContext);
  if (context === undefined) {
    throw new Error('useFormValidation deve ser usado dentro de um FormValidationProvider');
  }
  return context;
};
