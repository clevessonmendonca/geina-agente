import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    matricula: '',
    nome: '',
    email: '',
    cargo: '',
    unidade: '',
    senha: '',
    confirmarSenha: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar erros quando o usuário começar a digitar
    if (error) {
      clearError();
    }
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.matricula) {
      errors.matricula = 'Matrícula é obrigatória';
    } else if (formData.matricula.length < 6) {
      errors.matricula = 'Matrícula deve ter pelo menos 6 dígitos';
    }

    if (!formData.nome) {
      errors.nome = 'Nome é obrigatório';
    }

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'E-mail inválido';
    }

    if (!formData.cargo) {
      errors.cargo = 'Cargo é obrigatório';
    }

    if (!formData.unidade) {
      errors.unidade = 'Unidade é obrigatória';
    }

    if (!formData.senha) {
      errors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      errors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      errors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      errors.confirmarSenha = 'As senhas não coincidem';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await register(formData);
  };

  const getFieldError = (fieldName: string): string => {
    return validationErrors[fieldName] || '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return !!validationErrors[fieldName];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          {/* Logo da Caixa - placeholder */}
          <div className="w-16 h-16 bg-caixa-blue rounded-lg flex items-center justify-center">
            <span className="text-caixa-white font-bold text-xl">CAIXA</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-caixa-black mb-2">
          Solicitar Cadastro
        </h2>
        <p className="text-caixa-gray">
          Preencha seus dados para solicitar acesso
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="matricula" className="form-label">
            Matrícula CAIXA *
          </label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            className={`input-field ${hasFieldError('matricula') ? 'input-error' : ''}`}
            placeholder="Digite sua matrícula"
            required
            disabled={isLoading}
          />
          {hasFieldError('matricula') && (
            <div className="error-message">{getFieldError('matricula')}</div>
          )}
        </div>

        <div>
          <label htmlFor="nome" className="form-label">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`input-field ${hasFieldError('nome') ? 'input-error' : ''}`}
            placeholder="Digite seu nome completo"
            required
            disabled={isLoading}
          />
          {hasFieldError('nome') && (
            <div className="error-message">{getFieldError('nome')}</div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            E-mail Corporativo *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${hasFieldError('email') ? 'input-error' : ''}`}
            placeholder="seu.email@caixa.gov.br"
            required
            disabled={isLoading}
          />
          {hasFieldError('email') && (
            <div className="error-message">{getFieldError('email')}</div>
          )}
        </div>

        <div>
          <label htmlFor="cargo" className="form-label">
            Cargo *
          </label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className={`input-field ${hasFieldError('cargo') ? 'input-error' : ''}`}
            placeholder="Ex: Analista, Gerente, etc."
            required
            disabled={isLoading}
          />
          {hasFieldError('cargo') && (
            <div className="error-message">{getFieldError('cargo')}</div>
          )}
        </div>

        <div>
          <label htmlFor="unidade" className="form-label">
            Unidade/Departamento *
          </label>
          <input
            type="text"
            id="unidade"
            name="unidade"
            value={formData.unidade}
            onChange={handleChange}
            className={`input-field ${hasFieldError('unidade') ? 'input-error' : ''}`}
            placeholder="Ex: GEINA, TI, RH, etc."
            required
            disabled={isLoading}
          />
          {hasFieldError('unidade') && (
            <div className="error-message">{getFieldError('unidade')}</div>
          )}
        </div>

        <div>
          <label htmlFor="senha" className="form-label">
            Senha *
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className={`input-field ${hasFieldError('senha') ? 'input-error' : ''}`}
            placeholder="Mínimo 6 caracteres"
            required
            disabled={isLoading}
          />
          {hasFieldError('senha') && (
            <div className="error-message">{getFieldError('senha')}</div>
          )}
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="form-label">
            Confirmar Senha *
          </label>
          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            className={`input-field ${hasFieldError('confirmarSenha') ? 'input-error' : ''}`}
            placeholder="Digite a senha novamente"
            required
            disabled={isLoading}
          />
          {hasFieldError('confirmarSenha') && (
            <div className="error-message">{getFieldError('confirmarSenha')}</div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          className={`w-full ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-caixa-white mr-2"></div>
              Enviando...
            </div>
          ) : (
            'Solicitar Cadastro'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-caixa-gray">
          Já tem acesso?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-caixa-blue hover:text-caixa-blue-light font-semibold transition-colors duration-200"
          >
            Faça login
          </button>
        </p>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-caixa-lg border border-caixa-blue">
        <h4 className="font-semibold text-caixa-blue mb-2">
          Processo de Aprovação
        </h4>
        <ul className="text-sm text-caixa-gray space-y-1">
          <li>• Seu cadastro será enviado para aprovação do gestor</li>
          <li>• Você receberá um e-mail quando for aprovado</li>
          <li>• O processo pode levar até 2 dias úteis</li>
          <li>• Em caso de dúvidas, entre em contato com a GEINA</li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterForm;
