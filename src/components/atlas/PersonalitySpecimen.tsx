import { ArrowUpRight } from '@phosphor-icons/react';
import { config } from '../../config';
import type { Language } from '../../lib/i18n';

export default function PersonalitySpecimen({ language, label, action }: {
  language: Language;
  label: string;
  action: string;
}) {
  return (
    <a data-bento-card href={config.bento.mbti.link[language]} target="_blank" rel="noopener noreferrer" className="bento-card personality-specimen group">
      <span aria-hidden className="specimen-code">N·01</span>
      <span aria-hidden className="specimen-word">{config.bento.mbti.type}</span>
      <img src={config.bento.mbti.image} alt="" className="specimen-figure" referrerPolicy="no-referrer" />
      <div className="specimen-copy">
        <span>{label}</span>
        <strong>{config.bento.mbti.desc[language]}</strong>
        <p>{config.bento.mbti.tags[language].map((tag) => <span key={tag} className="specimen-tag">{tag}</span>)}</p>
      </div>
      <span className="specimen-action">{action}<ArrowUpRight aria-hidden size={14} weight="bold" /></span>
    </a>
  );
}
