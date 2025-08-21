import React from 'react';
import Card from './Card';

interface FormReviewProps {
  formData: any;
  onEdit: (step: number) => void;
  onGeneratePDF: () => void;
  isGeneratingPDF: boolean;
}

const FormReview: React.FC<FormReviewProps> = ({
  formData,
  onEdit,
  onGeneratePDF,
  isGeneratingPDF
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (value: boolean) => {
    return value ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aceito</span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Não aceito</span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-caixa-black mb-2">
          Revisão Final do Experimento
        </h2>
        <p className="text-caixa-gray">
          Revise todas as informações antes de enviar sua proposta
        </p>
      </div>

      {/* Proponente */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-caixa-black">1. Informações do Proponente</h3>
          <button
            onClick={() => onEdit(0)}
            className="text-caixa-blue hover:text-caixa-orange text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-caixa-gray">Nome:</span>
            <p className="font-medium">{formData.proponente_nome || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Matrícula:</span>
            <p className="font-medium">{formData.proponente_matricula || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">CGC:</span>
            <p className="font-medium">{formData.proponente_cgc || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Unidade Gestora:</span>
            <p className="font-medium">{formData.unidade_gestora || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Experimento */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-caixa-black">2. Detalhes do Experimento</h3>
          <button
            onClick={() => onEdit(1)}
            className="text-caixa-blue hover:text-caixa-orange text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-caixa-gray">Desafio:</span>
            <p className="font-medium">{formData.desafio || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Hipóteses:</span>
            <p className="font-medium">{formData.hipoteses || '-'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-caixa-gray">Horizonte de Inovação:</span>
              <p className="font-medium">{formData.horizonte_inovacao || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-caixa-gray">Volume de Impacto:</span>
              <p className="font-medium">{formData.volume_impacto || '-'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-caixa-black">3. Métricas e Resultados</h3>
          <button
            onClick={() => onEdit(2)}
            className="text-caixa-blue hover:text-caixa-orange text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-caixa-gray">Baseline:</span>
            <p className="font-medium">{formData.baseline || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Resultados Esperados:</span>
            <p className="font-medium">{formData.resultados_esperados || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Métricas/KPIs:</span>
            <p className="font-medium">{formData.metricas_kpis || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Cronograma */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-caixa-black">4. Cronograma</h3>
          <button
            onClick={() => onEdit(3)}
            className="text-caixa-blue hover:text-caixa-orange text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-caixa-gray">Data de Início:</span>
            <p className="font-medium">{formatDate(formData.data_inicio)}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Data de Fim:</span>
            <p className="font-medium">{formatDate(formData.data_fim)}</p>
          </div>
        </div>
      </Card>

      {/* Termos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-caixa-black">5. Termos e Condições</h3>
          <button
            onClick={() => onEdit(4)}
            className="text-caixa-blue hover:text-caixa-orange text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-caixa-gray">Uso de recursos da unidade gestora:</span>
            {getStatusBadge(formData.termos_recursos_unidade)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-caixa-gray">Registro de perdas:</span>
            {getStatusBadge(formData.termos_registro_perdas)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-caixa-gray">Notificação à GEINA:</span>
            {getStatusBadge(formData.termos_notificacao_geina)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-caixa-gray">Elaboração de relatórios:</span>
            {getStatusBadge(formData.termos_relatorios)}
          </div>
          <div className="flex items-center justify-between md:col-span-2">
            <span className="text-sm text-caixa-gray">Aceito todos os termos:</span>
            {getStatusBadge(formData.aceito_termos)}
          </div>
        </div>
      </Card>

      {/* Assinatura */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-caixa-black">6. Assinatura</h3>
          <button
            onClick={() => onEdit(5)}
            className="text-caixa-blue hover:text-caixa-orange text-sm font-medium"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-caixa-gray">Local de Assinatura:</span>
            <p className="font-medium">{formData.local_assinatura || '-'}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Data de Assinatura:</span>
            <p className="font-medium">{formatDate(formData.data_assinatura)}</p>
          </div>
          <div>
            <span className="text-sm text-caixa-gray">Gestor da Unidade:</span>
            <p className="font-medium">{formData.gestor_unidade || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Time e Riscos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-caixa-black">7. Time e Riscos</h3>
          <button
            onClick={() => onEdit(5)}
            className="text-caixa-blue hover:text-caixa-orange text-sm font-medium"
          >
            Editar
          </button>
        </div>
        
        {/* Membros do Time */}
        <div className="mb-6">
          <h4 className="font-medium text-caixa-black mb-3">Membros do Time:</h4>
          {formData.time_membros && formData.time_membros.length > 0 ? (
            <div className="space-y-2">
              {formData.time_membros.map((member: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{member.nome}</span>
                  <span className="text-caixa-gray">({member.matricula})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caixa-gray">Nenhum membro adicionado</p>
          )}
        </div>

        {/* Riscos */}
        <div>
          <h4 className="font-medium text-caixa-black mb-3">Riscos Identificados:</h4>
          {formData.riscos && formData.riscos.length > 0 ? (
            <div className="space-y-3">
              {formData.riscos.map((risk: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-caixa-orange">
                  <p className="font-medium text-caixa-black mb-1">
                    Risco: {risk.descricao_risco}
                  </p>
                  <p className="text-sm text-caixa-gray">
                    Estratégia de Mitigação: {risk.estrategia_mitigacao}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caixa-gray">Nenhum risco identificado</p>
          )}
        </div>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-center space-x-4 pt-6">
        <button
          onClick={() => onEdit(5)}
          className="px-6 py-3 bg-gray-200 text-caixa-gray rounded-caixa-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          Editar Formulário
        </button>
        <button
          onClick={onGeneratePDF}
          disabled={isGeneratingPDF}
          className={`px-6 py-3 rounded-caixa-lg font-semibold transition-colors duration-200 ${
            isGeneratingPDF
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {isGeneratingPDF ? 'Gerando PDF...' : 'Gerar e Enviar PDF'}
        </button>
      </div>
    </div>
  );
};

export default FormReview;
