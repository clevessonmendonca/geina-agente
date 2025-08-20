import React from 'react';

interface Step {
  id: number;
  title: string;
  description?: string;
  icon?: string;
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
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!onStepClick}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200 relative
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
                
                <div className="mt-2 text-center max-w-24">
                  <h3 className={`
                    text-sm font-semibold
                    ${isCompleted || isCurrent ? 'text-caixa-black' : 'text-caixa-gray'}
                  `}>
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-xs text-caixa-gray mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4">
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
