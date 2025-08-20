import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import { AlertTriangle, Lightbulb, Search, Clock, Users, Target } from 'lucide-react';

interface Problema {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  urgencia: string;
  impacto: string;
  area: string;
  dataRelato: string;
  status: 'aberto' | 'em-analise' | 'resolvido';
}

interface SolucaoIA {
  ideiaId: string;
  titulo: string;
  descricao: string;
  scoreRelevancia: number;
  categoria: string;
  autor: string;
  matchPercent: number;
  criterios: {
    impacto: number;
    viabilidade: number;
    urgencia: number;
    alcance: number;
  };
}

const RelatarProblemaPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    urgencia: '',
    impacto: '',
    area: '',
    contato: ''
  });

  const categorias = [
    { value: '', label: 'Selecione uma categoria' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'processos', label: 'Processos' },
    { value: 'atendimento', label: 'Atendimento ao Cliente' },
    { value: 'produtos', label: 'Produtos e Serviços' },
    { value: 'sustentabilidade', label: 'Sustentabilidade' },
    { value: 'recursos-humanos', label: 'Recursos Humanos' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'outros', label: 'Outros' }
  ];

  const urgencias = [
    { value: '', label: 'Selecione a urgência' },
    { value: 'baixa', label: 'Baixa - Pode aguardar' },
    { value: 'media', label: 'Média - Precisa de atenção' },
    { value: 'alta', label: 'Alta - Urgente' },
    { value: 'critica', label: 'Crítica - Imediata' }
  ];

  const impactos = [
    { value: '', label: 'Selecione o impacto' },
    { value: 'baixo', label: 'Baixo - Poucos afetados' },
    { value: 'medio', label: 'Médio - Alguns afetados' },
    { value: 'alto', label: 'Alto - Muitos afetados' },
    { value: 'critico', label: 'Crítico - Todos afetados' }
  ];

  const areas = [
    { value: '', label: 'Selecione a área' },
    { value: 'ti', label: 'Tecnologia da Informação' },
    { value: 'atendimento', label: 'Atendimento' },
    { value: 'operacional', label: 'Operacional' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'rh', label: 'Recursos Humanos' },
    { value: 'juridico', label: 'Jurídico' },
    { value: 'outros', label: 'Outros' }
  ];

  // Mock de soluções sugeridas pela IA
  const solucoesIA: SolucaoIA[] = [
    {
      ideiaId: '1',
      titulo: 'Sistema de IA para Detecção de Fraudes em Tempo Real',
      descricao: 'Solução que pode resolver problemas de segurança e fraudes através de análise inteligente de transações.',
      scoreRelevancia: 94.5,
      categoria: 'tecnologia',
      autor: 'Maria Silva',
      matchPercent: 92,
      criterios: {
        impacto: 95,
        viabilidade: 85,
        urgencia: 90,
        alcance: 88
      }
    },
    {
      ideiaId: '2',
      titulo: 'App Mobile para Atendimento Prioritário com IA',
      descricao: 'Solução para melhorar atendimento e reduzir filas através de agendamento inteligente.',
      scoreRelevancia: 87.3,
      categoria: 'atendimento',
      autor: 'João Santos',
      matchPercent: 85,
      criterios: {
        impacto: 88,
        viabilidade: 92,
        urgencia: 85,
        alcance: 90
      }
    },
    {
      ideiaId: '3',
      titulo: 'Processo Digital de Abertura de Contas com Blockchain',
      descricao: 'Automação de processos que pode resolver problemas de lentidão e burocracia.',
      scoreRelevancia: 82.1,
      categoria: 'processos',
      autor: 'Ana Costa',
      matchPercent: 78,
      criterios: {
        impacto: 92,
        viabilidade: 75,
        urgencia: 80,
        alcance: 85
      }
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.descricao || !formData.categoria || !formData.urgencia || !formData.impacto) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simular análise da IA
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowSolutions(true);
    }, 3000);
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'baixa':
        return 'bg-green-100 text-green-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'critica':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgenciaIcon = (urgencia: string) => {
    switch (urgencia) {
      case 'baixa':
        return <Clock className="w-4 h-4" />;
      case 'media':
        return <Target className="w-4 h-4" />;
      case 'alta':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critica':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caixa-black mb-2">
            Relatar Problema
          </h1>
          <p className="text-caixa-gray">
            Descreva o problema e nossa IA irá sugerir ideias que podem solucioná-lo
          </p>
        </div>

        {!showSolutions ? (
          <Card>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-caixa-orange mr-3" />
                <h2 className="text-xl font-semibold text-caixa-black">
                  Informações do Problema
                </h2>
              </div>
              <p className="text-caixa-gray">
                Quanto mais detalhada a descrição, melhor nossa IA poderá encontrar soluções relevantes.
              </p>
            </div>

            <div className="space-y-6">
              <Input
                label="Título do Problema *"
                placeholder="Descreva o problema de forma concisa"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                required
              />

              <Textarea
                label="Descrição Detalhada *"
                placeholder="Descreva o problema em detalhes, incluindo contexto, impacto atual, e possíveis causas..."
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                rows={6}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Categoria *"
                  options={categorias}
                  value={formData.categoria}
                  onChange={(value) => handleInputChange('categoria', value)}
                  required
                />

                <Select
                  label="Área Afetada *"
                  options={areas}
                  value={formData.area}
                  onChange={(value) => handleInputChange('area', value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Nível de Urgência *"
                  options={urgencias}
                  value={formData.urgencia}
                  onChange={(value) => handleInputChange('urgencia', value)}
                  required
                />

                <Select
                  label="Impacto *"
                  options={impactos}
                  value={formData.impacto}
                  onChange={(value) => handleInputChange('impacto', value)}
                  required
                />
              </div>

              <Input
                label="Contato para Acompanhamento"
                placeholder="E-mail ou telefone para contato"
                value={formData.contato}
                onChange={(e) => handleInputChange('contato', e.target.value)}
                helperText="Opcional - para acompanhamento da resolução"
              />

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate('/ranking')}
                  className="px-6 py-3 rounded-caixa-lg font-semibold bg-gray-200 text-caixa-gray hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                  className={`
                    px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200
                    ${isAnalyzing 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'btn-primary'
                    }
                  `}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-caixa-white mr-2"></div>
                      Analisando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Soluções
                    </div>
                  )}
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Resumo do Problema */}
            <Card>
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-caixa-orange mr-3" />
                <h2 className="text-xl font-semibold text-caixa-black">
                  Problema Reportado
                </h2>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-caixa mb-4">
                <h3 className="font-semibold text-caixa-black mb-2">{formData.titulo}</h3>
                <p className="text-caixa-gray mb-3">{formData.descricao}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-caixa-gray">Categoria:</span>
                    <span className="ml-1 font-semibold text-caixa-black">
                      {categorias.find(c => c.value === formData.categoria)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-caixa-gray">Área:</span>
                    <span className="ml-1 font-semibold text-caixa-black">
                      {areas.find(a => a.value === formData.area)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-caixa-gray">Urgência:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${getUrgenciaColor(formData.urgencia)}`}>
                      {urgencias.find(u => u.value === formData.urgencia)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-caixa-gray">Impacto:</span>
                    <span className="ml-1 font-semibold text-caixa-black">
                      {impactos.find(i => i.value === formData.impacto)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Soluções Sugeridas pela IA */}
            <Card>
              <div className="flex items-center mb-6">
                <Lightbulb className="w-6 h-6 text-caixa-blue mr-3" />
                <h2 className="text-xl font-semibold text-caixa-black">
                  Soluções Sugeridas pela IA
                </h2>
              </div>

              <div className="space-y-6">
                {solucoesIA.map((solucao, index) => (
                  <div key={solucao.ideiaId} className="border border-gray-200 rounded-caixa p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-caixa-orange rounded-full flex items-center justify-center text-caixa-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-caixa-black">
                            {solucao.titulo}
                          </h3>
                        </div>
                        
                        <p className="text-caixa-gray mb-3">
                          {solucao.descricao}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-caixa-gray">
                          <span>👤 {solucao.autor}</span>
                          <span>📂 {solucao.categoria}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-caixa-blue mb-1">
                          {solucao.matchPercent}%
                        </div>
                        <div className="text-sm text-caixa-gray">Match</div>
                      </div>
                    </div>

                    {/* Critérios de Match */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-caixa">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-caixa-black">{solucao.criterios.impacto}%</div>
                        <div className="text-xs text-caixa-gray">Impacto</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-caixa-black">{solucao.criterios.viabilidade}%</div>
                        <div className="text-xs text-caixa-gray">Viabilidade</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-caixa-black">{solucao.criterios.urgencia}%</div>
                        <div className="text-xs text-caixa-gray">Urgência</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-caixa-black">{solucao.criterios.alcance}%</div>
                        <div className="text-xs text-caixa-gray">Alcance</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="px-4 py-2 text-sm font-semibold text-caixa-blue border border-caixa-blue rounded-caixa hover:bg-caixa-blue hover:text-caixa-white transition-colors duration-200">
                        Ver Detalhes
                      </button>
                      <button className="px-4 py-2 text-sm font-semibold bg-caixa-orange text-caixa-white rounded-caixa hover:bg-orange-600 transition-colors duration-200">
                        Implementar Solução
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowSolutions(false)}
                  className="px-6 py-3 rounded-caixa-lg font-semibold bg-gray-200 text-caixa-gray hover:bg-gray-300 transition-colors duration-200"
                >
                  Voltar
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate('/ranking')}
                    className="btn-secondary"
                  >
                    Ver Todas as Ideias
                  </button>
                  <button
                    onClick={() => navigate('/nova-ideia')}
                    className="btn-primary"
                  >
                    Criar Nova Ideia
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default RelatarProblemaPage;
