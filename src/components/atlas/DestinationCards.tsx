import { Aperture, ArrowUpRight, FileText } from '@phosphor-icons/react';

interface DestinationProps { href: string; label: string; title: string; action: string }

export function CvDossier({ href, label, title, action }: DestinationProps) {
  return <a data-bento-card href={href} target="_blank" rel="noopener noreferrer" className="bento-card cv-dossier group"><div className="dossier-tab">PDF / CV</div><FileText aria-hidden size={24} weight="duotone" /><div><span>{label}</span><strong>{title}</strong></div><small>{action}<ArrowUpRight aria-hidden size={13} weight="bold" /></small></a>;
}

export function BlogSlice({ href, label, title, action }: DestinationProps) {
  return <a data-bento-card href={href} target="_blank" rel="noopener noreferrer" className="bento-card blog-slice group"><span className="slice-number">02</span><div><span>{label}</span><strong>{title}</strong></div><small>{action}<ArrowUpRight aria-hidden size={13} weight="bold" /></small></a>;
}

export function PhotoAperture({ href, label, title, action }: DestinationProps) {
  return <a data-bento-card href={href} target="_blank" rel="noopener noreferrer" className="bento-card photo-aperture group"><div className="aperture-mark"><Aperture aria-hidden size={40} weight="thin" /></div><div><span>{label}</span><strong>{title}</strong></div><small>{action}<ArrowUpRight aria-hidden size={13} weight="bold" /></small></a>;
}
