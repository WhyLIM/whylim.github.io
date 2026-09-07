import { Moon, Sun } from '@phosphor-icons/react';
import GlassButton from './GlassButton';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  label: string;
}

export default function ThemeToggle({ theme, toggleTheme, label }: ThemeToggleProps) {
  return (
    <GlassButton onClick={toggleTheme} aria-label={label} title={label}>
      {theme === 'dark' ? <Sun aria-hidden size={19} weight="duotone" /> : <Moon aria-hidden size={19} weight="duotone" />}
    </GlassButton>
  );
}
