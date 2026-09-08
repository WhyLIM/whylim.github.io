import { ArrowLeft, ArrowRight, ArrowSquareOut } from '@phosphor-icons/react';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { config } from '../config';
import type { Language } from '../lib/i18n';
import { translations } from '../lib/i18n';
import { Flip, gsap, useGSAP } from '../lib/gsap';
import Chronograph from './atlas/Chronograph';
import CodingFolio from './atlas/CodingFolio';
import { BlogSlice, CvDossier, PhotoAperture } from './atlas/DestinationCards';
import PersonalitySpecimen from './atlas/PersonalitySpecimen';
import TechnologyOrbit from './atlas/TechnologyOrbit';

interface BentoGridProps { theme: 'light' | 'dark'; language: Language }
type Page = 'main' | 'more';
type QuickMover = ReturnType<typeof gsap.quickTo>;

export default function BentoGrid({ theme, language }: BentoGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pendingFlip = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const movers = useRef(new WeakMap<HTMLElement, { x: QuickMover; y: QuickMover }>());
  const [page, setPage] = useState<Page>('main');
  const t = translations[language].bento;

  const { contextSafe } = useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-bento-card]', rootRef.current);
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (pendingFlip.current) {
        Flip.from(pendingFlip.current, { duration: 0.68, ease: 'power3.inOut', simple: true });
        pendingFlip.current = null;
      }
      gsap.fromTo(cards, { autoAlpha: 0, scale: 0.975, y: 18 }, { autoAlpha: 1, duration: 0.52, ease: 'power3.out', scale: 1, stagger: 0.055, y: 0 });
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
  });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-bento-card]');
    if (!card || !rootRef.current?.contains(card)) return;

    let move = movers.current.get(card);
    if (!move) {
      move = { x: gsap.quickTo(card, '--spot-x', { duration: 0.3, ease: 'power2.out' }), y: gsap.quickTo(card, '--spot-y', { duration: 0.3, ease: 'power2.out' }) };
      movers.current.set(card, move);
    }

    const bounds = card.getBoundingClientRect();
    move.x(((event.clientX - bounds.left) / bounds.width) * 100);
    move.y(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  return (
    <div ref={rootRef} onPointerMove={handlePointerMove} className="h-full min-h-0 w-full">
      <div ref={gridRef} data-flip-id="bento-grid" className="atlas-grid">
        {page === 'main' ? (
          <>
            <PersonalitySpecimen language={language} label={t.personality} action={t.learnMore} />
            <ImageCard src={config.bento.hometown.image} alt={config.bento.hometown.name[language]} label={t.hometownDesc} title={config.bento.hometown.name[language]} />
            <ImageCard src={config.bento.school.logo} alt={config.bento.school.name[language]} label={t.schoolDesc} title={config.bento.school.name[language]} href={config.bento.school.link} className="school-card" />
            <TechnologyOrbit theme={theme} label={t.tech} />
            <ImageCard src={config.bento.undergrad.image} alt={config.bento.undergrad.name[language]} label={t.undergradDesc} title={config.bento.undergrad.name[language]} href={config.bento.undergrad.link} />
            <CodingFolio label={t.coding} />
          </>
        ) : (
          <>
            <Chronograph language={language} />
            <CvDossier href={config.bento.cards.cv.link} label={t.cvDesc} title={t.cv} action={t.open} />
            <BlogSlice href={config.bento.cards.blog.link} label={t.blog} title={t.blog} action={t.open} />
            <PhotoAperture href={config.bento.cards.gallery.link} label={t.photoDesc} title={t.photo} action={t.open} />
          </>
        )}

        <div className="atlas-pagination">
          <button type="button" onClick={() => changePage(page === 'main' ? 'more' : 'main')}>
            {page === 'more' && <ArrowLeft aria-hidden size={15} weight="bold" />}
            {page === 'main' ? t.viewMore : t.back}
            {page === 'main' && <ArrowRight aria-hidden size={15} weight="bold" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ src, alt, label, title, href, className = '' }: {
  src: string; alt: string; label: string; title: string; href?: string; className?: string;
}) {
  return (
    <article data-bento-card className={`bento-card image-card group ${className}`}>
      <img src={src} alt={alt} referrerPolicy="no-referrer" />
      <div className="image-card-shade" />
      <div className="image-card-copy"><span>{label}</span><h2>{title}</h2></div>
      {href && <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ${title}`}><ArrowSquareOut aria-hidden size={17} weight="bold" /></a>}
    </article>
  );
}
