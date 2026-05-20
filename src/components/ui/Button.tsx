import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  children: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#265C38] text-white hover:bg-[#1f4f2c] shadow-lg shadow-[#163f24]/20',
  secondary: 'bg-white text-[#265C38] border border-[#c8e0d1] hover:bg-[#f8fdf7]',
  ghost: 'bg-transparent text-white/90 hover:text-white',
};

const sizeStyles = {
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex w-full items-center justify-center rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#97cda6] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
