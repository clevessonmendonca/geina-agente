import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Select from '../components/Select';
import { TrendingUp, Users, Target, Zap, Star, Clock, Award } from 'lucide-react';

interface RankedIdea {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  autor: string;
  apoios: number;
  status: 'em-votacao' | 'aprovado' | 'rejeitado' | 'implementado';
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
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterPrioridade, setFilterPrioridade] = useState('');
  const [sortBy, setSortBy] = useState('scoreIA');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data com critérios de priorização da IA
  const rankedIdeas: RankedIdea[] = [
    {
      id: '1',
      titulo: 'Sistema de IA para Detecção de Fraudes em Tempo Real',
      descricao: 'Implementação de sistema de inteligência artificial que analisa transações em tempo real para detectar padrões suspeitos e prevenir fraudes, reduzindo perdas em até 80%.',
      categoria: 'tecnologia',
      autor: 'Maria Silva',
      apoios: 45,
      status: 'em-votacao',
      dataCriacao: '2024-01-15',
      impacto: 'critico',
      viabilidade: 'alta',
      scoreIA: 94.5,
      prioridade: 'alta',
      criterios: {
        impacto: 95,
        viabilidade: 85,
        urgencia: 90,
        alcance: 88,
        inovacao: 92
      },
      tags: ['IA', 'Segurança', 'Fraude', 'Tempo Real'],
      tempoEstimado: '6 meses',
      recursosNecessarios: 'Equipe de 8 pessoas, R$ 2.5M'
    },
    {
      id: '2',
      titulo: 'App Mobile para Atendimento Prioritário com IA',
      descricao: 'Aplicativo mobile com inteligência artificial para agendamento inteligente de atendimento, reduzindo filas em 70% e melhorando a experiência do cliente.',
      categoria: 'atendimento',
      autor: 'João Santos',
      apoios: 32,
      status: 'aprovado',
      dataCriacao: '2024-01-10',
      impacto: 'alto',
      viabilidade: 'alta',
      scoreIA: 89.2,
      prioridade: 'alta',
      criterios: {
        impacto: 88,
        viabilidade: 92,
        urgencia: 85,
        alcance: 90,
        inovacao: 87
      },
      tags: ['Mobile', 'IA', 'Atendimento', 'UX'],
      tempoEstimado: '4 meses',
      recursosNecessarios: 'Equipe de 6 pessoas, R$ 1.8M'
    },
    {
      id: '3',
      titulo: 'Processo Digital de Abertura de Contas com Blockchain',
      descricao: 'Automação completa do processo de abertura de contas usando blockchain para validação de documentos, eliminando papel e reduzindo tempo em 70%.',
      categoria: 'processos',
      autor: 'Ana Costa',
      apoios: 28,
      status: 'em-votacao',
      dataCriacao: '2024-01-12',
      impacto: 'critico',
      viabilidade: 'media',
      scoreIA: 82.7,
      prioridade: 'media',
      criterios: {
        impacto: 92,
        viabilidade: 75,
        urgencia: 80,
        alcance: 85,
        inovacao: 78
      },
      tags: ['Blockchain', 'Digitalização', 'Processos', 'Documentos'],
      tempoEstimado: '8 meses',
      recursosNecessarios: 'Equipe de 10 pessoas, R$ 3.2M'
    },
    {
      id: '4',
      titulo: 'Sistema de Gestão de Energia Sustentável com IoT',
      descricao: 'Implementação de sistema IoT para monitoramento e otimização do consumo de energia nas agências, promovendo sustentabilidade e reduzindo custos.',
      categoria: 'sustentabilidade',
      autor: 'Carlos Lima',
      apoios: 22,
      status: 'em-votacao',
      dataCriacao: '2024-01-14',
      impacto: 'medio',
      viabilidade: 'alta',
      scoreIA: 78.4,
      prioridade: 'media',
      criterios: {
        impacto: 75,
        viabilidade: 88,
        urgencia: 70,
        alcance: 80,
        inovacao: 82
      },
      tags: ['IoT', 'Sustentabilidade', 'Energia', 'Monitoramento'],
      tempoEstimado: '5 meses',
      recursosNecessarios: 'Equipe de 5 pessoas, R$ 1.5M'
    }
  ];

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

  useEffect(() => {
    // Simular carregamento da IA
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
        case 'impacto':
          const impactoOrder = { critico: 4, alto: 3, medio: 2, baixo: 1 };
          return impactoOrder[b.impacto as keyof typeof impactoOrder] - impactoOrder[a.impacto as keyof typeof impactoOrder];
        case 'viabilidade':
          const viabilidadeOrder = { 'muito-alta': 4, alta: 3, media: 2, baixa: 1 };
          return viabilidadeOrder[b.viabilidade as keyof typeof viabilidadeOrder] - viabilidadeOrder[a.viabilidade as keyof typeof viabilidadeOrder];
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
                <span className="mr-2">🚨</span>
                Relatar Problema
              </Link>
              <Link
                to="/nova-ideia"
                className="btn-primary inline-flex items-center"
              >
                <span className="mr-2">💡</span>
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

                {/* Critérios da IA */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-caixa">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-caixa-black">{idea.criterios.impacto}%</div>
                    <div className="text-xs text-caixa-gray">Impacto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-caixa-black">{idea.criterios.viabilidade}%</div>
                    <div className="text-xs text-caixa-gray">Viabilidade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-caixa-black">{idea.criterios.urgencia}%</div>
                    <div className="text-xs text-caixa-gray">Urgência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-caixa-black">{idea.criterios.alcance}%</div>
                    <div className="text-xs text-caixa-gray">Alcance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-caixa-black">{idea.criterios.inovacao}%</div>
                    <div className="text-xs text-caixa-gray">Inovação</div>
                  </div>
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
                    <button className="px-4 py-2 text-sm font-semibold text-caixa-blue border border-caixa-blue rounded-caixa hover:bg-caixa-blue hover:text-caixa-white transition-colors duration-200">
                      Votar
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
