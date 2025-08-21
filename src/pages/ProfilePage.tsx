import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import Header from '../components/Header';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: user?.nome || '',
    email: user?.email || '',
    cargo: user?.cargo || '',
    unidade_departamento: user?.unidade || '',
    matricula: user?.matricula || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Aqui você pode implementar a chamada para atualizar o perfil
      // Por enquanto, vamos simular uma atualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Perfil atualizado com sucesso!', 'success', 3000);
      setIsEditing(false);
    } catch {
      showToast('Erro ao atualizar perfil. Tente novamente.', 'error', 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'true':
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'false':
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'true':
      case 'ativo':
        return 'Ativo';
      case 'false':
      case 'inativo':
        return 'Inativo';
      case 'pendente':
        return 'Aguardando Aprovação';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header da página */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-caixa-black">Meu Perfil</h1>
                <p className="text-caixa-gray">Gerencie suas informações pessoais</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card de Informações Pessoais */}
            <div className="lg:col-span-2">
              <Card>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-caixa-black">
                      Informações Pessoais
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-3 py-1 text-sm bg-caixa-blue text-white rounded-caixa hover:bg-caixa-blue-light transition-colors duration-200"
                    >
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-caixa-gray mb-2">
                        Nome Completo
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="nome_completo"
                          value={formData.nome_completo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-caixa focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
                        />
                      ) : (
                        <p className="text-caixa-black font-medium">{user?.nome}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-caixa-gray mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-caixa focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
                        />
                      ) : (
                        <p className="text-caixa-black font-medium">{user?.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-caixa-gray mb-2">
                        Cargo
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="cargo"
                          value={formData.cargo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-caixa focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
                        />
                      ) : (
                        <p className="text-caixa-black font-medium">{user?.cargo || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-caixa-gray mb-2">
                        Unidade/Departamento
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="unidade_departamento"
                          value={formData.unidade_departamento}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-caixa focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
                        />
                      ) : (
                        <p className="text-caixa-black font-medium">{user?.unidade || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-caixa-gray mb-2">
                        Matrícula
                      </label>
                      <p className="text-caixa-black font-medium">{user?.matricula}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-caixa-gray mb-2">
                        Status
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user?.status)}`}>
                        {getStatusText(user?.status)}
                      </span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-caixa-gray hover:bg-gray-100 rounded-caixa transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-caixa-blue text-white rounded-caixa hover:bg-caixa-blue-light transition-colors duration-200 disabled:opacity-50"
                      >
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Card de Estatísticas */}
            <div className="space-y-6">
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-caixa-black">
                    Estatísticas
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-caixa">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Ideias Criadas</p>
                        <p className="text-2xl font-bold text-blue-900">12</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-caixa">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Apoios Recebidos</p>
                        <p className="text-2xl font-bold text-green-900">47</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-caixa">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Comentários</p>
                        <p className="text-2xl font-bold text-orange-900">23</p>
                      </div>
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card de Ações Rápidas */}
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-caixa-black">
                    Ações Rápidas
                  </h3>
                  
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-caixa transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-caixa-blue bg-opacity-10 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-caixa-blue" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-caixa-black font-medium">Nova Ideia</span>
                      </div>
                    </button>

                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-caixa transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-caixa-black font-medium">Minhas Ideias</span>
                      </div>
                    </button>

                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-caixa transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 bg-opacity-10 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-caixa-black font-medium">Meus Comentários</span>
                      </div>
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
