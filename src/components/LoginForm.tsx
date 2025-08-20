import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    matricula: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
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
          Acesso ao Hacktoon
        </h2>
        <p className="text-caixa-gray">
          Entre com sua matrícula CAIXA
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="matricula" className="form-label">
            Matrícula CAIXA
          </label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            className={`input-field ${error ? 'input-error' : ''}`}
            placeholder="Digite sua matrícula"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="senha" className="form-label">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className={`input-field ${error ? 'input-error' : ''}`}
            placeholder="Digite sua senha"
            required
            disabled={isLoading}
          />
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
              Entrando...
            </div>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-caixa-gray">
          Não tem acesso?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-caixa-blue hover:text-caixa-blue-light font-semibold transition-colors duration-200"
          >
            Solicite seu cadastro
          </button>
        </p>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-caixa-lg">
        <h4 className="font-semibold text-caixa-black mb-2">
          Informações Importantes
        </h4>
        <ul className="text-sm text-caixa-gray space-y-1">
          <li>• Use sua matrícula CAIXA para acesso</li>
          <li>• O cadastro será aprovado pelo seu gestor</li>
          <li>• Em caso de dúvidas, entre em contato com a GEINA</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;
