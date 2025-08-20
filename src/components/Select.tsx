import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'filled';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  onChange,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    w-full px-4 py-3 border rounded-caixa font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-caixa-blue focus:border-transparent
    appearance-none bg-no-repeat bg-right pr-10
  `;

  const variantClasses = {
    default: 'border-gray-300 bg-caixa-white',
    filled: 'border-transparent bg-gray-50 focus:bg-caixa-white'
  };

  const errorClasses = error ? 'border-caixa-error focus:ring-caixa-error' : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-caixa-black mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          onChange={handleChange}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${errorClasses}
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em'
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {(error || helperText) && (
        <p className={`text-sm mt-1 ${error ? 'text-caixa-error' : 'text-caixa-gray'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
