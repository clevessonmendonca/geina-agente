import React, { useState } from 'react';

interface LabelWithInfoProps {
  label: string;
  info?: string;
  required?: boolean;
  showValidation?: boolean;
  className?: string;
  children: React.ReactNode;
}

const LabelWithInfo: React.FC<LabelWithInfoProps> = ({ 
  label, 
  info, 
  required = false,
  showValidation = true,
  className = '',
  children
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1">
        <label className="text-sm font-medium text-caixa-black">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {info && showValidation && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-caixa-blue hover:text-caixa-orange transition-colors duration-200 p-1 rounded-full hover:bg-caixa-blue hover:bg-opacity-10"
              type="button"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Tooltip Melhorado */}
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-64 min-w-48">
                {/* Seta do tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-200 -mt-px"></div>
                
                {/* Conteúdo do tooltip */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-caixa-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-caixa-black leading-relaxed">
                      {info}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
};

export default LabelWithInfo;
