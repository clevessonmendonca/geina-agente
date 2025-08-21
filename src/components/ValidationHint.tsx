import React from 'react';

interface ValidationHintProps {
  fieldName: string;
  currentValue: string | number | boolean | null;
  className?: string;
}

const ValidationHint: React.FC<ValidationHintProps> = ({ fieldName, currentValue, className = '' }) => {
  const getHintForField = (fieldName: string, value: string | number | boolean | null): { message: string; type: 'info' | 'warning' } | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    const stringValue = String(value);

    switch (fieldName) {
      case 'titulo':
      case 'nome_experimento':
        if (stringValue.length < 10) {
          return {
            message: `Adicione mais detalhes ao título. Atualmente você tem ${stringValue.length} caracteres, o mínimo recomendado é 10.`,
            type: 'warning'
          };
        }
        if (stringValue.length > 120) {
          return {
            message: `Título muito longo. Você tem ${stringValue.length} caracteres, o máximo permitido é 120.`,
            type: 'warning'
          };
        }
        if (stringValue.split(' ').length < 2) {
          return {
            message: 'Use pelo menos 2 palavras no título para torná-lo mais descritivo.',
            type: 'info'
          };
        }
        if (!/[a-zA-Z]/.test(stringValue)) {
          return {
            message: 'O título deve conter pelo menos uma letra.',
            type: 'warning'
          };
        }
        return null;

      case 'descricao':
      case 'descricao_experimento':
        if (stringValue.length < 30) {
          return {
            message: `Descreva melhor sua ideia. Atualmente você tem ${stringValue.length} caracteres, o mínimo recomendado é 30.`,
            type: 'warning'
          };
        }
        if (stringValue.length > 4000) {
          return {
            message: `Descrição muito longa. Você tem ${stringValue.length} caracteres, o máximo permitido é 4000.`,
            type: 'warning'
          };
        }
        if (stringValue.split(' ').length < 5) {
          return {
            message: 'Use pelo menos 5 palavras na descrição para explicar melhor sua ideia.',
            type: 'info'
          };
        }
        if (!/[a-zA-Z]/.test(stringValue)) {
          return {
            message: 'A descrição deve conter pelo menos uma letra.',
            type: 'warning'
          };
        }
        return null;

      case 'recursos':
        if (stringValue.length < 10) {
          return {
            message: `Descreva melhor os recursos necessários. Atualmente você tem ${stringValue.length} caracteres, o mínimo recomendado é 10.`,
            type: 'warning'
          };
        }
        if (stringValue.split(' ').length < 3) {
          return {
            message: 'Use pelo menos 3 palavras para descrever os recursos necessários.',
            type: 'info'
          };
        }
        return null;

      case 'equipe':
        if (stringValue.length < 2) {
          return {
            message: 'Especifique quantas pessoas são necessárias para o projeto.',
            type: 'warning'
          };
        }
        if (!/^\d+/.test(stringValue)) {
          return {
            message: 'Comece com um número para especificar a quantidade de pessoas (ex: "3 pessoas", "5 desenvolvedores").',
            type: 'info'
          };
        }
        return null;

      case 'prazo':
        if (stringValue.length < 3) {
          return {
            message: 'Especifique um prazo mais detalhado para a implementação.',
            type: 'warning'
          };
        }
        if (!/(mes|mês|ano|semana|dia)/i.test(stringValue)) {
          return {
            message: 'Inclua uma unidade de tempo para o prazo (ex: "3 meses", "6 meses", "1 ano").',
            type: 'info'
          };
        }
        return null;

      default:
        return null;
    }
  };

  const hint = getHintForField(fieldName, currentValue);

  if (!hint) {
    return null;
  }

  const isWarning = hint.type === 'warning';
  const bgColor = isWarning ? 'bg-orange-50' : 'bg-blue-50';
  const borderColor = isWarning ? 'border-orange-200' : 'border-blue-200';
  const textColor = isWarning ? 'text-orange-800' : 'text-blue-800';
  const iconColor = isWarning ? 'text-orange-600' : 'text-blue-600';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-caixa p-3 mb-3 ${className}`}>
      <div className="flex items-start space-x-2">
        <div className={`flex-shrink-0 w-4 h-4 rounded-full ${iconColor} bg-white border ${borderColor} flex items-center justify-center`}>
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <p className={`text-xs ${textColor} leading-relaxed`}>
            {hint.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationHint;
