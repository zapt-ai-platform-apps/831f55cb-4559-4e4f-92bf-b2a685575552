import React from 'react';

/**
 * Button component with multiple variants and sizes
 */
const Button = ({ 
  children,
  variant = 'default',
  size = 'default',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  // Base classes
  const baseClasses = 'btn cursor-pointer';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    default: 'px-4 py-2',
    lg: 'text-lg px-6 py-3',
    icon: 'p-2 text-base',
  };
  
  // Disabled state
  const disabledClasses = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';
  
  // Final classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.default}
    ${sizeClasses[size] || sizeClasses.default}
    ${disabledClasses}
    ${className}
  `;
  
  // Handle click
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    onClick?.(e);
  };
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;