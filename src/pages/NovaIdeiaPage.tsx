import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import IdeaStepper from '../components/IdeaStepper';
import AIValidatedField from '../components/AIValidatedField';
import ValidationModal from '../components/ValidationModal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormValidation } from '../contexts/FormValidationContext';
import { useToast } from '../contexts/ToastContext';
import { validatorService } from '../services/validatorService';
import type { ValidatorResponse } from '../services/validatorService';
import { experimentService } from '../services/experimentService';

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
  time_membros: Array<{ nome: string; matricula: string }>;
  riscos: Array<{ descricao_risco: string; estrategia_mitigacao: string }>;
}

const NovaIdeiaPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateFormData } = useFormValidation();
  const { showToast } = useToast();
  const [isBasicValidated, setIsBasicValidated] = useState(false);
  const [basicServerError, setBasicServerError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidatorResponse | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isCreatingExperiment, setIsCreatingExperiment] = useState(false);

  const basicIdeaSchema = z.object({
    titulo: z
      .string()
      .min(4, 'Informe um título com pelo menos 4 caracteres')
      .max(120, 'Título muito longo (máx. 120 caracteres).'),
    descricao: z
      .string()
      .min(20, 'Descreva sua ideia com pelo menos 20 caracteres')
      .max(4000, 'Descrição muito longa (máx. 4000 caracteres).')
  });

  type BasicIdeaForm = z.infer<typeof basicIdeaSchema>;

  const {
    register,
    handleSubmit: handleBasicSubmit,
    formState: { errors: basicErrors, isSubmitting: isBasicSubmitting },
    watch,
    getValues,
    setValue
  } = useForm<BasicIdeaForm>({
    resolver: zodResolver(basicIdeaSchema)
  });

  const watchTitulo = watch('titulo');
  const watchDescricao = watch('descricao');

  // Atualiza formData sempre que os valores mudarem
  useEffect(() => {
    if (watchTitulo) {
      updateFormData('titulo', watchTitulo);
    }
  }, [watchTitulo, updateFormData]);

  useEffect(() => {
    if (watchDescricao) {
      updateFormData('descricao', watchDescricao);
    }
  }, [watchDescricao, updateFormData]);

  useEffect(() => {
    if (watchDescricao) {
      updateFormData('descricao', watchDescricao);
    }
  }, [watchDescricao, updateFormData]);

  const validateIdeaWithWatson = async (payload: BasicIdeaForm): Promise<ValidatorResponse> => {
    try {
      setIsValidating(true);
      showToast('Validando ideia com IA...', 'info', 3000);
      
      const result = await validatorService.validateIdea({
        titulo: payload.titulo,
        descricao: payload.descricao
      });
      
      return result;
    } catch (error) {
      console.error('Erro na validação:', error);
      showToast('Erro ao validar ideia. Tente novamente.', 'error', 5000);
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  const onBasicSubmit = async (values: BasicIdeaForm) => {
    setBasicServerError(null);
    
    try {
      // Valida com o Watson AI
      const validationResult = await validateIdeaWithWatson(values);
      
      // Se aprovada, passa direto para o próximo step
      if (validationResult.decisao) {
        setIsBasicValidated(true);
        showToast('Ideia aprovada! Continuando para o próximo passo...', 'success', 3000);
      } else {
        // Se não aprovada, mostra o modal com as recomendações
        setValidationResult(validationResult);
        setShowValidationModal(true);
        showToast('Ideia não aprovada. Revise conforme as recomendações.', 'error', 5000);
      }
    } catch (error) {
      console.error('Erro na validação:', error);
      setBasicServerError('Erro ao validar ideia. Tente novamente.');
    }
  };

  const handleValidationModalClose = () => {
    setShowValidationModal(false);
    setValidationResult(null);
  };

  const handleValidationContinue = () => {
    setShowValidationModal(false);
    setValidationResult(null);
    // O setIsBasicValidated já foi chamado no onBasicSubmit
  };

  const handleStepperComplete = async (stepperData: StepperFormData) => {
    try {
      setIsCreatingExperiment(true);
      const basicData = getValues();
      
      // Preparar dados para o backend
      const experimentData = {
        nome_experimento: basicData.titulo,
        unidade_gestora: stepperData.unidade_gestora,
        proponente_nome: stepperData.proponente_nome,
        proponente_matricula: stepperData.proponente_matricula,
        proponente_cgc: stepperData.proponente_cgc,
        desafio: stepperData.desafio,
        descricao: basicData.descricao,
        horizonte_inovacao: stepperData.horizonte_inovacao,
        volume_impacto: stepperData.volume_impacto,
        hipoteses: stepperData.hipoteses,
        metricas_kpis: stepperData.metricas_kpis,
        baseline: stepperData.baseline,
        resultados_esperados: stepperData.resultados_esperados,
        data_inicio: stepperData.data_inicio,
        data_fim: stepperData.data_fim,
        termos_recursos_unidade: stepperData.termos_recursos_unidade,
        termos_registro_perdas: stepperData.termos_registro_perdas,
        termos_notificacao_geina: stepperData.termos_notificacao_geina,
        termos_relatorios: stepperData.termos_relatorios,
        aceito_termos: stepperData.aceito_termos,
        local_assinatura: stepperData.local_assinatura,
        data_assinatura: stepperData.data_assinatura,
        gestor_unidade: stepperData.gestor_unidade,
        time_membros: stepperData.time_membros,
        riscos: stepperData.riscos
      };

      showToast('Criando experimento...', 'info', 3000);
      
      const response = await experimentService.createExperiment(experimentData);
      
      if (response.success) {
        showToast('Experimento criado com sucesso!', 'success', 5000);
        navigate('/ranking');
      } else {
        showToast('Erro ao criar experimento. Tente novamente.', 'error', 5000);
      }
    } catch (error) {
      console.error('Erro ao criar experimento:', error);
      showToast('Erro ao criar experimento. Tente novamente.', 'error', 5000);
    } finally {
      setIsCreatingExperiment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caixa-black mb-2">
            Nova Ideia
          </h1>
          <p className="text-caixa-gray">
            Compartilhe sua ideia de inovação com a CAIXA
          </p>
        </div>

        {!isBasicValidated && (
          <Card>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-caixa-black mb-4">
                  Informações Básicas da Ideia
                </h3>
                <p className="text-caixa-gray mb-6">
                  Descreva sua ideia de forma clara e objetiva para que outros possam entender e avaliar.
                </p>
              </div>

              {/* Campo de título com validação de IA */}
              <AIValidatedField
                fieldName="titulo"
                backendFieldName="nome_experimento"
                label="Título da Ideia"
                placeholder="Digite um título claro e conciso para sua ideia..."
                type="input"
                minLength={10}
                maxLength={120}
                error={basicErrors.titulo?.message}
                required
                register={register}
                setValue={setValue}
                watch={watch}
              />

              {/* Campo de descrição com validação de IA */}
              <AIValidatedField
                fieldName="descricao"
                backendFieldName="descricao_experimento"
                label="Descrição Detalhada"
                placeholder="Descreva sua ideia, incluindo o problema que resolve, benefícios esperados e como funcionaria..."
                type="textarea"
                minLength={20}
                maxLength={4000}
                rows={6}
                error={basicErrors.descricao?.message}
                required
                register={register}
                setValue={setValue}
                watch={watch}
              />

              {basicServerError && (
                <p className="text-sm text-caixa-error">{basicServerError}</p>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => navigate('/ranking')}
                  className="px-6 py-3 rounded-caixa-lg font-semibold bg-gray-200 text-caixa-gray hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={() => void handleBasicSubmit(onBasicSubmit)()}
                  disabled={!watchTitulo?.trim() || !watchDescricao?.trim() || isBasicSubmitting || isValidating}
                  className={`px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200 ${
                    watchTitulo?.trim() && watchDescricao?.trim() && !isBasicSubmitting && !isValidating
                      ? 'btn-primary'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isBasicSubmitting || isValidating ? 'Validando...' : 'Validar ideia e continuar'}
                </button>
              </div>
            </div>
          </Card>
        )}

        {isBasicValidated && (
          <div className="mt-8">
            <IdeaStepper
              titulo={watchTitulo || ''}
              descricao={watchDescricao || ''}
              onComplete={handleStepperComplete}
              isCreating={isCreatingExperiment}
            />
          </div>
        )}

        {/* Modal de Validação */}
        <ValidationModal
          isOpen={showValidationModal}
          onClose={handleValidationModalClose}
          validationResult={validationResult}
          onContinue={handleValidationContinue}
        />
      </main>
    </div>
  );
};

export default NovaIdeiaPage;
