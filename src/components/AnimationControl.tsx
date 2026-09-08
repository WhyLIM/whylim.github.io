import { ArrowCounterClockwise, FastForward } from '@phosphor-icons/react';
import GlassButton from './GlassButton';

interface AnimationControlProps {
  duringIntro: boolean;
  skipAnimation: boolean;
  toggleSkip: () => void;
  onReplay: () => void;
  labels: {
    animationOn: string;
    animationOff: string;
    skipNow: string;
    replay: string;
  };
}

export default function AnimationControl({ duringIntro, skipAnimation, toggleSkip, onReplay, labels }: AnimationControlProps) {
  const skipLabel = duringIntro
    ? labels.skipNow
    : skipAnimation
      ? labels.animationOff
      : labels.animationOn;

  return (
    <div className="flex gap-2">
      <GlassButton active={skipAnimation} onClick={toggleSkip} aria-label={skipLabel} title={skipLabel}>
        <FastForward aria-hidden size={19} weight={skipAnimation ? 'fill' : 'duotone'} />
      </GlassButton>
      <GlassButton onClick={onReplay} aria-label={labels.replay} title={labels.replay}>
        <ArrowCounterClockwise aria-hidden size={19} weight="duotone" />
      </GlassButton>
    </div>
  );
}
