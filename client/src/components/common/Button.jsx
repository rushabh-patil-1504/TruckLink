import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand hover:shadow-lg focus:ring-brand-500 transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-navy-900 hover:bg-navy-800 text-white shadow-md focus:ring-navy-900 transform hover:-translate-y-0.5 active:translate-y-0',
    outline: 'bg-white hover:bg-slate-50 text-navy-900 border border-slate-300 hover:border-slate-400 focus:ring-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-navy-900 focus:ring-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-60 cursor-not-allowed transform-none shadow-none' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
