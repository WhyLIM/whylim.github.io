import { Code } from '@phosphor-icons/react';
import { useRef, type CSSProperties } from 'react';
import { config } from '../../config';
import { gsap, useGSAP } from '../../lib/gsap';

type OrbitStyle = CSSProperties & { '--orbit-x': string; '--orbit-y': string };

export default function TechnologyOrbit({ theme, label }: { theme: 'light' | 'dark'; label: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rootRef.current || !orbitRef.current || !window.matchMedia('(pointer: fine)').matches) return;
    const rotateX = gsap.quickTo(orbitRef.current, 'rotationX', { duration: 0.55, ease: 'power3.out' });
    const rotateY = gsap.quickTo(orbitRef.current, 'rotationY', { duration: 0.55, ease: 'power3.out' });
    const reset = () => { rotateX(0); rotateY(0); };
    const move = (event: PointerEvent) => {
      const bounds = rootRef.current!.getBoundingClientRect();
      rotateX(((event.clientY - bounds.top) / bounds.height - 0.5) * -5);
      rotateY(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
    };
    rootRef.current.addEventListener('pointermove', move);
    rootRef.current.addEventListener('pointerleave', reset);
    return () => {
      rootRef.current?.removeEventListener('pointermove', move);
      rootRef.current?.removeEventListener('pointerleave', reset);
    };
  }, { scope: rootRef });

  return (
    <article ref={rootRef} data-bento-card className="bento-card technology-orbit">
      <div ref={orbitRef} className="orbit-stage">
        <div className="orbit-core"><Code aria-hidden size={22} weight="duotone" /><span>{label}</span></div>
        {config.bento.techStack.map((tech, index) => {
          const angle = (index / config.bento.techStack.length) * Math.PI * 2 - Math.PI / 2;
          const style: OrbitStyle = { '--orbit-x': `${50 + Math.cos(angle) * 43}%`, '--orbit-y': `${50 + Math.sin(angle) * 37}%` };
          return (
            <div key={tech.name} className="orbit-node" style={style} title={tech.name}>
              <img src={`https://cdn.simpleicons.org/${tech.icon}/${theme === 'dark' ? 'd9d4ca' : '35322d'}`} alt={tech.name} />
            </div>
          );
        })}
      </div>
    </article>
  );
}
