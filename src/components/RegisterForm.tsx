import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import Logo from './Logo';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface RegisterData {
  nome_completo: string;
  email: string;
  cargo: string;
  unidade_departamento: string;
  matricula: string;
  senha: string;
  confirmarSenha: string;
}

interface CreateUserResponse {
  success: boolean;
  message: string;
  user_id?: number;
  usuario?: Record<string, unknown>;
  status: 'success' | 'error';
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterData>({
    nome_completo: '',
    email: '',
    cargo: '',
    unidade_departamento: '',
    matricula: '',
    senha: '',
    confirmarSenha: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar mensagens quando o usuário começar a digitar
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (formData.senha !== formData.confirmarSenha) {
      const errorMsg = 'As senhas não coincidem';
      setError(errorMsg);
      showToast(errorMsg, 'error', 5000);
      return;
    }

    if (formData.senha.length < 6) {
      const errorMsg = 'A senha deve ter pelo menos 6 caracteres';
      setError(errorMsg);
      showToast(errorMsg, 'error', 5000);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_completo: formData.nome_completo,
          email: formData.email,
          cargo: formData.cargo,
          unidade_departamento: formData.unidade_departamento,
          matricula: formData.matricula,
          senha: formData.senha,
        }),
      });

      const data: CreateUserResponse = await response.json();

      if (response.ok && data.success) {
        const successMsg = data.message;
        setSuccess(successMsg);
        showToast(successMsg, 'success', 5000);
        
        // Limpar formulário após sucesso
        setFormData({
          nome_completo: '',
          email: '',
          cargo: '',
          unidade_departamento: '',
          matricula: '',
          senha: '',
          confirmarSenha: '',
        });
      } else {
        const errorMsg = data.message || 'Erro ao criar usuário';
        setError(errorMsg);
        showToast(errorMsg, 'error', 5000);
      }
    } catch (error) {
      console.error('Erro na requisição de cadastro:', error);
      const errorMsg = 'Erro de conexão. Verifique se o backend está rodando.';
      setError(errorMsg);
      showToast(errorMsg, 'error', 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="sm" variant="negative" />
        </div>
        <h2 className="text-2xl font-bold text-caixa-black mb-2">
          Solicitar Cadastro
        </h2>
        <p className="text-caixa-gray">
          Preencha os dados para solicitar seu acesso
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nome_completo" className="form-label">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome_completo"
            name="nome_completo"
            value={formData.nome_completo}
            onChange={handleChange}
            className="input-field"
            placeholder="Digite seu nome completo"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email CAIXA *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="seu.email@caixa.gov.br"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="cargo" className="form-label">
            Cargo
          </label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="input-field"
            placeholder="Ex: Analista de Sistemas"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="unidade_departamento" className="form-label">
            Unidade/Departamento
          </label>
          <input
            type="text"
            id="unidade_departamento"
            name="unidade_departamento"
            value={formData.unidade_departamento}
            onChange={handleChange}
            className="input-field"
            placeholder="Ex: TI - Desenvolvimento"
            disabled={isLoading}
          />
        </div>

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
            className="input-field"
            placeholder="Digite sua matrícula"
            required
            disabled={isLoading}
          />
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
            className="input-field"
            placeholder="Mínimo 6 caracteres"
            required
            disabled={isLoading}
          />
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
            className="input-field"
            placeholder="Confirme sua senha"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
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

      <div className="mt-8 p-4 bg-gray-50 rounded-caixa-lg">
        <h4 className="font-semibold text-caixa-black mb-2">
          Processo de Aprovação
        </h4>
        <ul className="text-sm text-caixa-gray space-y-1">
          <li>• Seu cadastro será enviado para aprovação</li>
          <li>• O gestor receberá uma notificação</li>
          <li>• Você será informado quando for aprovado</li>
          <li>• Após aprovação, você poderá fazer login</li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterForm;
