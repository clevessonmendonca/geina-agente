import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    w-full px-4 py-3 border rounded-caixa font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-caixa-blue focus:border-transparent
    placeholder:text-caixa-gray placeholder:opacity-70 resize-vertical
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
      
      <textarea
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${errorClasses}
          ${className}
        `}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`text-sm mt-1 ${error ? 'text-caixa-error' : 'text-caixa-gray'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
