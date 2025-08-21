import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Comments from '../components/Comments';
import { experimentService } from '../services/experimentService';
import { useToast } from '../contexts/ToastContext';
import ScoreBreakdown from '../components/ScoreBreakdown';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Zap, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
  Lightbulb,
  Brain,
  Loader2
} from 'lucide-react';

interface IdeiaDetalhes {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  autor: string;
  autorInfo: {
    nome: string;
    cargo: string;
    unidade: string;
    email: string;
  };
  apoios: number;
  status: 'aprovado' | 'rejeitado' | 'implementado';
  dataCriacao: string;
  dataAtualizacao: string;
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
  equipe: string;
  prazo: string;
  // Informações detalhadas do formulário
  detalhes: {
    problema: string;
    solucao: string;
    beneficios: string;
    riscos: string;
    alternativas: string;
    metricas: string;
  };
  // Resumo da IA
  resumoIA: {
    analise: string;
    pontosFortes: string[];
    pontosFracos: string[];
    recomendacoes: string[];
    probabilidadeSucesso: number;
    tempoRetorno: string;
    impactoFinanceiro: string;
  };
  // Comentários
  comentarios: Array<{
    id: string;
    content: string;
    author: string;
    authorAvatar: string;
    date: string;
    likes: number;
    replies: any[];
    isLiked?: boolean;
  }>;
  // Status de apoio do usuário atual
  userApoiou: boolean;
}

const IdeiaDetalhesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ideia, setIdeia] = useState<IdeiaDetalhes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'detalhes' | 'ia' | 'comentarios'>('detalhes');
  const [aiAnalysis, setAiAnalysis] = useState<{
    Resumo: string;
    PontosFortes: string;
    PontosAtencao: string;
    Recomendacoes: string;
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadIdeia();
    }
  }, [id]);

  const loadIdeia = async () => {
    try {
      setIsLoading(true);
      const experiment = await experimentService.getExperimentById(parseInt(id!));
      
      // Usar scores calculados pela IA no backend
      const scoreIA = experiment.score_ia || 50.0;
      const prioridade = experiment.prioridade_ia || 'baixa';
      const categoria = experiment.categoria_ia || 'outros';
      const tags = experiment.tags_ia ? experiment.tags_ia.split(', ') : ['Inovação'];

      // Converter experimento para o formato de detalhes da ideia
      const convertedIdeia: IdeiaDetalhes = {
        id: experiment.id.toString(),
        titulo: experiment.nome_experimento,
        descricao: experiment.descricao,
        categoria,
        autor: experiment.criador_nome || experiment.proponente_nome || 'Usuário',
        autorInfo: {
          nome: experiment.criador_nome || experiment.proponente_nome || 'Usuário',
          cargo: 'Colaborador', // TODO: Adicionar campo no backend
          unidade: experiment.unidade_gestora,
          email: 'usuario@caixa.gov.br' // TODO: Adicionar campo no backend
        },
        apoios: experiment.apoios || 0,
        status: 'aprovado',
        dataCriacao: experiment.data_inicio || new Date().toISOString().split('T')[0],
        dataAtualizacao: experiment.data_fim || new Date().toISOString().split('T')[0],
        impacto: experiment.volume_impacto?.toLowerCase() || 'medio',
        viabilidade: (experiment.horizonte_inovacao === 'H1' ? 'alta' : 
                    experiment.horizonte_inovacao === 'H2' ? 'media' : 'baixa') as 'alta' | 'media' | 'baixa',
        scoreIA,
        prioridade: prioridade as 'alta' | 'media' | 'baixa',
        criterios: {
          impacto: experiment.score_impacto || 50.0,
          viabilidade: experiment.score_viabilidade || 50.0,
          urgencia: experiment.score_urgencia || 50.0,
          alcance: experiment.score_alcance || 50.0,
          inovacao: experiment.score_inovacao || 50.0
        },
        tags,
        tempoEstimado: experiment.horizonte_inovacao === 'H1' ? '3 meses' : 
                      experiment.horizonte_inovacao === 'H2' ? '6 meses' : '12 meses',
        recursosNecessarios: `Equipe de ${experiment.time_membros?.length || 1} pessoas`,
        equipe: `${experiment.time_membros?.length || 1} pessoas`,
        prazo: experiment.horizonte_inovacao === 'H1' ? '3 meses' : 
               experiment.horizonte_inovacao === 'H2' ? '6 meses' : '12 meses',
        detalhes: {
          problema: experiment.desafio || 'Problema não especificado',
          solucao: experiment.descricao || 'Solução não especificada',
          beneficios: experiment.resultados_esperados || 'Benefícios não especificados',
          riscos: experiment.riscos?.map(r => r.descricao_risco).join(', ') || 'Riscos não especificados',
          alternativas: 'Alternativas não especificadas', // TODO: Adicionar campo no backend
          metricas: experiment.metricas_kpis || 'Métricas não especificadas'
        },
        resumoIA: {
          analise: `Esta ideia demonstra ${experiment.volume_impacto?.toLowerCase() === 'alto' ? 'alto' : 'médio'} potencial de impacto e ${experiment.horizonte_inovacao === 'H1' ? 'alta' : 'média'} viabilidade técnica.`,
          pontosFortes: [
            experiment.volume_impacto?.toLowerCase() === 'alto' ? 'Alto impacto financeiro' : 'Impacto moderado mas significativo',
            experiment.horizonte_inovacao === 'H1' ? 'Implementação rápida (H1)' : 'Prazo adequado para desenvolvimento',
            experiment.time_membros && experiment.time_membros.length > 0 ? 'Equipe já definida' : 'Flexibilidade na formação da equipe',
            experiment.metricas_kpis && experiment.metricas_kpis.length > 30 ? 'Métricas bem definidas' : 'Foco em resultados mensuráveis'
          ],
          pontosFracos: [
            experiment.riscos && experiment.riscos.length > 0 ? 'Riscos identificados que precisam de mitigação' : 'Necessidade de análise de riscos',
            experiment.horizonte_inovacao === 'H3' ? 'Prazo longo de implementação' : 'Complexidade técnica moderada',
            experiment.time_membros && experiment.time_membros.length === 0 ? 'Equipe ainda não definida' : 'Dependência de recursos externos',
            'Necessidade de investimento inicial'
          ],
          recomendacoes: [
            'Implementar em fases, começando com um piloto',
            'Investir em treinamento da equipe',
            'Estabelecer métricas claras de sucesso',
            'Criar processo de acompanhamento contínuo'
          ],
          probabilidadeSucesso: scoreIA,
          tempoRetorno: experiment.horizonte_inovacao === 'H1' ? '3 meses' : 
                       experiment.horizonte_inovacao === 'H2' ? '6 meses' : '12 meses',
          impactoFinanceiro: `Equipe de ${experiment.time_membros?.length || 1} pessoas`
        },
        comentarios: [
          {
            id: '1',
            content: 'Excelente ideia! Isso resolveria muitos problemas que enfrentamos diariamente.',
            author: 'João Santos',
            authorAvatar: 'JS',
            date: '2024-01-18T10:30:00Z',
            likes: 12,
            replies: [],
            isLiked: false
          },
          {
            id: '2',
            content: 'Concordo com a implementação em fases. Podemos começar com um projeto piloto.',
            author: 'Ana Costa',
            authorAvatar: 'AC',
            date: '2024-01-19T14:20:00Z',
            likes: 8,
            replies: [
              {
                id: '2.1',
                content: 'Ótima sugestão! Qual região você sugere para o piloto?',
                author: 'Maria Silva',
                authorAvatar: 'MS',
                date: '2024-01-19T15:00:00Z',
                likes: 3,
                replies: []
              }
            ],
            isLiked: true
          }
        ],
        userApoiou: false
      };

      setIdeia(convertedIdeia);
    } catch (error) {
      console.error('Erro ao carregar ideia:', error);
      showToast('Erro ao carregar detalhes da ideia. Tente novamente.', 'error', 5000);
    } finally {
      setIsLoading(false);
    }
  };



  const handleApoiar = async () => {
    if (!ideia) return;
    
    try {
      const result = await experimentService.supportExperiment(parseInt(ideia.id));
      
      if (result.success) {
        setIdeia(prev => prev ? {
          ...prev,
          apoios: result.total_apoios,
          userApoiou: true
        } : null);
        
        showToast('Apoio registrado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao apoiar:', error);
      showToast('Erro ao registrar apoio. Tente novamente.', 'error');
    }
  };

  const handleAddComment = (content: string) => {
    if (!ideia) return;
    
    const newComment = {
      id: Date.now().toString(),
      content,
      author: 'Você',
      authorAvatar: 'V',
      date: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false
    };
    
    setIdeia(prev => prev ? {
      ...prev,
      comentarios: [newComment, ...prev.comentarios]
    } : null);
  };

  const handleLikeComment = (commentId: string) => {
    if (!ideia) return;
    
    setIdeia(prev => prev ? {
      ...prev,
      comentarios: prev.comentarios.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      )
    } : null);
  };

  const handleReply = (commentId: string, content: string) => {
    if (!ideia) return;
    
    const newReply = {
      id: `${commentId}.${Date.now()}`,
      content,
      author: 'Você',
      authorAvatar: 'V',
      date: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setIdeia(prev => prev ? {
      ...prev,
      comentarios: prev.comentarios.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    } : null);
  };

  const performAIAnalysis = async () => {
    try {
      setAnalyzing(true);
      setAnalysisError(null);
      
      const API_BASE_URL = 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/experiments/${id}/ai-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro na análise de IA');
      }

      const data = await response.json();
      
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        throw new Error('Resposta inválida da análise');
      }
    } catch (err) {
      setAnalysisError('Erro ao realizar análise de IA');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'implementado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'implementado':
        return 'Implementado';
      default:
        return status;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caixa-blue mx-auto mb-4"></div>
              <p className="text-caixa-gray">Carregando detalhes da ideia...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!ideia) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-caixa-black mb-2">Ideia não encontrada</h2>
            <p className="text-caixa-gray mb-4">A ideia que você está procurando não existe ou foi removida.</p>
            <button
              onClick={() => navigate('/ranking')}
              className="btn-primary"
            >
              Voltar ao Ranking
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da ideia */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ranking')}
            className="flex items-center text-caixa-blue hover:text-caixa-blue-light mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Ranking
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-caixa-black mb-2">
                {ideia.titulo}
              </h1>
              <p className="text-caixa-gray text-lg mb-4">
                {ideia.descricao}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(ideia.status)}`}>
                  {getStatusLabel(ideia.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPrioridadeColor(ideia.prioridade)}`}>
                  Prioridade {ideia.prioridade}
                </span>
                <div className="flex items-center space-x-1 text-caixa-blue">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">{ideia.scoreIA.toFixed(1)}</span>
                  <span className="text-sm text-caixa-gray">Score IA</span>
                </div>
              </div>
            </div>
            
            <div className="lg:ml-6 mb-4 lg:mb-0">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleApoiar}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-caixa-lg font-semibold transition-colors duration-200 ${
                    ideia.userApoiou
                      ? 'bg-caixa-blue text-caixa-white'
                      : 'bg-caixa-white text-caixa-blue border-2 border-caixa-blue hover:bg-caixa-blue hover:text-caixa-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{ideia.userApoiou ? 'Apoiado' : 'Apoiar'}</span>
                  <span className="bg-caixa-white bg-opacity-20 px-2 py-1 rounded text-sm">
                    {ideia.apoios}
                  </span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-caixa-white text-caixa-gray border-2 border-gray-300 rounded-caixa-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do autor */}
        <Card className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-caixa-blue rounded-full flex items-center justify-center text-caixa-white font-semibold text-lg">
              {ideia.autorInfo.nome.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-caixa-black">{ideia.autorInfo.nome}</h3>
              <p className="text-sm text-caixa-gray">{ideia.autorInfo.cargo} - {ideia.autorInfo.unidade}</p>
              <p className="text-sm text-caixa-gray">{ideia.autorInfo.email}</p>
            </div>
            <div className="ml-auto text-right text-sm text-caixa-gray">
              <p>Criada em {new Date(ideia.dataCriacao).toLocaleDateString('pt-BR')}</p>
              <p>Atualizada em {new Date(ideia.dataAtualizacao).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'detalhes', label: 'Detalhes', icon: <Lightbulb className="w-4 h-4" /> },
                { id: 'ia', label: 'Análise IA', icon: <Zap className="w-4 h-4" /> },
                { id: 'comentarios', label: 'Comentários', icon: <MessageCircle className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-caixa-blue text-caixa-blue'
                      : 'border-transparent text-caixa-gray hover:text-caixa-black hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das tabs */}
        {activeTab === 'detalhes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações principais */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Problema</h3>
                <p className="text-caixa-gray">{ideia.detalhes.problema}</p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Solução Proposta</h3>
                <p className="text-caixa-gray">{ideia.detalhes.solucao}</p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Benefícios Esperados</h3>
                <p className="text-caixa-gray">{ideia.detalhes.beneficios}</p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Riscos Identificados</h3>
                <p className="text-caixa-gray">{ideia.detalhes.riscos}</p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Alternativas Consideradas</h3>
                <p className="text-caixa-gray">{ideia.detalhes.alternativas}</p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Métricas de Sucesso</h3>
                <p className="text-caixa-gray">{ideia.detalhes.metricas}</p>
              </Card>
            </div>

            {/* Sidebar com informações técnicas */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Informações Técnicas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-caixa-gray">Tempo Estimado:</span>
                    <span className="font-semibold text-caixa-black">{ideia.tempoEstimado}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caixa-gray">Equipe:</span>
                    <span className="font-semibold text-caixa-black">{ideia.equipe}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caixa-gray">Recursos:</span>
                    <span className="font-semibold text-caixa-black">{ideia.recursosNecessarios}</span>
                  </div>
                </div>
              </Card>

              <Card>
                <ScoreBreakdown
                  criterios={ideia.criterios}
                />
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {ideia.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-caixa-blue bg-opacity-10 text-caixa-blue text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'ia' && (
          <div>
            {/* Header da análise de IA */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-caixa-black flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Análise de IA
                  </h3>
                  <p className="text-caixa-gray mt-1">
                    Análise detalhada do experimento usando inteligência artificial
                  </p>
                </div>
                
                {!aiAnalysis && !analyzing && (
                  <button
                    onClick={performAIAnalysis}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Realizar Análise
                  </button>
                )}
              </div>
            </div>

            {/* Estado de análise em andamento */}
            {analyzing && (
              <Card>
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
                  <h3 className="text-lg font-medium text-caixa-black mb-2">
                    Analisando experimento...
                  </h3>
                  <p className="text-caixa-gray">
                    A IA está analisando o conteúdo do experimento. Isso pode levar alguns segundos.
                  </p>
                </div>
              </Card>
            )}

            {/* Erro na análise */}
            {analysisError && (
              <Card>
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
                  <h3 className="text-lg font-medium text-caixa-black mb-2">
                    Erro na análise
                  </h3>
                  <p className="text-caixa-gray mb-6">{analysisError}</p>
                  <button
                    onClick={performAIAnalysis}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </Card>
            )}

            {/* Análise de IA realizada */}
            {aiAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resumo */}
                <Card>
                  <div className="flex items-center mb-4">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="text-lg font-semibold text-caixa-black">Resumo Executivo</h3>
                  </div>
                  <p className="text-caixa-gray leading-relaxed whitespace-pre-line">
                    {aiAnalysis.Resumo}
                  </p>
                </Card>

                {/* Pontos Fortes */}
                <Card>
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <h3 className="text-lg font-semibold text-caixa-black">Pontos Fortes</h3>
                  </div>
                  <div className="text-caixa-gray leading-relaxed whitespace-pre-line">
                    {aiAnalysis.PontosFortes}
                  </div>
                </Card>

                {/* Pontos de Atenção */}
                <Card>
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-caixa-black">Pontos de Atenção</h3>
                  </div>
                  <div className="text-caixa-gray leading-relaxed whitespace-pre-line">
                    {aiAnalysis.PontosAtencao}
                  </div>
                </Card>

                {/* Recomendações */}
                <Card>
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    <h3 className="text-lg font-semibold text-caixa-black">Recomendações</h3>
                  </div>
                  <div className="text-caixa-gray leading-relaxed whitespace-pre-line">
                    {aiAnalysis.Recomendacoes}
                  </div>
                </Card>
              </div>
            )}

            {/* Estado inicial - sem análise */}
            {!aiAnalysis && !analyzing && !analysisError && (
              <Card>
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-caixa-black mb-2">
                    Análise de IA não realizada
                  </h3>
                  <p className="text-caixa-gray mb-6">
                    Clique no botão "Realizar Análise" para obter uma análise detalhada do experimento usando inteligência artificial.
                  </p>
                  <button
                    onClick={performAIAnalysis}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Brain className="h-4 w-4 mr-2 inline" />
                    Realizar Análise
                  </button>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'comentarios' && (
          <Card>
            <Comments
              comments={ideia.comentarios}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReply={handleReply}
            />
          </Card>
        )}
      </main>
    </div>
  );
};

export default IdeiaDetalhesPage;
