import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  BookOpenText,
  Camera,
  Code,
  FileText,
} from '@phosphor-icons/react';
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { config } from '../config';
import type { Language } from '../lib/i18n';
import { translations } from '../lib/i18n';
import { Flip, gsap, useGSAP } from '../lib/gsap';

interface BentoGridProps {
  theme: 'light' | 'dark';
  language: Language;
}

type Page = 'main' | 'more';
type QuickMover = ReturnType<typeof gsap.quickTo>;

export default function BentoGrid({ theme, language }: BentoGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pendingFlip = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const movers = useRef(new WeakMap<HTMLElement, { x: QuickMover; y: QuickMover }>());
  const [page, setPage] = useState<Page>('main');
  const t = translations[language].bento;
  const isDark = theme === 'dark';

  const { contextSafe } = useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-bento-card]', rootRef.current);
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (pendingFlip.current) {
        Flip.from(pendingFlip.current, {
          duration: 0.68,
          ease: 'power3.inOut',
          simple: true,
        });
        pendingFlip.current = null;
      }

      gsap.fromTo(
        cards,
        { autoAlpha: 0, scale: 0.975, y: 18 },
        { autoAlpha: 1, duration: 0.52, ease: 'power3.out', scale: 1, stagger: 0.055, y: 0 },
      );
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      pendingFlip.current = null;
      gsap.set(cards, { autoAlpha: 1, clearProps: 'transform' });
    });

    return () => media.revert();
  }, { scope: rootRef, dependencies: [page] });

  const changePage = contextSafe((nextPage: Page) => {
    if (nextPage === page || !gridRef.current) return;

    pendingFlip.current = Flip.getState(gridRef.current);
    setPage(nextPage);

    requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;

    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-bento-card]');
    if (!card || !rootRef.current?.contains(card)) return;

    let move = movers.current.get(card);
    if (!move) {
      move = {
        x: gsap.quickTo(card, '--spot-x', { duration: 0.3, ease: 'power2.out' }),
        y: gsap.quickTo(card, '--spot-y', { duration: 0.3, ease: 'power2.out' }),
      };
      movers.current.set(card, move);
    }

    const bounds = card.getBoundingClientRect();
    move.x(((event.clientX - bounds.left) / bounds.width) * 100);
    move.y(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  return (
    <div ref={rootRef} onPointerMove={handlePointerMove} className="w-full scroll-mt-20">
      <div
        ref={gridRef}
        data-flip-id="bento-grid"
        className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:h-[calc(100dvh-10rem)] lg:min-h-[34rem] lg:max-h-[46rem] lg:grid-cols-3 lg:grid-rows-[repeat(3,minmax(0,1fr))_2.75rem] xl:gap-4"
      >
        {page === 'main' ? (
          <>
            <article data-bento-card className="bento-card group min-h-48 p-5 md:col-span-2 lg:min-h-0">
              <div className="relative z-10 ml-auto flex h-full w-[62%] flex-col items-end justify-center text-right">
                <p className="eyebrow mb-3">{t.personality}</p>
                <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em] text-[var(--accent)]">{config.bento.mbti.type}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{config.bento.mbti.desc[language]}</p>
                <div className="mt-3 flex flex-wrap justify-end gap-x-3 gap-y-1 text-[0.68rem] font-semibold text-[var(--muted)]">
                  {config.bento.mbti.tags[language].map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <img
                src={config.bento.mbti.image}
                alt="INFJ advocate illustration"
                className="absolute -bottom-7 -left-8 h-[125%] w-[48%] rotate-[-7deg] object-contain transition-transform duration-500 group-hover:rotate-0"
                referrerPolicy="no-referrer"
              />
              <CardLink href={config.bento.mbti.link[language]} label={t.learnMore} />
            </article>

            <ImageCard
              src={config.bento.hometown.image}
              alt={config.bento.hometown.name[language]}
              label={t.hometownDesc}
              title={config.bento.hometown.name[language]}
            />

            <ImageCard
              src={config.bento.school.logo}
              alt={config.bento.school.name[language]}
              label={t.schoolDesc}
              title={config.bento.school.name[language]}
              href={config.bento.school.link}
              className="lg:row-span-2"
            />

            <article data-bento-card className="bento-card flex min-h-40 flex-col justify-center p-5 md:col-span-2 lg:min-h-0">
              <div className="mb-5 flex items-center justify-between">
                <p className="eyebrow">{t.tech}</p>
                <Code aria-hidden size={19} weight="duotone" className="text-[var(--accent)]" />
              </div>
              <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="animate-marquee flex w-max gap-7 pr-7">
                  {[...config.bento.techStack, ...config.bento.techStack].map((tech, index) => (
                    <div key={`${tech.name}-${index}`} className="flex min-w-12 flex-col items-center gap-2">
                      <img
                        src={`https://cdn.simpleicons.org/${tech.icon}/${isDark ? 'd9d4ca' : '35322d'}`}
                        alt=""
                        aria-hidden
                        className="h-7 w-7 opacity-80"
                      />
                      <span className="font-mono text-[0.62rem] text-[var(--muted)]">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <ImageCard
              src={config.bento.undergrad.image}
              alt={config.bento.undergrad.name[language]}
              label={t.undergradDesc}
              title={config.bento.undergrad.name[language]}
              href={config.bento.undergrad.link}
            />

            <article data-bento-card className="bento-card min-h-48 p-5 lg:min-h-0">
              <p className="eyebrow relative z-10 max-w-28 leading-[1.35]">{t.coding}</p>
              <div className="absolute left-5 top-12 h-px w-10 bg-[var(--accent)]" />
              <img
                src={config.bento.codingCat.image}
                alt="Coding cat"
                className="motion-image absolute -bottom-3 -right-3 max-h-[88%] max-w-[82%] object-contain"
                referrerPolicy="no-referrer"
              />
            </article>
          </>
        ) : (
          <>
            <TimeCard language={language} />
            <SiteCard
              href={config.bento.cards.cv.link}
              label={t.cvDesc}
              title={t.cv}
              action={t.open}
              icon={<FileText aria-hidden size={42} weight="duotone" />}
            />
            <SiteCard
              href={config.bento.cards.blog.link}
              label={t.blog}
              title={t.blog}
              action={t.open}
              icon={<BookOpenText aria-hidden size={42} weight="duotone" />}
            />
            <SiteCard
              href={config.bento.cards.gallery.link}
              label={t.photoDesc}
              title={t.photo}
              action={t.open}
              icon={<Camera aria-hidden size={42} weight="duotone" />}
              className="md:col-span-2 lg:col-span-1"
            />
          </>
        )}

        <div className="flex min-h-11 items-center justify-end md:col-span-2 lg:col-span-3">
          <button
            type="button"
            onClick={() => changePage(page === 'main' ? 'more' : 'main')}
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            {page === 'more' && <ArrowLeft aria-hidden size={16} weight="bold" className="transition-transform group-hover:-translate-x-0.5" />}
            {page === 'main' ? t.viewMore : t.back}
            {page === 'main' && <ArrowRight aria-hidden size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ src, alt, label, title, href, className = '' }: {
  src: string;
  alt: string;
  label: string;
  title: string;
  href?: string;
  className?: string;
}) {
  return (
    <article data-bento-card className={`bento-card group min-h-48 bg-[#1a1916] ${className} lg:min-h-0`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/12 to-black/15" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
        <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.16em] text-white/70 uppercase">{label}</p>
        <h2 className="whitespace-pre-line font-serif text-2xl font-semibold leading-tight tracking-[-0.025em]">{title}</h2>
      </div>
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ${title}`} className="absolute inset-0 z-20">
          <ArrowSquareOut aria-hidden size={18} weight="bold" className="absolute right-5 top-5 text-white/80" />
        </a>
      )}
    </article>
  );
}

function CardLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
    >
      {label}
      <ArrowSquareOut aria-hidden size={14} weight="bold" />
    </a>
  );
}

function TimeCard({ language }: { language: Language }) {
  const t = translations[language].bento;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  const progress = {
    day: ((now.getTime() - startOfDay.getTime()) / 86_400_000) * 100,
    week: ((now.getTime() - startOfWeek.getTime()) / (7 * 86_400_000)) * 100,
    month: ((now.getTime() - startOfMonth.getTime()) / (new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() - startOfMonth.getTime())) * 100,
    year: ((now.getTime() - startOfYear.getTime()) / (nextYear.getTime() - startOfYear.getTime())) * 100,
  };

  return (
    <article data-bento-card className="bento-card grid min-h-[26rem] md:col-span-2 lg:col-span-3 lg:row-span-2 lg:min-h-0 lg:grid-cols-[0.8fr_2.2fr]">
      <div className="flex flex-col items-center justify-center border-b border-[rgb(var(--line)/0.1)] p-6 lg:border-b-0 lg:border-r">
        <p className="eyebrow">{now.getFullYear()}</p>
        <strong className="my-2 font-serif text-7xl font-medium tracking-[-0.06em] text-[var(--ink)]">{now.getDate()}</strong>
        <p className="text-sm font-semibold text-[var(--muted)]">
          {now.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long' })}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">{t.calendar}</p>
      </div>
      <div className="flex flex-col justify-center p-6 lg:p-8">
        <h2 className="mb-6 font-serif text-2xl font-semibold tracking-[-0.02em]">{t.timeTitle}</h2>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[rgb(var(--line)/0.1)] bg-[rgb(var(--line)/0.1)]">
          <TimeMetric label={t.day} value={progress.day} />
          <TimeMetric label={t.week} value={progress.week} />
          <TimeMetric label={t.month} value={progress.month} />
          <TimeMetric label={t.year} value={progress.year} />
        </div>
      </div>
    </article>
  );
}

function TimeMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[rgb(var(--panel-strong)/0.9)] p-4">
      <p className="text-[0.68rem] font-semibold tracking-[0.1em] text-[var(--muted)] uppercase">{label}</p>
      <p className="mt-1 font-serif text-3xl font-medium tracking-[-0.04em] text-[var(--ink)]">
        {Math.max(0, Math.min(100, Math.round(value)))}<span className="ml-0.5 text-sm text-[var(--muted)]">%</span>
      </p>
    </div>
  );
}

function SiteCard({ href, label, title, action, icon, className = '' }: {
  href: string;
  label: string;
  title: string;
  action: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <a
      data-bento-card
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`bento-card group flex min-h-48 flex-col justify-between p-5 lg:min-h-0 ${className}`}
    >
      <div className="flex items-start justify-between">
        <p className="eyebrow leading-[1.35]">{label}</p>
        <span className="text-[var(--accent)] opacity-80 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">{icon}</span>
      </div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl font-semibold leading-tight tracking-[-0.025em] text-[var(--ink)]">{title}</h2>
        <span className="inline-flex shrink-0 items-center gap-1 text-[0.68rem] font-semibold text-[var(--muted)]">
          {action}
          <ArrowSquareOut aria-hidden size={14} weight="bold" />
        </span>
      </div>
    </a>
  );
}
