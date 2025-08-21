import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';

interface ScoreBreakdownProps {
  criterios: {
    impacto: number;
    viabilidade: number;
    urgencia: number;
    alcance: number;
    inovacao: number;
  };
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ criterios }) => {
  const [showDetails, setShowDetails] = useState(false);

  const criteriosInfo = [
    {
      nome: 'Impacto',
      valor: criterios.impacto,
      descricao: 'Baseado no volume de impacto e resultados esperados',
      cor: criterios.impacto >= 80 ? 'text-green-600' : criterios.impacto >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      nome: 'Viabilidade',
      valor: criterios.viabilidade,
      descricao: 'Baseado no horizonte de inovação e time disponível',
      cor: criterios.viabilidade >= 80 ? 'text-green-600' : criterios.viabilidade >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      nome: 'Urgência',
      valor: criterios.urgencia,
      descricao: 'Baseado no desafio descrito e prazo de início',
      cor: criterios.urgencia >= 80 ? 'text-green-600' : criterios.urgencia >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      nome: 'Alcance',
      valor: criterios.alcance,
      descricao: 'Baseado na unidade gestora e escopo do projeto',
      cor: criterios.alcance >= 80 ? 'text-green-600' : criterios.alcance >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      nome: 'Inovação',
      valor: criterios.inovacao,
      descricao: 'Baseado em tecnologias inovadoras e métricas definidas',
      cor: criterios.inovacao >= 80 ? 'text-green-600' : criterios.inovacao >= 60 ? 'text-yellow-600' : 'text-red-600'
    }
  ];



  return (
    <div className="bg-gray-50 rounded-caixa p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-semibold text-caixa-black">Critérios IA</h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-caixa-blue hover:text-caixa-orange transition-colors"
            title="Ver detalhes do cálculo"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critérios principais */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {criteriosInfo.map((criterio, index) => (
          <div key={index} className="text-center">
            <div className={`text-lg font-semibold ${criterio.cor}`}>
              {criterio.valor}%
            </div>
            <div className="text-xs text-caixa-gray">{criterio.nome}</div>
          </div>
        ))}
      </div>

      {/* Detalhes expandidos */}
      {showDetails && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h5 className="text-sm font-semibold text-caixa-black mb-3">Detalhamento dos Critérios</h5>
          <div className="space-y-3">
            {criteriosInfo.map((criterio, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-caixa">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-caixa-black">{criterio.nome}</span>
                    <span className={`text-sm font-semibold ${criterio.cor}`}>
                      {criterio.valor}%
                    </span>
                  </div>
                  <p className="text-xs text-caixa-gray mt-1">{criterio.descricao}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {criterio.valor >= 80 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : criterio.valor >= 60 ? (
                    <div className="w-4 h-4 text-yellow-600">→</div>
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-caixa-blue bg-opacity-5 rounded-caixa">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-caixa-blue mt-0.5 flex-shrink-0" />
              <div className="text-xs text-caixa-black">
                <strong>Como é calculado:</strong> O score final é a média dos 5 critérios. 
                Cada critério é avaliado com base nos dados reais do formulário de experimento, 
                considerando fatores como tecnologias utilizadas, prazo de implementação, 
                escopo do projeto e recursos disponíveis.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBreakdown;
