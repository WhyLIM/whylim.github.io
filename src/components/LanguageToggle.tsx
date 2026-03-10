import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../lib/i18n';

interface LanguageToggleProps {
  language: Language;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
}

export default function LanguageToggle({ language, toggleLanguage, theme }: LanguageToggleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.1, duration: 0.8 }}
      onClick={toggleLanguage}
      className={`p-3 rounded-full transition-all duration-300 backdrop-blur-md border flex items-center gap-2 hover:bg-gold-400/10 hover:text-gold-400 ${
        theme === 'dark'
          ? 'bg-black/30 border-white/10 text-gray-400'
          : 'bg-white/30 border-black/5 text-gray-500'
      }`}
      aria-label="Toggle language"
    >
      <Globe size={20} />
      <span className="text-xs font-mono font-bold">{language.toUpperCase()}</span>
    </motion.button>
  );
}
