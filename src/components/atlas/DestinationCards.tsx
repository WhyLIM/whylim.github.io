import { Aperture, ArrowUpRight, BookOpenText, FileText } from '@phosphor-icons/react';

interface DestinationProps {
  href: string;
  label: string;
  title: string;
  action: string;
}

export function CvDossier({ href, label, title, action }: DestinationProps) {
  return (
    <a data-bento-card href={href} target="_blank" rel="noopener noreferrer" className="bento-card cv-dossier group">
      <div className="dossier-tab">PDF / CV</div>
      <FileText aria-hidden size={24} weight="duotone" />
      <div><span>{label}</span><strong>{title}</strong></div>
      <small>{action}<ArrowUpRight aria-hidden size={13} weight="bold" /></small>
    </a>
  );
}

export function BlogSlice({ href, label, title, action }: DestinationProps) {
  return (
    <a data-bento-card href={href} target="_blank" rel="noopener noreferrer" className="bento-card blog-slice group">
      <BookOpenText aria-hidden className="slice-icon" size={26} weight="duotone" />
      <div className="slice-rule" aria-hidden />
      <div><span>{label}</span><strong>{title}</strong></div>
      <small>{action}<ArrowUpRight aria-hidden size={13} weight="bold" /></small>
    </a>
  );
}

export function PhotoAperture({ href, label, title, action }: DestinationProps) {
  return (
    <a data-bento-card href={href} target="_blank" rel="noopener noreferrer" className="bento-card photo-aperture group">
      <div className="aperture-mark" aria-hidden><Aperture size={30} weight="thin" /></div>
      <div className="photo-spacer" aria-hidden />
      <div><span>{label}</span><strong>{title}</strong></div>
      <small>{action}<ArrowUpRight aria-hidden size={13} weight="bold" /></small>
    </a>
  );
}
