import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Select from '../components/Select';
import { Target, Zap, Star, Clock } from 'lucide-react';
import { experimentService } from '../services/experimentService';
import { useToast } from '../contexts/ToastContext';

import ScoreBreakdown from '../components/ScoreBreakdown';

interface RankedIdea {
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
  // Critérios de priorização da IA
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
}

const RankingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterPrioridade, setFilterPrioridade] = useState('');
  const [sortBy, setSortBy] = useState('scoreIA');
  const [isLoading, setIsLoading] = useState(true);
  const [rankedIdeas, setRankedIdeas] = useState<RankedIdea[]>([]);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setIsLoading(true);
      const response = await experimentService.listAllExperiments();
      
      // Converter experimentos para o formato de ranking com IA usando dados reais da API
      const convertedIdeas: RankedIdea[] = response.experiments.map(exp => {
        // Usar scores calculados pela IA no backend
        const scoreIA = exp.score_ia || 50.0;
        const prioridade = exp.prioridade_ia || 'baixa';
        const categoria = exp.categoria_ia || 'outros';
        const tags = exp.tags_ia ? exp.tags_ia.split(', ') : ['Inovação'];

        return {
          id: exp.id.toString(),
          titulo: exp.nome_experimento || 'Título não especificado',
          descricao: exp.descricao || 'Descrição não especificada',
          categoria,
          autor: exp.criador_nome || 'Usuário',
          apoios: exp.apoios || 0,
          status: (exp.status_experimento || 'em_triagem') as 'em_triagem' | 'em_execucao' | 'aprovada' | 'rejeitada' | 'implementada' | 'cancelada',
          dataCriacao: exp.data_inicio || new Date().toISOString().split('T')[0],
          impacto: exp.volume_impacto?.toLowerCase() || 'medio',
          viabilidade: exp.horizonte_inovacao === 'H1' ? 'alta' : 
                      exp.horizonte_inovacao === 'H2' ? 'media' : 'baixa',
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
          tempoEstimado: exp.horizonte_inovacao === 'H1' ? '3 meses' : 
                        exp.horizonte_inovacao === 'H2' ? '6 meses' : '12 meses',
          recursosNecessarios: `Equipe de ${exp.time_membros?.length || 1} pessoas`
        };
      });

      setRankedIdeas(convertedIdeas);
    } catch (error) {
      console.error('Erro ao carregar ideias:', error);
      showToast('Erro ao carregar ideias. Tente novamente.', 'error', 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const categorias = [
    { value: '', label: 'Todas as categorias' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'processos', label: 'Processos' },
    { value: 'atendimento', label: 'Atendimento ao Cliente' },
    { value: 'produtos', label: 'Produtos e Serviços' },
    { value: 'sustentabilidade', label: 'Sustentabilidade' },
    { value: 'outros', label: 'Outros' }
  ];

  const prioridades = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'alta', label: 'Alta Prioridade' },
    { value: 'media', label: 'Média Prioridade' },
    { value: 'baixa', label: 'Baixa Prioridade' }
  ];

  const sortOptions = [
    { value: 'scoreIA', label: 'Score IA (Recomendado)' },
    { value: 'impacto', label: 'Maior Impacto' },
    { value: 'viabilidade', label: 'Maior Viabilidade' },
    { value: 'apoios', label: 'Mais Apoiados' },
    { value: 'data', label: 'Mais Recentes' }
  ];

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

  const filteredIdeas = rankedIdeas
    .filter(idea => !filterCategoria || idea.categoria === filterCategoria)
    .filter(idea => !filterPrioridade || idea.prioridade === filterPrioridade)
    .sort((a, b) => {
      switch (sortBy) {
        case 'scoreIA':
          return b.scoreIA - a.scoreIA;
        case 'impacto': {
          const impactoOrder = { critico: 4, alto: 3, medio: 2, baixo: 1 };
          return impactoOrder[b.impacto as keyof typeof impactoOrder] - impactoOrder[a.impacto as keyof typeof impactoOrder];
        }
        case 'viabilidade': {
          const viabilidadeOrder = { 'muito-alta': 4, alta: 3, media: 2, baixa: 1 };
          return viabilidadeOrder[b.viabilidade as keyof typeof viabilidadeOrder] - viabilidadeOrder[a.viabilidade as keyof typeof viabilidadeOrder];
        }
        case 'apoios':
          return b.apoios - a.apoios;
        case 'data':
          return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caixa-blue mx-auto mb-4"></div>
              <p className="text-caixa-gray">IA analisando e priorizando ideias...</p>
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
                Ranking de Ideias - IA
              </h1>
              <p className="text-caixa-gray">
                Ideias priorizadas por inteligência artificial baseada em critérios estratégicos
              </p>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Link
                to="/relatar-problema"
                className="btn-secondary inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
                Relatar Problema
              </Link>
              <Link
                to="/nova-ideia"
                className="btn-primary inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Nova Ideia
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Categoria"
              options={categorias}
              value={filterCategoria}
              onChange={setFilterCategoria}
            />
            
            <Select
              label="Prioridade IA"
              options={prioridades}
              value={filterPrioridade}
              onChange={setFilterPrioridade}
            />
            
            <Select
              label="Ordenar por"
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />
            
            <div className="flex items-end">
              <div className="text-sm text-caixa-gray">
                <strong>{filteredIdeas.length}</strong> ideias encontradas
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de Ideias Rankeadas */}
        <div className="space-y-6">
          {filteredIdeas.map((idea, index) => (
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
                    scoreIA={idea.scoreIA}
                    prioridade={idea.prioridade}
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
                      onClick={async () => {
                        try {
                          const result = await experimentService.supportExperiment(parseInt(idea.id));
                          if (result.success) {
                            // Atualizar a lista de ideias com o novo número de apoios
                            setRankedIdeas(prevIdeas => 
                              prevIdeas.map(prevIdea => 
                                prevIdea.id === idea.id 
                                  ? { ...prevIdea, apoios: result.total_apoios }
                                  : prevIdea
                              )
                            );
                            showToast('Apoio registrado com sucesso!', 'success');
                          }
                        } catch (error) {
                          console.error('Erro ao apoiar:', error);
                          showToast('Erro ao registrar apoio. Tente novamente.', 'error');
                        }
                      }}
                      className="px-4 py-2 text-sm font-semibold text-caixa-blue border border-caixa-blue rounded-caixa hover:bg-caixa-blue hover:text-caixa-white transition-colors duration-200"
                    >
                      Apoiar
                    </button>
                    <button 
                      onClick={() => navigate(`/ideia/${idea.id}`)}
                      className="px-4 py-2 text-sm font-semibold text-caixa-gray border border-gray-300 rounded-caixa hover:bg-gray-50 transition-colors duration-200"
                    >
                      Detalhes
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold bg-caixa-orange text-caixa-white rounded-caixa hover:bg-orange-600 transition-colors duration-200">
                      Implementar
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredIdeas.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-caixa-black mb-2">
              Nenhuma ideia encontrada
            </h3>
            <p className="text-caixa-gray mb-4">
              Tente ajustar os filtros ou seja o primeiro a compartilhar uma ideia!
            </p>
            <Link to="/nova-ideia" className="btn-primary">
              Compartilhar Ideia
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
};

export default RankingPage;