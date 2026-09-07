/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Train } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import AnimationControl from './components/AnimationControl';
import BentoGrid from './components/BentoGrid';
import Hero from './components/Hero';
import LanguageToggle from './components/LanguageToggle';
import MapBackground from './components/MapBackground';
import ThemeToggle from './components/ThemeToggle';
import { config } from './config';
import { calculateDistance } from './lib/geo';
import type { Language } from './lib/i18n';
import { translations } from './lib/i18n';
import { gsap, useGSAP } from './lib/gsap';

type Stage = 1 | 2 | 3 | 4;

export default function App() {
  const rootRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const [language, setLanguage] = useState<Language>('en');
  const [skipAnimation, setSkipAnimation] = useState(() => localStorage.getItem('skipAnimation') === 'true');
  const initiallySkipped = useRef(skipAnimation);
  const [introRun, setIntroRun] = useState(0);
  const [stage, setStage] = useState<Stage>(() => (skipAnimation ? 3 : 1));
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const ownerLocation = config.ownerLocation;
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('skipAnimation', String(skipAnimation));
  }, [skipAnimation]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

        setUserLocation([latitude, longitude]);
        setDistance(calculateDistance(ownerLocation[0], ownerLocation[1], latitude, longitude));
      },
      () => {
        setUserLocation(null);
        setDistance(null);
      },
      { enableHighAccuracy: false, maximumAge: 600_000, timeout: 8_000 },
    );
  }, [ownerLocation]);

  useGSAP(() => {
    if (introRun === 0 && initiallySkipped.current) {
      setStage(3);
      return;
    }

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: reduce)', () => setStage(3));
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline();
      timeline
        .call(() => setStage(1), [], 0)
        .call(() => setStage(2), [], 1.6)
        .call(() => setStage(3), [], 3.2);
    });

    return () => media.revert();
  }, { scope: rootRef, dependencies: [introRun] });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-control]', {
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.06,
        y: -12,
      });
    });

    return () => media.revert();
  }, { scope: rootRef });

  useGSAP(() => {
    if (stage !== 4 || !bentoRef.current) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        bentoRef.current,
        { autoAlpha: 0, x: 48 },
        { autoAlpha: 1, duration: 0.8, ease: 'power3.out', x: 0 },
      );
    });
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set(bentoRef.current, { autoAlpha: 1 }));

    return () => media.revert();
  }, { scope: rootRef, dependencies: [stage] });

  useGSAP(() => {
    if (stage < 3 || !footerRef.current) return;

    gsap.fromTo(
      footerRef.current,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, duration: 0.5, ease: 'power2.out', y: 0 },
    );
  }, { scope: rootRef, dependencies: [stage] });

  const handleReplay = () => {
    setStage(1);
    setIntroRun((run) => run + 1);
  };

  return (
    <main
      ref={rootRef}
      data-theme={theme}
      className="relative min-h-[100dvh] overflow-x-hidden bg-[var(--canvas)] text-[var(--ink)] transition-colors duration-500"
    >
      <div className="fixed inset-0 z-0">
        <MapBackground
          theme={theme}
          language={language}
          userLocation={userLocation}
          ownerLocation={ownerLocation}
          stage={stage === 4 ? 3 : stage}
          shouldAnimate={!(introRun === 0 && initiallySkipped.current)}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-colors duration-700 ${
            stage === 4
              ? 'bg-[rgb(var(--canvas-rgb)/0.72)]'
              : 'bg-[linear-gradient(to_bottom,rgb(var(--canvas-rgb)/0.48),rgb(var(--canvas-rgb)/0.08)_45%,rgb(var(--canvas-rgb)/0.82))]'
          }`}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 flex justify-end p-3 md:p-5">
        <div className="flex items-center gap-2">
          <div data-control>
            <AnimationControl
              onReplay={handleReplay}
              skipAnimation={skipAnimation}
              toggleSkip={() => setSkipAnimation((value) => !value)}
              labels={t.controls}
            />
          </div>
          <div data-control>
            <LanguageToggle
              language={language}
              toggleLanguage={() => setLanguage((value) => value === 'en' ? 'zh' : 'en')}
              label={t.controls.language}
            />
          </div>
          <div data-control>
            <ThemeToggle
              theme={theme}
              toggleTheme={() => setTheme((value) => value === 'light' ? 'dark' : 'light')}
              label={t.controls.theme}
            />
          </div>
        </div>
      </header>

      <section className={`relative z-20 min-h-[100dvh] pb-20 ${stage === 4 ? 'lg:grid lg:grid-cols-[42%_58%]' : ''}`}>
        <Hero
          stage={stage}
          userLocation={userLocation}
          distance={distance}
          language={language}
          onExplore={() => setStage(4)}
        />

        {stage === 4 && (
          <aside ref={bentoRef} className="flex w-full items-center px-4 pb-12 md:px-8 lg:min-h-[100dvh] lg:px-7 lg:py-20 xl:px-10">
            <BentoGrid theme={theme} language={language} />
          </aside>
        )}
      </section>

      {stage >= 3 && (
        <footer ref={footerRef} className="relative z-30 -mt-16 px-5 pb-5 text-center text-[0.66rem] font-medium leading-relaxed text-[var(--muted)]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Copyright © {config.footer.startYear}-{new Date().getFullYear()} {config.footer.ownerName}</span>
            <span aria-hidden>·</span>
            <span>Made by {config.footer.ownerName}</span>

            {config.footer.upyun.show && (
              <>
                <span aria-hidden>·</span>
                <a href={config.footer.upyun.link} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--accent)]">
                  {config.footer.upyun.text}
                </a>
              </>
            )}

            <span aria-hidden>·</span>
            <a href={config.footer.icp.link} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--accent)]">
              {config.footer.icp.text}
            </a>
            <span aria-hidden>·</span>
            <a href={config.footer.police.link} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--accent)]">
              {config.footer.police.text}
            </a>

            {config.footer.travellings.show && (
              <>
                <span aria-hidden>·</span>
                <a href={config.footer.travellings.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-[var(--accent)]">
                  <Train aria-hidden size={12} weight="duotone" />
                  {config.footer.travellings.text}
                </a>
              </>
            )}
          </div>
        </footer>
      )}
    </main>
  );
}
