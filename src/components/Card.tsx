import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  variant = 'default',
  padding = 'md'
}) => {
  const variantClasses = {
    default: 'bg-caixa-white shadow-md',
    elevated: 'bg-caixa-white shadow-lg hover:shadow-xl transition-shadow duration-200',
    outlined: 'bg-caixa-white border border-gray-200'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`
      rounded-caixa-lg ${variantClasses[variant]} ${paddingClasses[padding]} ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
