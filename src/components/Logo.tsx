import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'positive' | 'negative' | 'reduced';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'positive',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const variantClasses = {
    positive: 'text-caixa-blue',
    negative: 'text-caixa-white',
    reduced: 'text-caixa-orange'
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {variant === 'reduced' ? (
        // Logo reduzido - apenas o X estilizado
        <div className="relative">
          <div className="w-full h-full bg-caixa-orange rounded-lg flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              className={`w-3/4 h-3/4 ${variantClasses[variant]}`}
              fill="currentColor"
            >
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      ) : (
        // Logo completo - CAIXA com X estilizado
        <div className="flex items-center space-x-2">
          <div className="font-bold text-xl tracking-wider">
            <span className={variantClasses[variant]}>CAIXA</span>
          </div>
          <div className="relative">
            <div className="w-6 h-6 bg-caixa-orange rounded flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-4 h-4 text-caixa-white"
                fill="currentColor"
              >
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
