import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import { AlertTriangle, Lightbulb, Search } from 'lucide-react';
import { problemaService } from '../services/problemaService';
import type { ProblemaRequest, SolucaoSugerida } from '../services/problemaService';
import { useToast } from '../contexts/ToastContext';

const RelatarProblemaPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [solucoesReais, setSolucoesReais] = useState<SolucaoSugerida[]>([]);
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
    { value: 'TI', label: 'Tecnologia da Informação' },
    { value: 'atendimento', label: 'Atendimento' },
    { value: 'operacional', label: 'Operacional' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'RH', label: 'Recursos Humanos' },
    { value: 'juridico', label: 'Jurídico' },
    { value: 'outros', label: 'Outros' }
  ];



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validações mais específicas para corresponder ao backend
    if (!formData.titulo || formData.titulo.length < 5) {
      showToast('O título deve ter pelo menos 5 caracteres.', 'error');
      return;
    }
    
    if (!formData.descricao || formData.descricao.length < 20) {
      showToast('A descrição deve ter pelo menos 20 caracteres.', 'error');
      return;
    }
    
    if (!formData.categoria || formData.categoria.length < 3) {
      showToast('Por favor, selecione uma categoria válida.', 'error');
      return;
    }
    
    if (!formData.area || formData.area.length < 3) {
      showToast('Por favor, selecione uma área válida (mínimo 3 caracteres).', 'error');
      return;
    }
    
    if (!formData.urgencia || !formData.impacto) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Preparar dados do problema
      const problemaData: ProblemaRequest = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: formData.categoria,
        area_afetada: formData.area,
        nivel_urgencia: formData.urgencia as ProblemaRequest['nivel_urgencia'],
        impacto: formData.impacto as ProblemaRequest['impacto'],
        contato_acompanhamento: formData.contato || undefined
      };

      // Analisar o problema para encontrar soluções (sem registrar)
      const analiseResult = await problemaService.analisarProblema(problemaData);
      setSolucoesReais(analiseResult.solucoes_sugeridas || []);
      
      setIsAnalyzing(false);
      setShowSolutions(true);
      showToast('Análise concluída! Encontramos soluções para seu problema.', 'success');
    } catch (error: any) {
      console.error('Erro ao processar problema:', error);
      setIsAnalyzing(false);
      
      // Tentar extrair mensagem de erro específica
      let errorMessage = 'Erro ao analisar problema. Tente novamente.';
      
      if (error?.message) {
        if (error.message.includes('String should have at least')) {
          errorMessage = 'Verifique se todos os campos atendem aos requisitos mínimos de caracteres.';
        } else if (error.message.includes('422') || error.message.includes('Unprocessable Entity')) {
          errorMessage = 'Dados inválidos. Verifique os campos obrigatórios e tente novamente.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showToast(errorMessage, 'error');
    }
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



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caixa-black mb-2">
            Analisar Problema
          </h1>
          <p className="text-caixa-gray">
            Descreva o problema e nossa IA irá encontrar soluções baseadas nos experimentos existentes
          </p>
        </div>

        {!showSolutions ? (
          <Card>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-caixa-orange mr-3" />
                <h2 className="text-xl font-semibold text-caixa-black">
                  Descreva o Problema
                </h2>
              </div>
              <p className="text-caixa-gray">
                Quanto mais detalhada a descrição, melhor nossa IA poderá encontrar soluções relevantes nos experimentos existentes.
              </p>
            </div>

            <div className="space-y-6">
              <Input
                label="Título do Problema *"
                placeholder="Descreva o problema de forma concisa (mínimo 5 caracteres)"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                helperText={`${formData.titulo.length}/255 caracteres (mínimo 5)`}
                required
              />

              <Textarea
                label="Descrição Detalhada *"
                placeholder="Descreva o problema em detalhes, incluindo contexto, impacto atual, e possíveis causas (mínimo 20 caracteres)..."
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                helperText={`${formData.descricao.length}/2000 caracteres (mínimo 20)`}
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
                      Analisando problema...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      Analisar e Buscar Soluções
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
                  Problema Analisado
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
                  Experimentos Sugeridos pela IA
                </h2>
              </div>

              <div className="space-y-6">
                {solucoesReais.length > 0 ? (
                  solucoesReais.map((solucao, index) => (
                    <div key={solucao.id} className="border border-gray-200 rounded-caixa p-6 hover:shadow-md transition-shadow duration-200">
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
                          {solucao.relevancia && (
                            <div className="mb-2">
                              <span className="text-sm text-caixa-gray">Relevância: </span>
                              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                solucao.relevancia === 'Alta' ? 'bg-green-100 text-green-800' :
                                solucao.relevancia === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {solucao.relevancia}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button 
                          onClick={() => {
                            if (solucao.id) {
                              navigate(`/ideia/${solucao.id}`);
                            } else {
                              showToast('ID do experimento não disponível', 'error');
                            }
                          }}
                          className="px-4 py-2 text-sm font-semibold text-caixa-blue border border-caixa-blue rounded-caixa hover:bg-caixa-blue hover:text-caixa-white transition-colors duration-200"
                        >
                          Ver Detalhes
                        </button>
                        <button 
                          onClick={() => {
                            if (solucao.id) {
                              navigate(`/ideia/${solucao.id}`);
                            } else {
                              showToast('ID do experimento não disponível', 'error');
                            }
                          }}
                          className="px-4 py-2 text-sm font-semibold bg-caixa-orange text-caixa-white rounded-caixa hover:bg-orange-600 transition-colors duration-200"
                        >
                          Ver Experimento
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-lg font-semibold text-caixa-black mb-2">
                      Nenhuma solução encontrada
                    </h3>
                    <p className="text-caixa-gray mb-4">
                      Nossa IA não encontrou soluções específicas nos experimentos existentes para este problema.
                    </p>
                    <button
                      onClick={() => navigate('/nova-ideia')}
                      className="btn-primary"
                    >
                      Criar Novo Experimento
                    </button>
                  </div>
                )}
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
                    Ver Todos os Experimentos
                  </button>
                  <button
                    onClick={() => navigate('/nova-ideia')}
                    className="btn-primary"
                  >
                    Criar Novo Experimento
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
