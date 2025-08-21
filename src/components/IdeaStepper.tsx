import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Steps from './Steps';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import AIFeedbackCard from './AIFeedbackCard';
import ValidationHint from './ValidationHint';
import UserSelector from './UserSelector';
import LabelWithInfo from './LabelWithInfo';
import FormReview from './FormReview';
import { useFormValidation } from '../contexts/FormValidationContext';
import type { User } from '../services/userService';

interface TeamMember {
  nome: string;
  matricula: string;
}

interface Risk {
  descricao_risco: string;
  estrategia_mitigacao: string;
}

interface StepperFormData {
  // Informações do proponente
  proponente_nome: string;
  proponente_matricula: string;
  proponente_cgc: string;
  unidade_gestora: string;
  
  // Detalhes do experimento
  desafio: string;
  hipoteses: string;
  horizonte_inovacao: string;
  volume_impacto: string;
  
  // Métricas e resultados
  baseline: string;
  resultados_esperados: string;
  metricas_kpis: string;
  
  // Cronograma
  data_inicio: string;
  data_fim: string;
  
  // Termos
  termos_recursos_unidade: boolean;
  termos_registro_perdas: boolean;
  termos_notificacao_geina: boolean;
  termos_relatorios: boolean;
  aceito_termos: boolean;
  
  // Assinatura
  local_assinatura: string;
  data_assinatura: string;
  gestor_unidade: string;
  
  // Time e riscos
  time_membros: TeamMember[];
  riscos: Risk[];
}

interface IdeaStepperProps {
  titulo: string;
  descricao: string;
  onComplete: (data: StepperFormData) => void;
  isCreating?: boolean;
}

