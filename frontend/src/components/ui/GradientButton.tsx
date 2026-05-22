import { type ReactNode, type ButtonHTMLAttributes } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
}

const GradientButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: GradientButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantClasses = {
    primary:
      'gradient-primary text-white shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]',
    secondary:
      'bg-white text-primary border border-border hover:bg-blue-50 hover:border-primary hover:scale-[1.02] active:scale-[0.98]',
    outline:
      'bg-transparent text-primary border-2 border-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98]',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full font-semibold
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};

export default GradientButton;
