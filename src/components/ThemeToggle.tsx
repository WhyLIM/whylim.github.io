import { Moon, Sun } from '@phosphor-icons/react';
import GlassButton from './GlassButton';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: (origin: { x: number; y: number }) => void;
  label: string;
}

export default function ThemeToggle({ theme, toggleTheme, label }: ThemeToggleProps) {
  return (
    <GlassButton
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
      }}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? <Sun aria-hidden size={19} weight="duotone" /> : <Moon aria-hidden size={19} weight="duotone" />}
    </GlassButton>
  );
}
