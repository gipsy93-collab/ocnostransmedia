import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface QuizTimerProps { duration: number; timeRemaining: number; onTimeUp: () => void; }

export default function QuizTimer({ duration, timeRemaining, onTimeUp }: QuizTimerProps) {
  const hasTriggered = useRef(false);
  const pct = Math.max(0, Math.min(100, (timeRemaining / duration) * 100));
  useEffect(() => { if (timeRemaining <= 0 && !hasTriggered.current) { hasTriggered.current = true; onTimeUp(); } if (timeRemaining > 0) hasTriggered.current = false; }, [timeRemaining, onTimeUp]);
  const urgent = pct <= 20 && timeRemaining > 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-pixel text-[0.6rem] text-[#8A95A5] uppercase">Tiempo</span>
        <motion.span className={`font-pixel text-[0.7rem] tabular-nums ${urgent ? 'text-[#FF2E9A]' : 'text-[#FFE66D]'}`} animate={urgent ? { opacity: [1, 0.4, 1] } : {}} transition={urgent ? { duration: 0.5, repeat: Infinity } : {}}>{Math.ceil(timeRemaining)}s</motion.span>
      </div>
      <div className="w-full h-3 bg-[#2A3645] overflow-hidden" style={{ border: '1px solid #1F2833' }}>
        <motion.div className={`h-full ${pct <= 20 ? 'bg-[#FF2E9A]' : 'bg-[#FFE66D]'}`} animate={{ width: `${pct}%` }} transition={{ duration: 0.1, ease: 'linear' }} />
      </div>
    </div>
  );
}
