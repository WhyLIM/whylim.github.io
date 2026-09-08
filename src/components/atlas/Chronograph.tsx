import type { CSSProperties } from 'react';
import type { Language } from '../../lib/i18n';
import { translations } from '../../lib/i18n';

type ArcStyle = CSSProperties & { '--arc': string };

export default function Chronograph({ language }: { language: Language }) {
  const t = translations[language].bento;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  const progress = [
    [t.day, ((now.getTime() - startOfDay.getTime()) / 86_400_000) * 100],
    [t.week, ((now.getTime() - startOfWeek.getTime()) / (7 * 86_400_000)) * 100],
    [t.month, ((now.getTime() - startOfMonth.getTime()) / (nextMonth.getTime() - startOfMonth.getTime())) * 100],
    [t.year, ((now.getTime() - startOfYear.getTime()) / (nextYear.getTime() - startOfYear.getTime())) * 100],
  ] as const;

  return (
    <article data-bento-card className="bento-card chronograph">
      <div className="chrono-date"><span>{now.getFullYear()}</span><strong>{String(now.getDate()).padStart(2, '0')}</strong><p>{now.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { month: 'long', weekday: 'short' })}</p></div>
      <div className="chrono-title">{t.timeTitle}</div>
      <div className="chrono-readings">
        {progress.map(([label, raw]) => {
          const value = Math.max(0, Math.min(100, Math.round(raw)));
          return <div key={label} className="chrono-reading" style={{ '--arc': `${value * 3.6}deg` } as ArcStyle}><span>{label}</span><strong>{value}<small>%</small></strong></div>;
        })}
      </div>
    </article>
  );
}
