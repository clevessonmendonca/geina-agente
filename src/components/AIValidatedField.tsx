import React from 'react';
import Input from './Input';
import Textarea from './Textarea';
import ValidationHint from './ValidationHint';
import AIFeedbackCard from './AIFeedbackCard';
import { useAIFieldValidation } from '../hooks/useAIFieldValidation';

interface AIValidatedFieldProps {
  fieldName: string;
  backendFieldName: string;
  label: string;
  placeholder: string;
  type: 'input' | 'textarea';
  minLength: number;
  maxLength?: number;
  rows?: number;
  error?: string;
  required?: boolean;
  register: any;
  setValue: any;
  watch: any;
}

const AIValidatedField: React.FC<AIValidatedFieldProps> = ({
  fieldName,
  backendFieldName,
  label,
  placeholder,
  type,
  minLength,
  maxLength,
  rows = 6,
  error,
  required = false,
  register,
  setValue,
  watch
}) => {
  const {
    isApproved,
    validation,
    handleChange,
    handleBlur,
    handleApprove,
    handleReject
  } = useAIFieldValidation({
    fieldName,
    backendFieldName,
    minLength
  });

  const currentValue = watch(fieldName);

  // Verificar se há sugestões válidas para mostrar o botão de aprovar
  const hasValidSuggestions = () => {
    if (!validation?.suggestions || validation.suggestions.length === 0) {
      console.log('No suggestions found');
      return false;
    }
    
    const noSuggestionTexts = [
      'nenhuma sugestão',
      'sem sugestões',
      'não há sugestões',
      'sem recomendações',
      'nenhuma recomendação',
      'não há recomendações',
      'texto adequado',
      'texto está adequado',
      'bom texto',
      'texto bom'
    ];
    
    const hasValidSuggestion = validation.suggestions.some(suggestion => {
      const message = suggestion.message.toLowerCase().trim();
      const hasNoText = noSuggestionTexts.some(noText => message.includes(noText));
      console.log('Suggestion:', message, 'Has no text:', hasNoText);
      return !hasNoText;
    });
    
    console.log('Has valid suggestions:', hasValidSuggestion);
    return hasValidSuggestion;
  };

  const fieldProps = {
    label: `${label}${required ? ' *' : ''}`,
    placeholder,
    error,
    required,
    className: isApproved ? 'border-green-500 bg-green-50' : '',
    ...register(fieldName)
  };

  // Adicionar event listeners separadamente para não interferir com react-hook-form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Primeiro chama o onChange do react-hook-form
    const reactHookFormOnChange = register(fieldName).onChange;
    if (reactHookFormOnChange) {
      reactHookFormOnChange(e);
    }
    // Depois chama o handleChange para validação da IA
    handleChange(e);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Primeiro chama o onBlur do react-hook-form
    const reactHookFormOnBlur = register(fieldName).onBlur;
    if (reactHookFormOnBlur) {
      reactHookFormOnBlur(e);
    }
    // Depois chama o handleBlur para validação da IA
    handleBlur(e);
  };

  return (
    <div className="space-y-3">
      <div className={`relative`}>
        {type === 'input' ? (
          <Input 
            {...fieldProps} 
            maxLength={maxLength}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        ) : (
          <Textarea 
            {...fieldProps} 
            rows={rows} 
            maxLength={maxLength}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        )}
        
        {/* Botão de rejeição para campos aprovados */}
        {isApproved && (
          <div className="absolute top-4 -right-2">
            <button
              onClick={handleReject}
              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              title="Reativar validações"
            >
              ↺
            </button>
          </div>
        )}
      </div>

      {/* Dica de validação */}
      <ValidationHint 
        fieldName={fieldName} 
        currentValue={currentValue} 
      />
      
      {/* Feedback da IA */}
      {validation && !isApproved && (
        <div>
          <AIFeedbackCard 
            fieldName={fieldName} 
            feedback={validation} 
          />
          {/* Botões de ação - sempre mostrar se há validação */}
          <div className="flex justify-end mt-3 space-x-2">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-gray-500 text-white rounded-caixa text-sm font-medium hover:bg-gray-600 transition-colors shadow-sm"
            >
              Ignorar sugestões
            </button>
            {hasValidSuggestions() && (
              <button
                onClick={() => handleApprove(setValue)}
                className="px-4 py-2 bg-green-600 text-white rounded-caixa text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                Aprovar sugestão
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIValidatedField;
