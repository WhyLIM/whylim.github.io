import { Code } from '@phosphor-icons/react';
import { useRef, type CSSProperties } from 'react';
import { config } from '../../config';
import { gsap, useGSAP } from '../../lib/gsap';

type OrbitStyle = CSSProperties & { '--orbit-x': string; '--orbit-y': string };

export default function TechnologyOrbit({ theme, label }: { theme: 'light' | 'dark'; label: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rootRef.current || !orbitRef.current || !pathRef.current) return;
    const nodes = gsap.utils.toArray<HTMLElement>('.orbit-node', rootRef.current);
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ delay: 0.12 });
      timeline
        .from('.orbit-core', { autoAlpha: 0, duration: 0.32, ease: 'power2.out', scale: 0.84 })
        .from(pathRef.current, { autoAlpha: 0, duration: 0.58, ease: 'power3.out', rotation: -10, scale: 0.72 }, 0)
        .from(nodes, { autoAlpha: 0, duration: 0.42, ease: 'back.out(1.35)', scale: 0.28, stagger: 0.035 }, 0.12);
    });

    if (!window.matchMedia('(pointer: fine)').matches) return () => media.revert();
    const rotateX = gsap.quickTo(orbitRef.current, 'rotationX', { duration: 0.55, ease: 'power3.out' });
    const rotateY = gsap.quickTo(orbitRef.current, 'rotationY', { duration: 0.55, ease: 'power3.out' });
    const rotatePath = gsap.quickTo(pathRef.current, 'rotation', { duration: 0.7, ease: 'power3.out' });
    const reset = () => { rotateX(0); rotateY(0); rotatePath(0); };
    const move = (event: PointerEvent) => {
      const bounds = rootRef.current!.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      rotateX(((event.clientY - bounds.top) / bounds.height - 0.5) * -5);
      rotateY(horizontal * 7);
      rotatePath(horizontal * 3);
    };
    rootRef.current.addEventListener('pointermove', move);
    rootRef.current.addEventListener('pointerleave', reset);
    return () => {
      rootRef.current?.removeEventListener('pointermove', move);
      rootRef.current?.removeEventListener('pointerleave', reset);
      media.revert();
    };
  }, { scope: rootRef });

  return (
    <article ref={rootRef} data-bento-card className="bento-card technology-orbit">
      <div ref={orbitRef} className="orbit-stage">
        <div ref={pathRef} className="orbit-path" aria-hidden />
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
