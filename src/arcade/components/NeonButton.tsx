import React from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'cyan' | 'magenta' | 'yellow' | 'green';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  size?: 'default' | 'large';
  className?: string;
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, { border: string; text: string; hoverBg: string }> = {
  cyan: { border: 'border-[#66FCF1]', text: 'text-[#66FCF1]', hoverBg: 'hover:bg-[#66FCF1]/15' },
  magenta: { border: 'border-[#FF2E9A]', text: 'text-[#FF2E9A]', hoverBg: 'hover:bg-[#FF2E9A]/15' },
  yellow: { border: 'border-[#FFE66D]', text: 'text-[#FFE66D]', hoverBg: 'hover:bg-[#FFE66D]/15' },
  green: { border: 'border-[#4CAF50]', text: 'text-[#4CAF50]', hoverBg: 'hover:bg-[#4CAF50]/15' },
};

export default function NeonButton({ children, variant = 'cyan', to, onClick, type = 'button', size = 'default', className = '', disabled = false }: NeonButtonProps) {
  const style = variantStyles[variant];
  const sizeClass = size === 'large' ? 'px-8 py-4 text-[1rem]' : 'px-6 py-3 text-[0.75rem]';
  const base = `inline-flex items-center justify-center font-pixel uppercase tracking-[0.06em] border-2 ${style.border} ${style.text} bg-transparent ${style.hoverBg} transition-all duration-150 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${className}`;

  if (to) return <Link to={to} className={base}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={base}>{children}</button>;
}
