import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { Zap, Target, Clock, Star } from 'lucide-react';
import { experimentService } from '../services/experimentService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import ScoreBreakdown from '../components/ScoreBreakdown';

interface MinhaIdeia {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  autor: string;
  apoios: number;
  status: 'em_triagem' | 'em_execucao' | 'aprovada' | 'rejeitada' | 'implementada' | 'cancelada';
  dataCriacao: string;
  impacto: string;
  viabilidade: string;
  scoreIA: number;
  prioridade: 'alta' | 'media' | 'baixa';
  criterios: {
    impacto: number;
    viabilidade: number;
    urgencia: number;
    alcance: number;
    inovacao: number;
  };
  tags: string[];
  tempoEstimado: string;
  recursosNecessarios: string;
  autorGenero?: 'feminino' | 'masculino' | 'nao_informar';
}

const MinhasIdeiasPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [minhasIdeias, setMinhasIdeias] = useState<MinhaIdeia[]>([]);

  useEffect(() => {
    if (user?.user_id) {
      carregarMinhasIdeias();
    }
  }, [user]);

  // Função para apoiar uma ideia
  const handleApoiar = async (ideiaId: string) => {
    try {
      await experimentService.supportExperiment(Number(ideiaId));
      showToast('Ideia apoiada com sucesso!', 'success');
      carregarMinhasIdeias(); // Recarregar a lista após apoiar
    } catch (error) {
      console.error('Erro ao apoiar ideia:', error);
      showToast('Erro ao apoiar ideia. Tente novamente.', 'error');
    }
  };

  // Função para implementar uma ideia
  const handleImplementar = (ideiaId: string) => {
    // Navegar para a página de implementação ou mostrar modal
    navigate(`/ideia/${ideiaId}/implementar`);
  };
  
  const carregarMinhasIdeias = async () => {
    try {
      setIsLoading(true);
      // Usar o ID do usuário logado para buscar apenas suas ideias
      console.log('Carregando ideias para o usuário:', user);
      
      if (!user?.user_id) {
        console.error('ID do usuário não disponível');
        showToast('Erro ao identificar usuário. Tente fazer login novamente.', 'error', 5000);
        setIsLoading(false);
        return;
      }
      
      // Buscar todos os experimentos e filtrar localmente pelo user_id
      const response = await experimentService.listAllExperiments();
      console.log('Resposta da API (todos experimentos):', response);
      
      // Filtrar experimentos que pertencem ao usuário logado
      const filteredExperiments = response.experiments.filter(exp => {
        console.log(`Comparando: exp.user_id=${exp.user_id} (${typeof exp.user_id}) com user.user_id=${user.user_id} (${typeof user.user_id})`);
        console.log(`Nome do criador: ${exp.criador_nome}, Nome do usuário: ${user.nome}`);
        
        // Verificar se o ID do usuário corresponde
        const idMatch = exp.user_id !== undefined && Number(exp.user_id) === Number(user.user_id);
        
        // Verificar se o nome do criador corresponde ao nome do usuário (caso alternativo)
        const nameMatch = exp.criador_nome === user.nome;
        
        return idMatch || nameMatch;
      });
      
      console.log('Experimentos filtrados para o usuário:', filteredExperiments);

      // Converter experimentos filtrados para o formato de ideias
      const ideiasConvertidas: MinhaIdeia[] = filteredExperiments.map(exp => {
        const scoreIA = exp.score_ia || 50.0;
        const prioridade = exp.prioridade_ia || 'baixa';
        const categoria = exp.categoria_ia || 'outros';
        const tags = exp.tags_ia ? exp.tags_ia.split(', ') : ['Inovação'];
        
        // Definir o gênero do autor com base no campo experimento_feminino da API
        let autorGenero: 'feminino' | 'masculino' | 'nao_informar' = 'nao_informar';
        if (exp.experimento_feminino === true) {
          autorGenero = 'feminino';
        } else if (exp.tags_ia?.includes('Mulher Inovadora')) {
          autorGenero = 'feminino';
        }

        return {
          id: exp.id.toString(),
          titulo: exp.nome_experimento || 'Título não especificado',
          descricao: exp.descricao || 'Descrição não especificada',
          categoria,
          autor: exp.criador_nome || user?.nome || 'Usuário',
          apoios: exp.apoios || 0,
          status: (exp.status_experimento || 'em_triagem') as 'em_triagem' | 'em_execucao' | 'aprovada' | 'rejeitada' | 'implementada' | 'cancelada',
          dataCriacao: exp.data_inicio || new Date().toISOString().split('T')[0],
          impacto: exp.volume_impacto?.toLowerCase() || 'medio',
          viabilidade: exp.horizonte_inovacao === 'H1' ? 'alta' : exp.horizonte_inovacao === 'H2' ? 'media' : 'baixa',
          scoreIA,
          prioridade: prioridade as 'alta' | 'media' | 'baixa',
          criterios: {
            impacto: exp.score_impacto || 50.0,
            viabilidade: exp.score_viabilidade || 50.0,
            urgencia: exp.score_urgencia || 50.0,
            alcance: exp.score_alcance || 50.0,
            inovacao: exp.score_inovacao || 50.0
          },
          tags,
          tempoEstimado: exp.horizonte_inovacao === 'H1' ? '3 meses' : exp.horizonte_inovacao === 'H2' ? '6 meses' : '12 meses',
          recursosNecessarios: `Equipe de ${exp.time_membros?.length || 1} pessoas`,
          autorGenero
        };
      });

      setMinhasIdeias(ideiasConvertidas);
    } catch (error) {
      console.error('Erro ao carregar minhas ideias:', error);
      showToast('Erro ao carregar suas ideias. Tente novamente.', 'error', 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadeIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Zap className="w-4 h-4" />;
      case 'media':
        return <Target className="w-4 h-4" />;
      case 'baixa':
        return <Clock className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caixa-blue mx-auto mb-4"></div>
              <p className="text-caixa-gray">Carregando suas ideias...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-caixa-black mb-2">
                Minhas Ideias
              </h1>
              <p className="text-caixa-gray">
                Visualize e gerencie todas as ideias que você compartilhou
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Minhas Ideias */}
        <div className="space-y-6">
          {minhasIdeias.length > 0 ? (
            minhasIdeias.map((idea, index) => (
              <Card key={idea.id} variant="elevated" className="relative">
                {/* Badge de Ranking */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-caixa-orange rounded-full flex items-center justify-center text-caixa-white font-bold text-lg shadow-lg">
                  #{index + 1}
                </div>

                <div className="ml-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-caixa-black">
                          {idea.titulo}
                        </h3>
                        <div className={`flex items-center px-2 py-1 rounded-full border text-xs font-semibold ${getPrioridadeColor(idea.prioridade)}`}>
                          {getPrioridadeIcon(idea.prioridade)}
                          <span className="ml-1 capitalize">{idea.prioridade}</span>
                        </div>
                      </div>

                      <p className="text-caixa-gray mb-3">
                        {idea.descricao}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {idea.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-caixa-blue bg-opacity-10 text-caixa-blue text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {/* Selo Mulher Inovadora (exibição baseada no campo autorGenero) */}
                        {idea.autorGenero === 'feminino' && (
                          <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">♀ Mulher Inovadora</span>
                        )}
                      </div>
                    </div>

                    {/* Score IA */}
                    <div className="lg:ml-6 mb-4 lg:mb-0">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-caixa-blue mb-1">
                          {idea.scoreIA.toFixed(1)}
                        </div>
                        <div className="text-sm text-caixa-gray">Score IA</div>
                      </div>
                    </div>
                  </div>

                  {/* Score IA com Breakdown */}
                  <div className="mb-4">
                    <ScoreBreakdown
                      criterios={idea.criterios}
                    />
                  </div>

                  {/* Informações Adicionais */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-caixa-gray">Tempo Estimado:</span>
                      <span className="ml-1 font-semibold text-caixa-black">{idea.tempoEstimado}</span>
                    </div>
                    <div>
                      <span className="text-caixa-gray">Recursos:</span>
                      <span className="ml-1 font-semibold text-caixa-black">{idea.recursosNecessarios}</span>
                    </div>
                    <div>
                      <span className="text-caixa-gray">Apoios:</span>
                      <span className="ml-1 font-semibold text-caixa-blue">{idea.apoios}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-caixa-gray">
                      <span>👤 {idea.autor}</span>
                      <span>📅 {new Date(idea.dataCriacao).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/ideia/${idea.id}`)}
                        className="px-4 py-2 text-sm font-semibold text-caixa-gray border border-gray-300 rounded-caixa hover:bg-gray-50 transition-colors duration-200"
                      >
                        Detalhes
                      </button>
                      <button 
                        className="px-4 py-2 text-sm font-semibold bg-caixa-blue text-caixa-white rounded-caixa hover:bg-blue-600 transition-colors duration-200"
                        onClick={() => navigate(`/ideia/${idea.id}/editar`)}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-caixa-black mb-2">
                Você ainda não compartilhou nenhuma ideia
              </h3>
              <p className="text-caixa-gray mb-4">
                Que tal compartilhar sua primeira ideia inovadora?
              </p>
              <button 
                onClick={() => navigate('/nova-ideia')} 
                className="btn-primary"
              >
                Compartilhar Ideia
              </button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MinhasIdeiasPage;