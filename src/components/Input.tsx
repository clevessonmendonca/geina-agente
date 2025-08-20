import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    w-full px-4 py-3 border rounded-caixa font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-caixa-blue focus:border-transparent
    placeholder:text-caixa-gray placeholder:opacity-70
  `;

  const variantClasses = {
    default: 'border-gray-300 bg-caixa-white',
    filled: 'border-transparent bg-gray-50 focus:bg-caixa-white'
  };

  const errorClasses = error ? 'border-caixa-error focus:ring-caixa-error' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-caixa-black mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-caixa-gray">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${errorClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-caixa-gray">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`text-sm mt-1 ${error ? 'text-caixa-error' : 'text-caixa-gray'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
