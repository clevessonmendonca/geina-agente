import React from 'react';

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

interface AIFeedbackCardProps {
  fieldName: string;
  feedback: AIValidationResponse;
  className?: string;
}

const AIFeedbackCard: React.FC<AIFeedbackCardProps> = ({ fieldName, feedback, className = '' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getScoreBorder = (score: number) => {
    if (score >= 8) return 'border-green-200';
    if (score >= 6) return 'border-orange-200';
    return 'border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excelente';
    if (score >= 6) return 'Bom';
    return 'Precisa melhorar';
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'text-blue-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Verificar se há sugestões válidas (não vazias ou "Nenhuma sugestão")
  const hasValidSuggestions = () => {
    if (!feedback.suggestions || feedback.suggestions.length === 0) {
      return false;
    }
    
    // Verificar se todas as sugestões não são "Nenhuma sugestão" ou similares
    const noSuggestionTexts = [
      'nenhuma sugestão',
      'sem sugestões',
      'não há sugestões',
      'sem recomendações',
      'nenhuma recomendação'
    ];
    
    return feedback.suggestions.some(suggestion => {
      const message = suggestion.message.toLowerCase().trim();
      return !noSuggestionTexts.some(noText => message.includes(noText));
    });
  };

  const getFieldDisplayName = (fieldName: string) => {
    const fieldNames: Record<string, string> = {
      'nome_experimento': 'Título da Ideia',
      'descricao_experimento': 'Descrição da Ideia',
      'nome_proponente': 'Nome do Proponente',
      'matricula': 'Matrícula',
      'cgc': 'CGC',
      'unidade_gestora': 'Unidade Gestora',
      'desafio': 'Desafio',
      'hipoteses': 'Hipóteses',
      'testes_hipoteses': 'Testes das Hipóteses',
      'horizonte_inovacao': 'Horizonte de Inovação',
      'baseline': 'Baseline',
      'resultados_esperados': 'Resultados Esperados',
      'metricas_kpis': 'Métricas e KPIs',
      'diretrizes_estrategicas': 'Diretrizes Estratégicas',
      'empregados_impactados': 'Empregados Impactados',
      'areas_impactadas': 'Áreas Impactadas',
      'riscos': 'Riscos',
      'cronograma_macro': 'Cronograma Macro'
    };
    return fieldNames[fieldName] || fieldName;
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-caixa p-4 mb-3 ${className}`}>
      {/* Header com indicação clara de sugestão da IA */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5 5.67 9 6.5 9zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">
              Sugestão da IA
            </h4>
            <p className="text-xs text-blue-700">
              {getFieldDisplayName(fieldName)}
            </p>
          </div>
        </div>
        
        {/* Score e Categoria lado a lado */}
        <div className="flex items-center space-x-2">
          {/* Categoria */}
          {feedback.category && (
            <div className="px-3 py-1 rounded-full border border-blue-200 bg-blue-100">
              <div className="text-center">
                <div className="text-xs text-blue-600 font-medium">
                  {feedback.category}
                </div>
              </div>
            </div>
          )}

          {/* Score */}
          <div className={`px-3 py-1 rounded-full border ${getScoreBorder(feedback.score)} ${getScoreBackground(feedback.score)}`}>
            <div className="text-center">
              <div className={`text-sm font-bold ${getScoreColor(feedback.score)}`}>
                {feedback.score}/10
              </div>
              <div className={`text-xs ${getScoreColor(feedback.score)}`}>
                {getScoreLabel(feedback.score)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback principal compacto */}
      <div className="mb-3">
        <div className="bg-gray-50 rounded-caixa p-3">
          <p className="text-sm text-caixa-black leading-relaxed">{feedback.feedback}</p>
        </div>
      </div>

      {/* Informações adicionais (apenas horizonte, complexidade e urgência) */}
      {(feedback.horizon || feedback.complexity || feedback.urgency) && (
        <div className="mb-3">
          <h5 className="text-xs font-semibold text-blue-900 mb-2">Classificação da Ideia</h5>
          <div className="grid grid-cols-3 gap-2">
            {feedback.horizon && (
              <div className="bg-white rounded-caixa p-2 border border-blue-100">
                <div className="text-xs text-blue-600 font-medium">Horizonte</div>
                <div className="text-xs text-blue-900 font-semibold">{feedback.horizon}</div>
              </div>
            )}
            {feedback.complexity && (
              <div className="bg-white rounded-caixa p-2 border border-blue-100">
                <div className="text-xs text-blue-600 font-medium">Complexidade</div>
                <div className="text-xs text-blue-900 font-semibold capitalize">{feedback.complexity}</div>
              </div>
            )}
            {feedback.urgency && (
              <div className="bg-white rounded-caixa p-2 border border-blue-100">
                <div className="text-xs text-blue-600 font-medium">Urgência</div>
                <div className="text-xs text-blue-900 font-semibold capitalize">{feedback.urgency}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sugestões da IA - apenas se houver sugestões válidas */}
      {hasValidSuggestions() && (
        <div className="mb-3">
          <h5 className="text-xs font-semibold text-blue-900 mb-2">Sugestões da IA</h5>
          <div className="space-y-3">
            {feedback.suggestions
              .filter(suggestion => {
                const message = suggestion.message.toLowerCase().trim();
                const noSuggestionTexts = [
                  'nenhuma sugestão',
                  'sem sugestões',
                  'não há sugestões',
                  'sem recomendações',
                  'nenhuma recomendação'
                ];
                return !noSuggestionTexts.some(noText => message.includes(noText));
              })
              .map((suggestion, index) => (
                <div key={index} className="bg-white rounded-caixa p-4 border border-blue-200 shadow-sm">
                  <div className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${getSuggestionColor(suggestion.type).replace('text-', 'bg-')}`}></div>
                    <div className="flex-1">
                      <p className={`text-sm ${getSuggestionColor(suggestion.type)} font-medium leading-relaxed`}>
                        {suggestion.message}
                      </p>
                      {suggestion.example && (
                        <div className="mt-3">
                          <p className="text-sm text-blue-700 font-medium mb-2">Exemplo da IA:</p>
                          <p className="text-sm text-blue-900 italic leading-relaxed">"{suggestion.example}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Status de validação */}
      <div className="pt-2 border-t border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-blue-700">Status da validação</span>
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
            feedback.isValid 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {feedback.isValid ? 'Válido' : 'Precisa melhorar'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeedbackCard;
