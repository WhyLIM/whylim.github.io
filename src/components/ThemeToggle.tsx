import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      onClick={toggleTheme}
      className={`p-3 rounded-full transition-all duration-300 backdrop-blur-md border hover:bg-gold-400/10 hover:text-gold-400 ${
        theme === 'dark'
          ? 'bg-black/30 border-white/10 text-gray-400'
          : 'bg-white/30 border-black/5 text-gray-500'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
}
