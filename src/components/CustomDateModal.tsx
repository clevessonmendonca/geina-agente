import React, { useState } from 'react';

interface CustomDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const CustomDateModal: React.FC<CustomDateModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStartDate = '',
  initialEndDate = ''
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState('');

  const handleApply = () => {
    if (!startDate || !endDate) {
      setError('Por favor, selecione ambas as datas');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('A data de início deve ser anterior à data de fim');
      return;
    }

    setError('');
    onApply(startDate, endDate);
    onClose();
  };

  const handleCancel = () => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-caixa-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-caixa-black">
            Período Personalizado
          </h2>
          <button
            onClick={handleCancel}
            className="text-caixa-gray hover:text-caixa-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-caixa-black mb-2">
              Data de Início *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-caixa text-sm focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
              max={endDate || undefined}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-caixa-black mb-2">
              Data de Fim *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-caixa text-sm focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
              min={startDate || undefined}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-caixa">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-caixa-blue bg-opacity-5 p-4 rounded-caixa">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-caixa-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-caixa-black">
                  <strong>Dica:</strong> Use este filtro para analisar períodos específicos dos seus experimentos de inovação.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-caixa-gray border border-gray-300 rounded-caixa text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-caixa-blue text-white rounded-caixa text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Aplicar Filtro
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDateModal;
