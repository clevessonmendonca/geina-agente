import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Steps from '../components/Steps';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';

interface FormData {
  titulo: string;
  descricao: string;
  categoria: string;
  impacto: string;
  viabilidade: string;
  recursos: string;
  equipe: string;
  prazo: string;
}

const NovaIdeiaPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descricao: '',
    categoria: '',
    impacto: '',
    viabilidade: '',
    recursos: '',
    equipe: '',
    prazo: ''
  });

  const steps = [
    { id: 1, title: 'Informações Básicas', description: 'Título e descrição', icon: '📝' },
    { id: 2, title: 'Categorização', description: 'Categoria e impacto', icon: '🏷️' },
    { id: 3, title: 'Viabilidade', description: 'Recursos e prazo', icon: '📊' },
    { id: 4, title: 'Revisão', description: 'Confirme os dados', icon: '✅' }
  ];

  const categorias = [
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'processos', label: 'Processos' },
    { value: 'atendimento', label: 'Atendimento ao Cliente' },
    { value: 'produtos', label: 'Produtos e Serviços' },
    { value: 'sustentabilidade', label: 'Sustentabilidade' },
    { value: 'outros', label: 'Outros' }
  ];

  const niveisImpacto = [
    { value: 'baixo', label: 'Baixo' },
    { value: 'medio', label: 'Médio' },
    { value: 'alto', label: 'Alto' },
    { value: 'critico', label: 'Crítico' }
  ];

  const niveisViabilidade = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' },
    { value: 'muito-alta', label: 'Muito Alta' }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    // Aqui você enviaria os dados para a API
    console.log('Dados da ideia:', formData);
    alert('Ideia enviada com sucesso!');
    navigate('/projects');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
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
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              required
            />
            
            <Textarea
              label="Descrição Detalhada *"
              placeholder="Descreva sua ideia, incluindo o problema que resolve, benefícios esperados e como funcionaria..."
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={6}
              required
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Categorização e Impacto
              </h3>
              <p className="text-caixa-gray mb-6">
                Classifique sua ideia e avalie o impacto potencial na organização.
              </p>
            </div>
            
            <Select
              label="Categoria *"
              options={categorias}
              placeholder="Selecione uma categoria"
              value={formData.categoria}
              onChange={(value) => handleInputChange('categoria', value)}
              required
            />
            
            <Select
              label="Nível de Impacto *"
              options={niveisImpacto}
              placeholder="Selecione o nível de impacto"
              value={formData.impacto}
              onChange={(value) => handleInputChange('impacto', value)}
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Viabilidade e Recursos
              </h3>
              <p className="text-caixa-gray mb-6">
                Avalie a viabilidade da implementação e os recursos necessários.
              </p>
            </div>
            
            <Select
              label="Nível de Viabilidade *"
              options={niveisViabilidade}
              placeholder="Selecione o nível de viabilidade"
              value={formData.viabilidade}
              onChange={(value) => handleInputChange('viabilidade', value)}
              required
            />
            
            <Textarea
              label="Recursos Necessários"
              placeholder="Descreva os recursos necessários (humanos, tecnológicos, financeiros)..."
              value={formData.recursos}
              onChange={(e) => handleInputChange('recursos', e.target.value)}
              rows={4}
            />
            
            <Input
              label="Equipe Proposta"
              placeholder="Quantas pessoas seriam necessárias?"
              value={formData.equipe}
              onChange={(e) => handleInputChange('equipe', e.target.value)}
            />
            
            <Input
              label="Prazo Estimado"
              placeholder="Ex: 3 meses, 6 meses, 1 ano..."
              value={formData.prazo}
              onChange={(e) => handleInputChange('prazo', e.target.value)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-caixa-black mb-4">
                Revisão Final
              </h3>
              <p className="text-caixa-gray mb-6">
                Revise todas as informações antes de enviar sua ideia.
              </p>
            </div>
            
            <Card variant="outlined" className="space-y-4">
              <div>
                <h4 className="font-semibold text-caixa-black">Título</h4>
                <p className="text-caixa-gray">{formData.titulo || 'Não informado'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-caixa-black">Descrição</h4>
                <p className="text-caixa-gray">{formData.descricao || 'Não informado'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-caixa-black">Categoria</h4>
                  <p className="text-caixa-gray">
                    {categorias.find(c => c.value === formData.categoria)?.label || 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-caixa-black">Impacto</h4>
                  <p className="text-caixa-gray">
                    {niveisImpacto.find(n => n.value === formData.impacto)?.label || 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-caixa-black">Viabilidade</h4>
                  <p className="text-caixa-gray">
                    {niveisViabilidade.find(v => v.value === formData.viabilidade)?.label || 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-caixa-black">Prazo</h4>
                  <p className="text-caixa-gray">{formData.prazo || 'Não informado'}</p>
                </div>
              </div>
            </Card>
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
        return formData.titulo.trim() && formData.descricao.trim();
      case 1:
        return formData.categoria && formData.impacto;
      case 2:
        return formData.viabilidade;
      default:
        return true;
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
              disabled={currentStep === 0}
              className={`
                px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200
                ${currentStep === 0 
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
                className="px-6 py-3 rounded-caixa-lg font-semibold bg-gray-200 text-caixa-gray hover:bg-gray-300 transition-colors duration-200"
              >
                Cancelar
              </button>
              
              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                >
                  Enviar Ideia
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`
                    px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200
                    ${canProceed() 
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
      </main>
    </div>
  );
};

export default NovaIdeiaPage;