const IdeaStepper: React.FC<IdeaStepperProps> = ({ titulo, descricao, onComplete, isCreating = false }) => {
  const navigate = useNavigate();
  const { validateField, updateFormData, getFieldValidation, isValidating } = useFormValidation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<StepperFormData>({
    proponente_nome: '',
    proponente_matricula: '',
    proponente_cgc: '',
    unidade_gestora: '',
    desafio: '',
    hipoteses: '',
    horizonte_inovacao: '',
    volume_impacto: '',
    baseline: '',
    resultados_esperados: '',
    metricas_kpis: '',
    data_inicio: '',
    data_fim: '',
    termos_recursos_unidade: false,
    termos_registro_perdas: false,
    termos_notificacao_geina: false,
    termos_relatorios: false,
    aceito_termos: false,
    local_assinatura: '',
    data_assinatura: '',
    gestor_unidade: '',
    time_membros: [],
    riscos: []
  });

  const steps = [
    { 
      id: 1, 
      title: 'Proponente', 
      description: 'Dados do responsável', 
      icon: '1',
      details: 'Informações pessoais e de contato do proponente da ideia, incluindo nome, email, área de atuação e experiência profissional.'
    },
    { 
      id: 2, 
      title: 'Experimento', 
      description: 'Desafio e hipóteses', 
      icon: '2',
      details: 'Descrição detalhada do problema a ser resolvido, hipóteses de solução, público-alvo e impacto esperado da implementação.'
    },
    { 
      id: 3, 
      title: 'Métricas', 
      description: 'Indicadores e resultados', 
      icon: '3',
      details: 'Definição de métricas de sucesso, baseline atual, resultados esperados e como medir o impacto da solução proposta.'
    },
    { 
      id: 4, 
      title: 'Cronograma', 
      description: 'Datas de execução', 
      icon: '4',
      details: 'Planejamento temporal do experimento, incluindo datas de início, marcos importantes e prazo para conclusão e avaliação.'
    },
    { 
      id: 5, 
      title: 'Termos', 
      description: 'Aceitação de condições', 
      icon: '5',
      details: 'Leitura e aceitação dos termos e condições para participação no programa de inovação da CAIXA.'
    },
    { 
      id: 6, 
      title: 'Revisão', 
      description: 'Confirmação final', 
      icon: '6',
      details: 'Revisão completa de todas as informações fornecidas antes do envio final da proposta de experimento.'
    }
  ];

  const unidadesGestoras = [
    { value: 'GIHAB - Gerência Nacional de Habitação', label: 'GIHAB - Gerência Nacional de Habitação' },
    { value: 'GIRISCO - Gerência Nacional de Risco', label: 'GIRISCO - Gerência Nacional de Risco' },
    { value: 'GITI - Gerência Nacional de TI', label: 'GITI - Gerência Nacional de TI' },
    { value: 'GIATEND - Gerência Nacional de Atendimento', label: 'GIATEND - Gerência Nacional de Atendimento' },
    { value: 'GICOMPLIANCE - Gerência Nacional de Compliance', label: 'GICOMPLIANCE - Gerência Nacional de Compliance' }
  ];

  const horizontesInovacao = [
    { value: 'H1', label: 'H1 - Horizonte 1 (0-12 meses)' },
    { value: 'H2', label: 'H2 - Horizonte 2 (1-3 anos)' },
    { value: 'H3', label: 'H3 - Horizonte 3 (3-5 anos)' }
  ];

  const volumesImpacto = [
    { value: 'Baixo', label: 'Baixo' },
    { value: 'Médio', label: 'Médio' },
    { value: 'Alto', label: 'Alto' },
    { value: 'Crítico', label: 'Crítico' }
  ];

  const handleInputChange = (field: keyof StepperFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStepEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Aqui você pode chamar o serviço de PDF
      // await pdfService.generateExperimentPDF(formData);
      
      // Simular geração de PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Chamar onComplete após gerar o PDF
      onComplete(formData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Proponente
              </h3>
              <p className="text-caixa-gray mb-6">
                Preencha as informações do proponente para acompanhamento.
                {isValidating && (
                  <span className="ml-2 text-caixa-blue">🤖 IA analisando...</span>
                )}
              </p>
            </div>
            
            <LabelWithInfo
              label="Nome do Proponente *"
              info="Informações pessoais e de contato do proponente da ideia, incluindo nome, email, área de atuação e experiência profissional."
              showValidation={false}
            >
              <Input
                placeholder="Digite o nome do proponente"
                value={formData.proponente_nome}
                onChange={(e) => handleInputChange('proponente_nome', e.target.value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('proponente_nome') && (
              <AIFeedbackCard 
                fieldName="proponente_nome" 
                feedback={getFieldValidation('proponente_nome')!} 
              />
            )}
            
            <LabelWithInfo
              label="Matrícula do Proponente *"
              info="Informações pessoais e de contato do proponente da ideia, incluindo nome, email, área de atuação e experiência profissional."
            >
              <Input
                placeholder="Digite a matrícula do proponente"
                value={formData.proponente_matricula}
                onChange={(e) => handleInputChange('proponente_matricula', e.target.value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('proponente_matricula') && (
              <AIFeedbackCard 
                fieldName="proponente_matricula" 
                feedback={getFieldValidation('proponente_matricula')!} 
              />
            )}
            
            <LabelWithInfo
              label="CGC do Proponente"
              info="Informações pessoais e de contato do proponente da ideia, incluindo nome, email, área de atuação e experiência profissional."
            >
              <Input
                placeholder="Digite o CGC do proponente (opcional)"
                value={formData.proponente_cgc}
                onChange={(e) => handleInputChange('proponente_cgc', e.target.value)}
              />
            </LabelWithInfo>
            
            {getFieldValidation('proponente_cgc') && (
              <AIFeedbackCard 
                fieldName="proponente_cgc" 
                feedback={getFieldValidation('proponente_cgc')!} 
              />
            )}
            
            <LabelWithInfo
              label="Unidade Gestora *"
              info="Informações pessoais e de contato do proponente da ideia, incluindo nome, email, área de atuação e experiência profissional."
            >
              <Select
                options={unidadesGestoras}
                placeholder="Selecione a unidade gestora"
                value={formData.unidade_gestora}
                onChange={(value) => handleInputChange('unidade_gestora', value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('unidade_gestora') && (
              <AIFeedbackCard 
                fieldName="unidade_gestora" 
                feedback={getFieldValidation('unidade_gestora')!} 
              />
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Detalhes do Experimento
              </h3>
              <p className="text-caixa-gray mb-6">
                Descreva o desafio, hipóteses e horizonte de inovação.
              </p>
            </div>
            
            <LabelWithInfo
              label="Desafio *"
              info="Descrição detalhada do problema a ser resolvido, hipóteses de solução, público-alvo e impacto esperado da implementação."
            >
              <Textarea
                placeholder="Descreva o desafio que você quer resolver..."
                value={formData.desafio}
                onChange={(e) => handleInputChange('desafio', e.target.value)}
                required
                rows={4}
              />
            </LabelWithInfo>
            
            {getFieldValidation('desafio') && (
              <AIFeedbackCard 
                fieldName="desafio" 
                feedback={getFieldValidation('desafio')!} 
              />
            )}

            <LabelWithInfo
              label="Hipóteses"
              info="Descreva as hipóteses que você quer testar..."
            >
              <Textarea
                placeholder="Descreva as hipóteses que você quer testar..."
                value={formData.hipoteses}
                onChange={(e) => handleInputChange('hipoteses', e.target.value)}
                rows={4}
              />
            </LabelWithInfo>
            
            {getFieldValidation('hipoteses') && (
              <AIFeedbackCard 
                fieldName="hipoteses" 
                feedback={getFieldValidation('hipoteses')!} 
              />
            )}

            <LabelWithInfo
              label="Horizonte de Inovação *"
              info="Descrição detalhada do problema a ser resolvido, hipóteses de solução, público-alvo e impacto esperado da implementação."
            >
              <Select
                options={horizontesInovacao}
                placeholder="Selecione o horizonte de inovação"
                value={formData.horizonte_inovacao}
                onChange={(value) => handleInputChange('horizonte_inovacao', value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('horizonte_inovacao') && (
              <AIFeedbackCard 
                fieldName="horizonte_inovacao" 
                feedback={getFieldValidation('horizonte_inovacao')!} 
              />
            )}

            <LabelWithInfo
              label="Volume de Impacto *"
              info="Descrição detalhada do problema a ser resolvido, hipóteses de solução, público-alvo e impacto esperado da implementação."
            >
              <Select
                options={volumesImpacto}
                placeholder="Selecione o volume de impacto"
                value={formData.volume_impacto}
                onChange={(value) => handleInputChange('volume_impacto', value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('volume_impacto') && (
              <AIFeedbackCard 
                fieldName="volume_impacto" 
                feedback={getFieldValidation('volume_impacto')!} 
              />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Métricas e Resultados Esperados
              </h3>
              <p className="text-caixa-gray mb-6">
                Descreva o baseline, resultados esperados e métricas/KPIs.
              </p>
            </div>
            
            <LabelWithInfo
              label="Baseline"
              info="Descreva o estado atual da situação antes do experimento..."
            >
              <Textarea
                placeholder="Descreva o estado atual da situação antes do experimento..."
                value={formData.baseline}
                onChange={(e) => handleInputChange('baseline', e.target.value)}
                rows={4}
              />
            </LabelWithInfo>
            
            {getFieldValidation('baseline') && (
              <AIFeedbackCard 
                fieldName="baseline" 
                feedback={getFieldValidation('baseline')!} 
              />
            )}

            <LabelWithInfo
              label="Resultados Esperados"
              info="Descreva os resultados que você espera obter com o experimento..."
            >
              <Textarea
                placeholder="Descreva os resultados que você espera obter com o experimento..."
                value={formData.resultados_esperados}
                onChange={(e) => handleInputChange('resultados_esperados', e.target.value)}
                rows={4}
              />
            </LabelWithInfo>
            
            {getFieldValidation('resultados_esperados') && (
              <AIFeedbackCard 
                fieldName="resultados_esperados" 
                feedback={getFieldValidation('resultados_esperados')!} 
              />
            )}

            <LabelWithInfo
              label="Métricas/KPIs"
              info="Descreva as métricas e KPIs que você vai medir..."
            >
              <Textarea
                placeholder="Descreva as métricas e KPIs que você vai medir..."
                value={formData.metricas_kpis}
                onChange={(e) => handleInputChange('metricas_kpis', e.target.value)}
                rows={4}
              />
            </LabelWithInfo>
            
            {getFieldValidation('metricas_kpis') && (
              <AIFeedbackCard 
                fieldName="metricas_kpis" 
                feedback={getFieldValidation('metricas_kpis')!} 
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Cronograma
              </h3>
              <p className="text-caixa-gray mb-6">
                Preencha as datas de início e fim do experimento.
              </p>
            </div>
            
            <LabelWithInfo
              label="Data de Início *"
              info="Preencha as datas de início e fim do experimento."
            >
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => handleInputChange('data_inicio', e.target.value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('data_inicio') && (
              <AIFeedbackCard 
                fieldName="data_inicio" 
                feedback={getFieldValidation('data_inicio')!} 
              />
            )}

            <LabelWithInfo
              label="Data de Fim *"
              info="Preencha as datas de início e fim do experimento."
            >
              <Input
                type="date"
                value={formData.data_fim}
                onChange={(e) => handleInputChange('data_fim', e.target.value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('data_fim') && (
              <AIFeedbackCard 
                fieldName="data_fim" 
                feedback={getFieldValidation('data_fim')!} 
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Aceitação de Termos
              </h3>
              <p className="text-caixa-gray mb-6">
                Marque os termos que você aceita.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <LabelWithInfo
                  label="Aceito os termos de uso de recursos da unidade gestora"
                  info="Leitura e aceitação dos termos e condições para participação no programa de inovação da CAIXA."
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.termos_recursos_unidade}
                      onChange={(e) => handleInputChange('termos_recursos_unidade', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-caixa-gray">Confirmo que li e aceito</span>
                  </div>
                </LabelWithInfo>
              </div>
              <div>
                <LabelWithInfo
                  label="Aceito os termos de registro de perdas"
                  info="Leitura e aceitação dos termos e condições para participação no programa de inovação da CAIXA."
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.termos_registro_perdas}
                      onChange={(e) => handleInputChange('termos_registro_perdas', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-caixa-gray">Confirmo que li e aceito</span>
                  </div>
                </LabelWithInfo>
              </div>
              <div>
                <LabelWithInfo
                  label="Aceito os termos de notificação à GEINA"
                  info="Leitura e aceitação dos termos e condições para participação no programa de inovação da CAIXA."
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.termos_notificacao_geina}
                      onChange={(e) => handleInputChange('termos_notificacao_geina', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-caixa-gray">Confirmo que li e aceito</span>
                  </div>
                </LabelWithInfo>
              </div>
              <div>
                <LabelWithInfo
                  label="Aceito os termos de elaboração de relatórios"
                  info="Leitura e aceitação dos termos e condições para participação no programa de inovação da CAIXA."
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.termos_relatorios}
                      onChange={(e) => handleInputChange('termos_relatorios', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-caixa-gray">Confirmo que li e aceito</span>
                  </div>
                </LabelWithInfo>
              </div>
            </div>
            
            <div>
              <LabelWithInfo
                label="Declaro que li e aceito todos os termos acima"
                info="Leitura e aceitação dos termos e condições para participação no programa de inovação da CAIXA."
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.aceito_termos}
                    onChange={(e) => handleInputChange('aceito_termos', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-caixa-gray">Confirmo que li e aceito todos os termos</span>
                </div>
              </LabelWithInfo>
            </div>
            
            {getFieldValidation('aceito_termos') && (
              <AIFeedbackCard 
                fieldName="aceito_termos" 
                feedback={getFieldValidation('aceito_termos')!} 
              />
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Assinatura e Time
              </h3>
              <p className="text-caixa-gray mb-6">
                Preencha a assinatura do proponente e a data de assinatura.
              </p>
            </div>
            
            <LabelWithInfo
              label="Local de Assinatura *"
              info="Preencha a assinatura do proponente e a data de assinatura."
            >
              <Input
                placeholder="Digite o local onde você assinou"
                value={formData.local_assinatura}
                onChange={(e) => handleInputChange('local_assinatura', e.target.value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('local_assinatura') && (
              <AIFeedbackCard 
                fieldName="local_assinatura" 
                feedback={getFieldValidation('local_assinatura')!} 
              />
            )}

            <LabelWithInfo
              label="Data de Assinatura *"
              info="Preencha a assinatura do proponente e a data de assinatura."
            >
              <Input
                type="date"
                value={formData.data_assinatura}
                onChange={(e) => handleInputChange('data_assinatura', e.target.value)}
                required
              />
            </LabelWithInfo>
            
            {getFieldValidation('data_assinatura') && (
              <AIFeedbackCard 
                fieldName="data_assinatura" 
                feedback={getFieldValidation('data_assinatura')!} 
              />
            )}

            <div>
              <h4 className="font-semibold text-caixa-black mb-4">Membros do Time</h4>
              
              {/* Lista de membros selecionados */}
              {formData.time_membros.length === 0 && (
                <p className="text-caixa-gray mb-4">Nenhum membro adicionado ainda.</p>
              )}
              
              {formData.time_membros.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <div>
                    <span className="font-medium text-caixa-black">{member.nome}</span>
                    <span className="text-caixa-gray ml-2">({member.matricula})</span>
                  </div>
                  <button
                    onClick={() => {
                      const newMembers = formData.time_membros.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, time_membros: newMembers }));
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                    title="Remover membro"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {/* Seletor de usuários */}
              <div className="mt-4">
                <UserSelector
                  selectedUsers={formData.time_membros.map(member => ({
                    user_id: 0, // Placeholder, será substituído quando selecionado
                    nome_completo: member.nome,
                    email: '',
                    cargo: '',
                    unidade_departamento: '',
                    matricula: member.matricula,
                    status: true
                  }))}
                  onUserSelect={(user: User) => {
                    // Verificar se o usuário já foi adicionado
                    const isAlreadyAdded = formData.time_membros.some(
                      member => member.matricula === user.matricula
                    );
                    
                    if (!isAlreadyAdded) {
                      setFormData(prev => ({
                        ...prev,
                        time_membros: [...prev.time_membros, {
                          nome: user.nome_completo,
                          matricula: user.matricula
                        }]
                      }));
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-caixa-black mb-4">Riscos Identificados</h4>
              
              {formData.riscos.length === 0 && (
                <p className="text-caixa-gray mb-4">Nenhum risco identificado ainda.</p>
              )}
              
              {formData.riscos.map((risk, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 border-l-4 border-caixa-orange">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-caixa-black mb-2">Risco: {risk.descricao_risco}</h5>
                      <p className="text-caixa-gray text-sm">
                        <span className="font-medium">Estratégia de Mitigação:</span> {risk.estrategia_mitigacao}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newRisks = formData.riscos.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, riscos: newRisks }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded ml-2"
                      title="Remover risco"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    riscos: [...prev.riscos, { descricao_risco: '', estrategia_mitigacao: '' }]
                  }));
                }}
                className="mt-4 px-4 py-2 bg-caixa-blue text-white rounded-lg hover:bg-caixa-dark-blue transition-colors duration-200"
              >
                Adicionar Risco
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Revisão Final
              </h3>
              <p className="text-caixa-gray mb-6">
                Revise todas as informações antes de enviar sua proposta de experimento.
              </p>
            </div>

            <FormReview
              formData={formData}
              onEdit={handleStepEdit}
              onGeneratePDF={handleGeneratePDF}
              isGeneratingPDF={isGeneratingPDF}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return Boolean(formData.proponente_nome && formData.proponente_matricula);
      case 1:
        return Boolean(formData.desafio && formData.hipoteses && formData.horizonte_inovacao && formData.volume_impacto);
      case 2:
        return Boolean(formData.baseline && formData.resultados_esperados && formData.metricas_kpis);
      case 3:
        return Boolean(formData.data_inicio && formData.data_fim);
      case 4:
        return Boolean(formData.aceito_termos);
      default:
        return true;
    }
  };

  return (
    <>
      <Card className="mb-8">
        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepClick={(stepId) => {
            const stepIndex = steps.findIndex(s => s.id === stepId);
            if (stepIndex <= currentStep) {
              setCurrentStep(stepIndex);
            }
          }}
        />
      </Card>

      <Card>
        {renderStepContent()}
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0 || isCreating}
            className={`
              px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200
              ${currentStep === 0 || isCreating
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-caixa-white text-caixa-blue border-2 border-caixa-blue hover:bg-caixa-blue hover:text-caixa-white'
              }
            `}
          >
            Anterior
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/projects')}
              disabled={isCreating}
              className={`px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200 ${
                isCreating 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-caixa-gray hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            
            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isCreating}
                className={`px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200 ${
                  canProceed() && !isCreating
                    ? 'btn-primary'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isCreating ? 'Criando Experimento...' : 'Enviar Ideia'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed() || isCreating}
                className={`
                  px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200
                  ${canProceed() && !isCreating
                    ? 'btn-primary' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default IdeaStepper;
