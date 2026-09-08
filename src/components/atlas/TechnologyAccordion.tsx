import { Code } from '@phosphor-icons/react';
import { useRef, useState, type CSSProperties } from 'react';
import { config } from '../../config';
import { gsap, useGSAP } from '../../lib/gsap';

type TechStyle = CSSProperties & { '--tech-color': string };

export default function TechnologyAccordion({ label }: { label: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const initializedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useGSAP(() => {
    if (!rootRef.current) return;
    const items = gsap.utils.toArray<HTMLButtonElement>('.tech-accordion-item', rootRef.current);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    items.forEach((item, index) => {
      const active = index === activeIndex;
      const icon = item.querySelector('.tech-accordion-icon');
      const name = item.querySelector('.tech-accordion-name');
      const restingRotation = index % 2 === 0 ? -15 : 15;
      const restingRotationY = index % 2 === 0 ? 24 : -24;

      if (!initializedRef.current) {
        gsap.set(item, { flexGrow: 1 });
        gsap.set(icon, { autoAlpha: 0.68, rotation: restingRotation, rotationY: restingRotationY, scale: 1.06, xPercent: 0, yPercent: -50, z: 0 });
        gsap.set(name, { autoAlpha: 0, x: 12, yPercent: -50 });
        return;
      }

      gsap.to(item, {
        flexGrow: activeIndex === null ? 1 : active ? 4.6 : 0.68,
        duration: reducedMotion ? 0 : 0.68,
        ease: 'power3.out',
        overwrite: true,
      });
      gsap.to(icon, {
        autoAlpha: active ? 1 : 0.68,
        rotation: active ? 0 : restingRotation,
        rotationY: active ? 0 : restingRotationY,
        scale: active ? 1.16 : 1.06,
        xPercent: active ? -160 : 0,
        yPercent: -50,
        z: active ? 30 : 0,
        duration: reducedMotion ? 0 : 0.62,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(name, {
        autoAlpha: active ? 1 : 0,
        x: active ? 0 : 12,
        yPercent: -50,
        duration: reducedMotion ? 0 : 0.4,
        delay: active && !reducedMotion ? 0.18 : 0,
        ease: 'power3.out',
        overwrite: true,
      });
    });
    initializedRef.current = true;
  }, { scope: rootRef, dependencies: [activeIndex] });

  return (
    <article ref={rootRef} data-bento-card className="bento-card technology-accordion" aria-label={label}>
      <div
        className="tech-accordion-track"
        onPointerLeave={() => setActiveIndex(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActiveIndex(null);
        }}
      >
        {config.bento.techStack.map((tech, index) => (
          <button
            key={tech.name}
            type="button"
            className="tech-accordion-item"
            style={{ '--tech-color': tech.color } as TechStyle}
            data-active={index === activeIndex}
            aria-expanded={index === activeIndex}
            aria-label={tech.name}
            title={tech.name}
            onPointerEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
          >
            <span className="tech-accordion-depth" aria-hidden />
            <span className="tech-accordion-icon" aria-hidden>
              <img src={`https://cdn.simpleicons.org/${tech.icon}/${tech.color.slice(1)}`} alt="" />
            </span>
            <span className="tech-accordion-name">{tech.name}</span>
          </button>
        ))}
      </div>
      <div className="tech-accordion-title">
        <Code aria-hidden size={19} weight="duotone" />
        <span>{label}</span>
      </div>
    </article>
  );
}
