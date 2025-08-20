import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-caixa-blue text-caixa-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-caixa-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-caixa-blue font-bold text-sm">CAIXA</span>
              </div>
              <h1 className="text-xl font-bold">Hacktoon</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">{user?.nome}</p>
                <p className="text-xs opacity-75">{user?.cargo} - {user?.unidade}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-4 py-2"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-caixa-black mb-2">
            Bem-vindo ao Hacktoon!
          </h2>
          <p className="text-caixa-gray">
            Plataforma de inovação da CAIXA Econômica Federal
          </p>
        </div>

        {/* Status do usuário */}
        <div className="bg-caixa-white rounded-caixa-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-caixa-black mb-4">
            Status da Conta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-caixa-gray">Matrícula</p>
              <p className="font-semibold text-caixa-black">{user?.matricula}</p>
            </div>
            <div>
              <p className="text-sm text-caixa-gray">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user?.status === 'ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : user?.status === 'pendente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {user?.status === 'ativo' ? 'Ativo' : 
                 user?.status === 'pendente' ? 'Aguardando Aprovação' : 'Inativo'}
              </span>
            </div>
            <div>
              <p className="text-sm text-caixa-gray">E-mail</p>
              <p className="font-semibold text-caixa-black">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-caixa-gray">Tipo de Usuário</p>
              <p className="font-semibold text-caixa-black capitalize">{user?.tipo}</p>
            </div>
          </div>
        </div>

        {/* Cards de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-caixa-white rounded-caixa-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-caixa-blue rounded-lg flex items-center justify-center mb-4">
              <span className="text-caixa-white font-bold">💡</span>
            </div>
            <h3 className="text-lg font-semibold text-caixa-black mb-2">
              Submeter Ideia
            </h3>
            <p className="text-caixa-gray text-sm mb-4">
              Envie suas ideias de inovação para avaliação
            </p>
            <button className="btn-primary w-full">
              Nova Ideia
            </button>
          </div>

          <div className="bg-caixa-white rounded-caixa-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-caixa-orange rounded-lg flex items-center justify-center mb-4">
              <span className="text-caixa-white font-bold">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-caixa-black mb-2">
              Minhas Ideias
            </h3>
            <p className="text-caixa-gray text-sm mb-4">
              Acompanhe o status das suas submissões
            </p>
            <button className="btn-secondary w-full">
              Visualizar
            </button>
          </div>

          <div className="bg-caixa-white rounded-caixa-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-caixa-blue-light rounded-lg flex items-center justify-center mb-4">
              <span className="text-caixa-white font-bold">🏆</span>
            </div>
            <h3 className="text-lg font-semibold text-caixa-black mb-2">
              Ranking
            </h3>
            <p className="text-caixa-gray text-sm mb-4">
              Veja as melhores ideias da plataforma
            </p>
            <button className="btn-secondary w-full">
              Ver Ranking
            </button>
          </div>
        </div>

        {/* Mensagem para usuários pendentes */}
        {user?.status === 'pendente' && (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-caixa-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-yellow-600 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Cadastro em Análise
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Seu cadastro está sendo analisado pelo gestor. Você receberá um e-mail 
                    assim que for aprovado. O processo pode levar até 2 dias úteis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
