import { GlobeHemisphereWest } from '@phosphor-icons/react';
import type { Language } from '../lib/i18n';
import GlassButton from './GlassButton';

interface LanguageToggleProps {
  language: Language;
  toggleLanguage: () => void;
  label: string;
}

export default function LanguageToggle({ language, toggleLanguage, label }: LanguageToggleProps) {
  return (
    <GlassButton onClick={toggleLanguage} aria-label={label} title={label} className="px-3">
      <GlobeHemisphereWest aria-hidden size={19} weight="duotone" />
      <span className="font-mono text-[0.68rem] font-semibold tracking-[0.08em]">{language.toUpperCase()}</span>
    </GlassButton>
  );
}
