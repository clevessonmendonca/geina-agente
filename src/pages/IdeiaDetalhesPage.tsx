import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Comments from '../components/Comments';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Zap, 
  Target, 
  Clock, 
  Users, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
  Lightbulb
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
  status: 'em-votacao' | 'aprovado' | 'rejeitado' | 'implementado';
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
  const [ideia, setIdeia] = useState<IdeiaDetalhes>({
    id: '1',
    titulo: 'Sistema de IA para Detecção de Fraudes em Tempo Real',
    descricao: 'Implementação de sistema de inteligência artificial que analisa transações em tempo real para detectar padrões suspeitos e prevenir fraudes, reduzindo perdas em até 80%.',
    categoria: 'tecnologia',
    autor: 'Maria Silva',
    autorInfo: {
      nome: 'Maria Silva',
      cargo: 'Analista de Sistemas',
      unidade: 'GEINA',
      email: 'maria.silva@caixa.gov.br'
    },
    apoios: 45,
    status: 'em-votacao',
    dataCriacao: '2024-01-15',
    dataAtualizacao: '2024-01-20',
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
    tags: ['IA', 'Segurança', 'Fraude', 'Tempo Real', 'Machine Learning'],
    tempoEstimado: '6 meses',
    recursosNecessarios: 'Equipe de 8 pessoas, R$ 2.5M',
    equipe: '8 pessoas',
    prazo: '6 meses',
    detalhes: {
      problema: 'A CAIXA enfrenta desafios significativos com fraudes em transações digitais, resultando em perdas financeiras e comprometimento da confiança dos clientes. O sistema atual de detecção é reativo e não consegue identificar padrões complexos de fraude em tempo real.',
      solucao: 'Desenvolvimento de um sistema de IA que utiliza machine learning para analisar transações em tempo real, identificando padrões suspeitos e bloqueando automaticamente transações fraudulentas antes que sejam concluídas.',
      beneficios: 'Redução de 80% nas perdas por fraude, melhoria na experiência do cliente, aumento da confiança na plataforma digital, economia de R$ 15M anuais.',
      riscos: 'Falsos positivos podem afetar transações legítimas, necessidade de treinamento da equipe, dependência de dados de qualidade.',
      alternativas: 'Sistema baseado em regras tradicionais (menos eficaz), terceirização da solução (mais custoso), implementação gradual por fases.',
      metricas: 'Taxa de detecção de fraudes, taxa de falsos positivos, tempo de resposta, ROI, satisfação do cliente.'
    },
    resumoIA: {
      analise: 'Esta ideia demonstra alto potencial de impacto e viabilidade técnica. A combinação de IA e análise em tempo real é uma solução inovadora para um problema crítico da organização.',
      pontosFortes: [
        'Alto impacto financeiro (economia de R$ 15M/ano)',
        'Tecnologia comprovada e escalável',
        'ROI positivo em menos de 6 meses',
        'Alinhamento com estratégia de segurança digital'
      ],
      pontosFracos: [
        'Investimento inicial significativo',
        'Complexidade técnica elevada',
        'Risco de falsos positivos',
        'Dependência de dados de qualidade'
      ],
      recomendacoes: [
        'Implementar em fases, começando com um piloto',
        'Investir em treinamento da equipe',
        'Estabelecer métricas claras de sucesso',
        'Criar processo de revisão de falsos positivos'
      ],
      probabilidadeSucesso: 85,
      tempoRetorno: '6 meses',
      impactoFinanceiro: 'R$ 15M/ano'
    },
    comentarios: [
      {
        id: '1',
        content: 'Excelente ideia! Isso resolveria muitos problemas que enfrentamos diariamente com fraudes.',
        author: 'João Santos',
        authorAvatar: 'JS',
        date: '2024-01-18T10:30:00Z',
        likes: 12,
        replies: [],
        isLiked: false
      },
      {
        id: '2',
        content: 'Concordo com a implementação em fases. Podemos começar com um projeto piloto em uma região específica.',
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
  });

  const [activeTab, setActiveTab] = useState<'detalhes' | 'ia' | 'comentarios'>('detalhes');

  const handleApoiar = () => {
    setIdeia(prev => ({
      ...prev,
      apoios: prev.userApoiou ? prev.apoios - 1 : prev.apoios + 1,
      userApoiou: !prev.userApoiou
    }));
  };

  const handleAddComment = (content: string) => {
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
    
    setIdeia(prev => ({
      ...prev,
      comentarios: [newComment, ...prev.comentarios]
    }));
  };

  const handleLikeComment = (commentId: string) => {
    setIdeia(prev => ({
      ...prev,
      comentarios: prev.comentarios.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      )
    }));
  };

  const handleReply = (commentId: string, content: string) => {
    const newReply = {
      id: `${commentId}.${Date.now()}`,
      content,
      author: 'Você',
      authorAvatar: 'V',
      date: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setIdeia(prev => ({
      ...prev,
      comentarios: prev.comentarios.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-votacao':
        return 'bg-blue-100 text-blue-800';
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
      case 'em-votacao':
        return 'Em Votação';
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
                <h3 className="text-lg font-semibold text-caixa-black mb-4">Critérios IA</h3>
                <div className="space-y-3">
                  {Object.entries(ideia.criterios).map(([criterio, valor]) => (
                    <div key={criterio} className="flex items-center justify-between">
                      <span className="text-caixa-gray capitalize">{criterio}:</span>
                      <span className="font-semibold text-caixa-black">{valor}%</span>
                    </div>
                  ))}
                </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">Análise da IA</h3>
              <p className="text-caixa-gray mb-4">{ideia.resumoIA.analise}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-caixa">
                  <div className="text-2xl font-bold text-green-600">{ideia.resumoIA.probabilidadeSucesso}%</div>
                  <div className="text-sm text-green-700">Probabilidade de Sucesso</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-caixa">
                  <div className="text-2xl font-bold text-blue-600">{ideia.resumoIA.tempoRetorno}</div>
                  <div className="text-sm text-blue-700">Tempo de Retorno</div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-caixa">
                <div className="text-2xl font-bold text-purple-600">{ideia.resumoIA.impactoFinanceiro}</div>
                <div className="text-sm text-purple-700">Impacto Financeiro Anual</div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Pontos Fortes
                </h3>
                <ul className="space-y-2">
                  {ideia.resumoIA.pontosFortes.map((ponto, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-caixa-gray">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  Pontos de Atenção
                </h3>
                <ul className="space-y-2">
                  {ideia.resumoIA.pontosFracos.map((ponto, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-caixa-gray">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-caixa-black mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-caixa-blue mr-2" />
                  Recomendações
                </h3>
                <ul className="space-y-2">
                  {ideia.resumoIA.recomendacoes.map((recomendacao, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-caixa-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-caixa-gray">{recomendacao}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
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
