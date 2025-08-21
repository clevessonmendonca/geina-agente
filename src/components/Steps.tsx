import React, { useState } from 'react';

interface Step {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  details?: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

const Steps: React.FC<StepsProps> = ({ 
  steps, 
  currentStep, 
  onStepClick,
  className = '' 
}) => {
  const [tooltipStep, setTooltipStep] = useState<number | null>(null);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!onStepClick}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200 relative flex-shrink-0
                    ${isCompleted 
                      ? 'bg-caixa-blue text-caixa-white' 
                      : isCurrent 
                      ? 'bg-caixa-orange text-caixa-white ring-4 ring-caixa-orange ring-opacity-30' 
                      : 'bg-gray-200 text-caixa-gray'
                    }
                    ${onStepClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{step.icon || step.id}</span>
                  )}
                </button>
                
                <div className="mt-3 text-center w-full px-1 relative">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className={`
                      text-sm font-semibold leading-tight
                      ${isCompleted || isCurrent ? 'text-caixa-black' : 'text-caixa-gray'}
                    `}>
                      {step.title}
                    </h3>
                    {step.details && (
                      <button
                        onMouseEnter={() => setTooltipStep(step.id)}
                        onMouseLeave={() => setTooltipStep(null)}
                        className="text-caixa-blue hover:text-caixa-orange transition-colors duration-200 flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  {tooltipStep === step.id && step.details && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-caixa-black text-caixa-white text-xs rounded-lg shadow-lg z-50 max-w-48">
                      {step.details}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-caixa-black"></div>
                    </div>
                  )}
                  
                  {step.description && (
                    <p className="text-xs text-caixa-gray leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-6">
                  <div className={`
                    h-full transition-colors duration-200
                    ${isCompleted ? 'bg-caixa-blue' : 'bg-gray-200'}
                  `} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Steps;
