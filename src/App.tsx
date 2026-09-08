/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Train } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
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
import { revealTheme } from './lib/themeTransition';

type Stage = 1 | 2 | 3 | 4;

export default function App() {
  const rootRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage(3);
      return;
    }

    const beat = { progress: 0 };
    const timeline = gsap.timeline({ paused: true })
      .to(beat, { duration: 2.8, ease: 'none', progress: 1, onComplete: () => setStage(2) })
      .to(beat, { duration: 2.8, ease: 'none', progress: 2, onComplete: () => setStage(3) });

    introTimelineRef.current = timeline;
    setStage(1);
    const frame = window.requestAnimationFrame(() => timeline.play(0));

    return () => {
      window.cancelAnimationFrame(frame);
      timeline.kill();
      if (introTimelineRef.current === timeline) {
        introTimelineRef.current = null;
      }
    };
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

  const handleSkip = () => {
    if (stage < 3) {
      introTimelineRef.current?.kill();
      introTimelineRef.current = null;
      setStage(3);
      setSkipAnimation(true);
      return;
    }

    setSkipAnimation((value) => !value);
  };

  const handleThemeToggle = (origin: { x: number; y: number }) => {
    revealTheme(origin, () => {
      flushSync(() => setTheme((value) => value === 'light' ? 'dark' : 'light'));
    });
  };

  return (
    <main
      ref={rootRef}
      data-theme={theme}
      className="relative h-[100dvh] overflow-hidden bg-[var(--canvas)] text-[var(--ink)] transition-colors duration-500"
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
              ? 'bg-[rgb(var(--canvas-rgb)/0.82)] backdrop-blur-[5px]'
              : 'bg-[linear-gradient(to_bottom,rgb(var(--canvas-rgb)/0.48),rgb(var(--canvas-rgb)/0.08)_45%,rgb(var(--canvas-rgb)/0.82))]'
          }`}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 flex justify-end p-3 md:p-5">
        <div className="flex items-center gap-2">
          <div data-control>
            <AnimationControl
              duringIntro={stage < 3}
              onReplay={handleReplay}
              skipAnimation={skipAnimation}
              toggleSkip={handleSkip}
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
              toggleTheme={handleThemeToggle}
              label={t.controls.theme}
            />
          </div>
        </div>
      </header>

      <section className={`relative z-20 h-full overflow-hidden ${stage === 4 ? 'atlas-shell' : ''}`}>
        <Hero
          stage={stage}
          userLocation={userLocation}
          distance={distance}
          language={language}
          onExplore={() => setStage(4)}
        />

        {stage === 4 && (
          <aside ref={bentoRef} className="atlas-panel">
            <BentoGrid theme={theme} language={language} />
          </aside>
        )}
      </section>

      {stage >= 3 && (
        <footer ref={footerRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-4 pb-2 text-center text-[0.58rem] font-medium leading-relaxed text-[var(--muted)] md:pb-3 md:text-[0.64rem]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Copyright © {config.footer.startYear}-{new Date().getFullYear()} {config.footer.ownerName}</span>
            <span aria-hidden>·</span>
            <span>Made by {config.footer.ownerName}</span>

            {config.footer.upyun.show && (
              <>
                <span aria-hidden>·</span>
                <a href={config.footer.upyun.link} target="_blank" rel="noopener noreferrer" className="pointer-events-auto transition-colors hover:text-[var(--accent)]">
                  {config.footer.upyun.text}
                </a>
              </>
            )}

            <span aria-hidden>·</span>
            <a href={config.footer.icp.link} target="_blank" rel="noopener noreferrer" className="pointer-events-auto transition-colors hover:text-[var(--accent)]">
              {config.footer.icp.text}
            </a>
            <span aria-hidden>·</span>
            <a href={config.footer.police.link} target="_blank" rel="noopener noreferrer" className="pointer-events-auto transition-colors hover:text-[var(--accent)]">
              {config.footer.police.text}
            </a>

            {config.footer.travellings.show && (
              <>
                <span aria-hidden>·</span>
                <a href={config.footer.travellings.link} target="_blank" rel="noopener noreferrer" className="pointer-events-auto inline-flex items-center gap-1 transition-colors hover:text-[var(--accent)]">
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
