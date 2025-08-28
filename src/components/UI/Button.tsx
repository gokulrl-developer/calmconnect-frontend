import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white focus:ring-gray-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-400 hover:bg-gray-500 active:bg-gray-600 text-white focus:ring-gray-400 shadow-lg hover:shadow-xl',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 shadow-lg hover:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;