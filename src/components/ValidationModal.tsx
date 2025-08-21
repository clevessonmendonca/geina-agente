import React from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import type { ValidatorResponse } from '../services/validatorService';

// Função para limpar JSON da justificativa
const cleanJustificativa = (text: string): string => {
  if (!text) return '';
  
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Tenta extrair apenas o texto da justificativa se houver JSON
  if (cleaned.includes('"justificativa":')) {
    const match = cleaned.match(/"justificativa":\s*"([^"]+)"/);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Remove JSON que pode estar no início
  const jsonPattern = /^\s*\{[^}]*\}\s*/;
  cleaned = cleaned.replace(jsonPattern, '').trim();
  
  // Remove qualquer JSON restante
  cleaned = cleaned.replace(/\{[^}]*\}/g, '').trim();
  
  // Remove aspas extras que podem ter sobrado
  cleaned = cleaned.replace(/^["']+|["']+$/g, '');
  
  return cleaned;
};

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: ValidatorResponse | null;
  onContinue?: () => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  validationResult,
  onContinue
}) => {
  if (!isOpen || !validationResult) return null;

  const isApproved = validationResult.decisao;
  const confidenceColor = {
    'Alta': 'text-green-600',
    'Média': 'text-yellow-600',
    'Baixa': 'text-red-600'
  }[validationResult.confianca];

  const getConfidenceIcon = () => {
    switch (validationResult.confianca) {
      case 'Alta':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Média':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Baixa':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-caixa-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {isApproved ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <h2 className="text-xl font-semibold text-caixa-black">
              {isApproved ? 'Ideia Aprovada!' : 'Ideia Não Aprovada'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status e Confiança */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-caixa">
            <div>
              <span className="text-sm text-caixa-gray">Status da Validação:</span>
              <div className="font-semibold text-caixa-black">
                {isApproved ? 'Aprovada para continuar' : 'Não aprovada'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getConfidenceIcon()}
              <span className={`text-sm font-semibold ${confidenceColor}`}>
                Confiança: {validationResult.confianca}
              </span>
            </div>
          </div>

          {/* Justificativa */}
          <div>
            <h3 className="text-lg font-semibold text-caixa-black mb-3">
              Justificativa
            </h3>
            <p className="text-caixa-gray leading-relaxed">
              {cleanJustificativa(validationResult.justificativa)}
            </p>
          </div>

          {/* Critérios Atendidos */}
          {validationResult.criterios_atendidos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-3">
                Critérios Atendidos
              </h3>
              <div className="flex flex-wrap gap-2">
                {validationResult.criterios_atendidos.map((criterio, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
                  >
                    {criterio.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações */}
          <div>
            <h3 className="text-lg font-semibold text-caixa-black mb-3">
              Recomendações
            </h3>
            <p className="text-caixa-gray leading-relaxed">
              {cleanJustificativa(validationResult.recomendacoes)}
            </p>
          </div>

          {/* Aviso se não aprovada */}
          {!isApproved && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-caixa">
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">
                    Não é possível continuar
                  </h4>
                  <p className="text-red-700 text-sm">
                    Sua ideia não atende aos critérios necessários para ser considerada uma proposta válida. 
                    Revise o título e a descrição conforme as recomendações acima e tente novamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-caixa-gray border border-gray-300 rounded-caixa hover:bg-gray-50 transition-colors duration-200"
          >
            Fechar
          </button>
          
          {isApproved && onContinue && (
            <button
              onClick={onContinue}
              className="btn-primary"
            >
              Continuar para Próximo Passo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
