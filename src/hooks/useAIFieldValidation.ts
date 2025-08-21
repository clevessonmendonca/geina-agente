import { useState, useCallback, useEffect, useRef } from 'react';
import { useFormValidation } from '../contexts/FormValidationContext';
import { useToast } from '../contexts/ToastContext';

interface UseAIFieldValidationProps {
  fieldName: string;
  backendFieldName: string;
  minLength: number;
  debounceMs?: number;
  rateLimitMs?: number;
}

export const useAIFieldValidation = ({
  fieldName,
  backendFieldName,
  minLength,
  debounceMs = 5000,
  rateLimitMs = 30000
}: UseAIFieldValidationProps) => {
  const { validateField, updateFormData, getFieldValidation, clearValidation } = useFormValidation();
  const { showToast } = useToast();

  // Estados
  const [isApproved, setIsApproved] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastValidatedValue, setLastValidatedValue] = useState<string>('');
  const [skippedValidation, setSkippedValidation] = useState(false);
  const [lastValidationTime, setLastValidationTime] = useState<number>(0);
  const [timeout, setTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pendingToast, setPendingToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

  // Verifica se pode fazer nova validação
  const canValidate = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastValidationTime;
    return timeDiff >= rateLimitMs;
  }, [lastValidationTime, rateLimitMs]);

  // Função de validação
  const validateFieldValue = useCallback((value: string) => {
    if (value && value.length >= minLength && !isApproved && canValidate()) {
      // Verifica se houve mudança real no conteúdo
      if (value.trim() !== lastValidatedValue.trim()) {
        // Usar window.setTimeout para evitar chamar showToast durante o render
        window.setTimeout(() => {
          showToast(`IA analisando ${fieldName}...`, 'info');
        }, 0);
        updateFormData(fieldName, value);
        validateField(backendFieldName, value);
        setLastValidationTime(Date.now());
        setLastValidatedValue(value);
      } else {
        setSkippedValidation(true);
        window.setTimeout(() => setSkippedValidation(false), 3000);
      }
    }
  }, [fieldName, backendFieldName, minLength, isApproved, canValidate, lastValidatedValue, updateFormData, validateField, showToast]);

  // Handler de mudança com debounce
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    setIsTyping(true);
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    const newTimeout = window.setTimeout(() => {
      setIsTyping(false);
      validateFieldValue(value);
    }, debounceMs);
    
    setTimeout(newTimeout as any);
  }, [timeout, debounceMs, validateFieldValue]);

  // Handler de blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value && value.length >= minLength && !isApproved && canValidate()) {
      if (value.trim() !== lastValidatedValue.trim()) {
        // Usar window.setTimeout para evitar chamar showToast durante o render
        window.setTimeout(() => {
          showToast(`IA analisando ${fieldName}...`, 'info');
        }, 0);
        updateFormData(fieldName, value);
        validateField(backendFieldName, value);
        setLastValidationTime(Date.now());
        setLastValidatedValue(value);
      } else {
        setSkippedValidation(true);
        window.setTimeout(() => setSkippedValidation(false), 3000);
      }
    }
  }, [fieldName, backendFieldName, minLength, isApproved, canValidate, lastValidatedValue, updateFormData, validateField, showToast]);

  // Aprovar sugestão
  const handleApprove = useCallback((setValue: (name: string, value: string) => void) => {
    const validation = getFieldValidation(backendFieldName);
    if (validation?.suggestions?.[0]?.example) {
      setValue(fieldName, validation.suggestions[0].example);
    }
    setIsApproved(true);
    // Usar window.setTimeout para evitar chamar showToast durante o render
    window.setTimeout(() => {
      showToast(`${fieldName} aprovado e otimizado!`, 'success');
    }, 0);
  }, [fieldName, backendFieldName, getFieldValidation, showToast]);

  // Rejeitar sugestão
  const handleReject = useCallback(() => {
    setIsApproved(false);
    // Limpar a validação atual para permitir que o usuário continue
    clearValidation(backendFieldName);
    // Limpar timeout para evitar validações automáticas
    if (timeout) {
      clearTimeout(timeout);
      setTimeout(null);
    }
    setIsTyping(false);
    // Usar window.setTimeout para evitar chamar showToast durante o render
    window.setTimeout(() => {
      showToast(`Validações reativadas para ${fieldName}`, 'info');
    }, 0);
  }, [fieldName, backendFieldName, clearValidation, showToast, timeout]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeout]);

  // Obter validação atual
  const validation = getFieldValidation(backendFieldName);

  return {
    // Estados
    isApproved,
    isTyping,
    skippedValidation,
    validation,
    
    // Handlers
    handleChange,
    handleBlur,
    handleApprove,
    handleReject,
    
    // Utilitários
    canValidate: canValidate(),
    getTimeRemaining: () => {
      const now = Date.now();
      const timeDiff = now - lastValidationTime;
      const remaining = Math.max(0, rateLimitMs - timeDiff);
      return Math.ceil(remaining / 1000);
    }
  };
};
