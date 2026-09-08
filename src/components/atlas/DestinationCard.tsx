import { Aperture, ArrowUpRight, BookOpenText, Camera, FileText } from '@phosphor-icons/react';

type DestinationVariant = 'cv-dossier' | 'blog-slice' | 'photo-aperture';

interface DestinationCardProps {
  variant: DestinationVariant;
  href: string;
  label: string;
  title: string;
  action: string;
}

export default function DestinationCard({ variant, href, label, title, action }: DestinationCardProps) {
  const decoration = variant === 'cv-dossier'
    ? <div className="dossier-tab">PDF / CV</div>
    : variant === 'blog-slice'
      ? <div className="slice-rule" aria-hidden />
      : <div className="aperture-mark" aria-hidden><Aperture size={30} weight="thin" /></div>;
  const icon = variant === 'cv-dossier'
    ? <FileText aria-hidden size={24} weight="duotone" />
    : variant === 'blog-slice'
      ? <BookOpenText aria-hidden className="slice-icon" size={26} weight="duotone" />
      : <Camera aria-hidden className="photo-icon" size={26} weight="duotone" />;

  return (
    <a data-bento-card href={href} target="_blank" rel="noopener noreferrer" className={`bento-card ${variant} group`}>
      {decoration}
      {icon}
      <div><span>{label}</span><strong>{title}</strong></div>
      <small>{action}<ArrowUpRight aria-hidden size={13} weight="bold" /></small>
    </a>
  );
}
