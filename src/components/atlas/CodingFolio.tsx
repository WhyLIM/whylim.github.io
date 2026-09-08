import { useRef } from 'react';
import { config } from '../../config';
import { gsap, useGSAP } from '../../lib/gsap';

export default function CodingFolio({ label }: { label: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!rootRef.current || !planeRef.current || !window.matchMedia('(pointer: fine)').matches) return;
    const x = gsap.quickTo(planeRef.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const y = gsap.quickTo(planeRef.current, 'y', { duration: 0.45, ease: 'power3.out' });
    const reset = () => { x(0); y(0); };
    const move = (event: PointerEvent) => {
      const bounds = rootRef.current!.getBoundingClientRect();
      x(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
      y(((event.clientY - bounds.top) / bounds.height - 0.5) * 6);
    };
    rootRef.current.addEventListener('pointermove', move);
    rootRef.current.addEventListener('pointerleave', reset);
    return () => {
      rootRef.current?.removeEventListener('pointermove', move);
      rootRef.current?.removeEventListener('pointerleave', reset);
    };
  }, { scope: rootRef });

  return (
    <article ref={rootRef} data-bento-card className="bento-card coding-folio">
      <span className="folio-index">FIELD NOTE / 07</span>
      <strong>{label}</strong>
      <div ref={planeRef} className="code-plane" aria-hidden><code>observe()</code><code>map()</code><code>make()</code></div>
      <img src={config.bento.codingCat.image} alt="Coding cat" referrerPolicy="no-referrer" />
    </article>
  );
}
