import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import IdeaStepper from '../components/IdeaStepper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface StepperFormData {
  categoria: string;
  impacto: string;
  viabilidade: string;
  recursos: string;
  equipe: string;
  prazo: string;
}

const NovaIdeiaPage: React.FC = () => {
  const navigate = useNavigate();
  const [isBasicValidated, setIsBasicValidated] = useState(false);
  const [basicServerError, setBasicServerError] = useState<string | null>(null);

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
    getValues
  } = useForm<BasicIdeaForm>({
    resolver: zodResolver(basicIdeaSchema)
  });

  const watchTitulo = watch('titulo');
  const watchDescricao = watch('descricao');

  const validateIdeaWithApi = async (payload: BasicIdeaForm): Promise<boolean> => {
    try {
      // Substitua a URL abaixo pela URL real da sua API de validação
      const response = await fetch('/api/ideas/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      // Espera-se que o backend retorne { valid: boolean }
      return Boolean(data?.valid);
    } catch (error) {
      return false;
    }
  };

  const onBasicSubmit = async (values: BasicIdeaForm) => {
    setBasicServerError(null);
    const valid = await validateIdeaWithApi(values);
    if (!valid) {
      setBasicServerError('Sua ideia não foi aprovada pela validação automática. Revise o título e a descrição.');
      return;
    }
    setIsBasicValidated(true);
  };

  const handleStepperComplete = (stepperData: StepperFormData) => {
    const basicData = getValues();
    const completeIdea = {
      ...basicData,
      ...stepperData
    };
    
    // Aqui você enviaria os dados completos para a API
    console.log('Ideia completa:', completeIdea);
    alert('Ideia enviada com sucesso!');
    navigate('/projects');
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
            
            <Input
              label="Título da Ideia *"
              placeholder="Digite um título claro e conciso"
              error={basicErrors.titulo?.message}
              {...register('titulo')}
              required
            />
            
            <Textarea
              label="Descrição Detalhada *"
              placeholder="Descreva sua ideia, incluindo o problema que resolve, benefícios esperados e como funcionaria..."
              error={basicErrors.descricao?.message}
              rows={6}
              {...register('descricao')}
              required
            />

            {basicServerError && (
              <p className="text-sm text-caixa-error">{basicServerError}</p>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => navigate('/projects')}
                className="px-6 py-3 rounded-caixa-lg font-semibold bg-gray-200 text-caixa-gray hover:bg-gray-300 transition-colors duration-200"
              >
                Cancelar
              </button>
              
              <button
                onClick={() => void handleBasicSubmit(onBasicSubmit)()}
                disabled={!watchTitulo?.trim() || !watchDescricao?.trim() || isBasicSubmitting}
                className={`px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200 ${
                  watchTitulo?.trim() && watchDescricao?.trim() && !isBasicSubmitting
                    ? 'btn-primary'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isBasicSubmitting ? 'Validando...' : 'Validar ideia e continuar'}
              </button>
            </div>
          </div>
        </Card>

        {isBasicValidated && (
          <IdeaStepper
            titulo={watchTitulo || ''}
            descricao={watchDescricao || ''}
            onComplete={handleStepperComplete}
          />
        )}
      </main>
    </div>
  );
};

export default NovaIdeiaPage;
