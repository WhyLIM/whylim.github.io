import { FastForward, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimationControlProps {
  skipAnimation: boolean;
  toggleSkip: () => void;
  onReplay: () => void;
  theme: 'light' | 'dark';
}

export default function AnimationControl({ skipAnimation, toggleSkip, onReplay, theme }: AnimationControlProps) {
  const buttonClass = `p-3 rounded-full transition-all duration-300 backdrop-blur-md border flex items-center justify-center hover:bg-gold-400/10 hover:text-gold-400 ${
    theme === 'dark'
      ? 'bg-black/30 border-white/10 text-gray-400'
      : 'bg-white/30 border-black/5 text-gray-500'
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.8 }}
      className="flex gap-3"
    >
      <button
        onClick={toggleSkip}
        className={`${buttonClass} ${skipAnimation ? 'text-gold-400 border-gold-400/50' : ''}`}
        title={skipAnimation ? "Enable intro animation" : "Skip intro animation"}
        aria-label="Toggle animation skip"
      >
        <FastForward size={20} className={skipAnimation ? "fill-current" : ""} />
      </button>
      
      <button
        onClick={onReplay}
        className={buttonClass}
        title="Replay intro"
        aria-label="Replay animation"
      >
        <RotateCcw size={20} />
      </button>
    </motion.div>
  );
}
