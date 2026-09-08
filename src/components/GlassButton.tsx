import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export default function GlassButton({ active = false, children, className = '', ...props }: GlassButtonProps) {
  return (
    <button
      className={`glass-button ${className}`}
      data-active={active}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
