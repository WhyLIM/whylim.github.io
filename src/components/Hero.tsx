import { ArrowRight, EnvelopeSimple, GithubLogo, TelevisionSimple } from '@phosphor-icons/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { config } from '../config';
import type { Language } from '../lib/i18n';
import { translations } from '../lib/i18n';
import { gsap, SplitText, useGSAP } from '../lib/gsap';

interface HeroProps {
  stage: 1 | 2 | 3 | 4;
  userLocation: [number, number] | null;
  distance: number | null;
  language: Language;
  onExplore: () => void;
}

export default function Hero({ stage, userLocation, distance, language, onExplore }: HeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const t = translations[language];
  const isSplit = stage === 4;
  const [hitokoto, setHitokoto] = useState<{ text: string; from: string } | null>(null);

  const mainTitle = stage === 1
    ? t.greeting
    : stage === 2
      ? (userLocation ? t.foundUser : t.void)
      : config.name;
  const titleKey = `${stage}-${language}-${Boolean(userLocation)}`;

  useEffect(() => {
    const controller = new AbortController();

    fetch('https://v1.hitokoto.cn', { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setHitokoto({ text: data.hitokoto, from: data.from_who || data.from }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setHitokoto({ text: 'The details are not the details. They make the design.', from: 'Charles Eames' });
        }
      });

    return () => controller.abort();
  }, []);

  useGSAP(() => {
    if (!titleRef.current) return;

    const media = gsap.matchMedia();
    const split = SplitText.create(
      titleRef.current,
      language === 'zh' ? { type: 'chars,words' } : { type: 'chars,words', mask: 'chars' },
    );
    const details = gsap.utils.toArray<HTMLElement>('[data-hero-detail]', rootRef.current);

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline();
      timeline.from(split.chars, {
          autoAlpha: 0,
          duration: 0.78,
          ease: 'power4.out',
          stagger: 0.022,
          yPercent: 112,
        });

      if (details.length) {
        timeline.from(details, {
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.out',
          y: 12,
        }, '-=0.32');
      }
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(split.chars, { autoAlpha: 1, clearProps: 'transform' });
      if (details.length) gsap.set(details, { autoAlpha: 1, clearProps: 'transform' });
    });

    return () => {
      media.revert();
      split.revert();
    };
  }, { scope: rootRef, dependencies: [titleKey] });

  useGSAP(() => {
    if (stage < 3) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-hero-reveal]', {
        autoAlpha: 0,
        duration: 0.62,
        ease: 'power3.out',
        stagger: 0.08,
        y: 18,
      });
    });

    return () => media.revert();
  }, { scope: rootRef, dependencies: [stage, hitokoto] });

  return (
    <div
      ref={rootRef}
      className={`hero-shell relative z-10 flex w-full flex-col justify-center px-6 py-24 text-[var(--ink)] md:px-12 ${
        isSplit
          ? 'items-center text-center lg:items-start lg:pl-[clamp(3rem,7vw,7rem)] lg:pr-8 lg:text-left'
          : 'h-full items-center text-center'
      }`}
    >
      <div className={`flex w-full flex-col ${isSplit ? 'max-w-[34rem] items-center lg:items-start' : 'max-w-[68rem] items-center'}`}>
        <h1
          ref={titleRef}
          key={titleKey}
          className={`text-balance font-serif font-medium tracking-[-0.045em] ${language === 'zh' ? 'pb-1 leading-[1.08]' : 'leading-[0.96]'} ${
            isSplit
              ? 'text-[clamp(4rem,8vw,7.5rem)]'
              : 'text-[clamp(3.6rem,10vw,9.5rem)]'
          }`}
        >
          {mainTitle}
        </h1>

        {stage === 1 && (
          <p data-hero-detail className="mt-5 max-w-lg text-sm font-medium tracking-[0.08em] text-[var(--muted)] md:text-base">
            {t.greetingDetail}
          </p>
        )}

        {stage >= 3 && hitokoto && (
          <figure data-hero-reveal className="hero-quote glass-panel mt-7 w-full max-w-[35rem] rounded-[1.35rem] px-6 py-5">
            <blockquote className={`font-serif text-lg italic leading-relaxed text-[var(--ink)] md:text-xl ${isSplit ? 'text-center lg:text-left' : 'text-center'}`}>
              “{hitokoto.text}”
            </blockquote>
            <figcaption className={`mt-3 flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--muted)] uppercase ${isSplit ? 'justify-center lg:justify-start' : 'justify-center'}`}>
              <span className="h-px w-5 bg-current opacity-40" />
              {hitokoto.from}
            </figcaption>
          </figure>
        )}

        {stage >= 3 && (
          <div data-hero-reveal className={`hero-meta mt-5 flex w-full flex-wrap items-center gap-3 ${isSplit ? 'justify-center lg:justify-start' : 'justify-center'}`}>
            <div className="distance-chip glass-panel inline-flex h-12 items-center gap-3 rounded-xl px-4 text-[var(--muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_18%,transparent)]" />
              <span className="font-mono text-xs font-medium tracking-[0.02em]">
                {distance !== null
                  ? `${t.distance} ${distance.toLocaleString()} ${t.km}`
                  : t.unknownLocation}
              </span>
            </div>

            {stage === 3 && (
              <button
                type="button"
                onClick={onExplore}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[var(--ink)] px-6 text-sm font-semibold text-[var(--canvas)] shadow-[0_16px_40px_rgb(var(--shadow)/0.16)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent)] active:translate-y-0"
              >
                {t.explore}
                <ArrowRight aria-hidden size={17} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        )}

        {stage === 4 && (
          <nav data-hero-reveal aria-label={t.social.label} className="hero-social mt-5 flex items-center gap-2">
            <SocialLink href={config.social.github} label={t.social.github} icon={<GithubLogo aria-hidden size={19} weight="duotone" />} />
            <SocialLink href={config.social.email} label={t.social.email} icon={<EnvelopeSimple aria-hidden size={19} weight="duotone" />} />
            <SocialLink href={config.social.bilibili} label={t.social.bilibili} icon={<TelevisionSimple aria-hidden size={19} weight="duotone" />} />
          </nav>
        )}
      </div>
    </div>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="glass-button"
    >
      {icon}
    </a>
  );
}
