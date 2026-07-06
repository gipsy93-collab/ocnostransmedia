import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Clock, Lightbulb } from 'lucide-react';

interface QuizFeedbackProps { isCorrect: boolean; isTimeout: boolean; pointsEarned: number; explanation: string; combo: number; onContinue: () => void; autoAdvance?: boolean; autoAdvanceDelay?: number; }

export default function QuizFeedback({ isCorrect, isTimeout, pointsEarned, explanation, combo, onContinue, autoAdvance = true, autoAdvanceDelay = 2500 }: QuizFeedbackProps) {
  useEffect(() => { if (autoAdvance) { const t = setTimeout(() => onContinue(), autoAdvanceDelay); return () => clearTimeout(t); } }, [autoAdvance, autoAdvanceDelay, onContinue]);
  const txt = isTimeout ? '¡TIEMPO!' : isCorrect ? '¡CORRECTO!' : 'INCORRECTO';
  const clr = isCorrect ? '#4CAF50' : '#FF2E9A';

  return (
    <AnimatePresence>
      <motion.div className="w-full max-w-[800px] mx-auto px-3 sm:px-4 mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}>
        <motion.div className="flex items-center justify-center gap-2 mb-3" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 15 }}>
          {isCorrect ? <CheckCircle size={24} className="text-[#4CAF50]" /> : isTimeout ? <Clock size={24} className="text-[#FF2E9A]" /> : <XCircle size={24} className="text-[#FF2E9A]" />}
          <span className="font-pixel text-[0.8rem] sm:text-[1rem]" style={{ color: clr }}>{txt}</span>
        </motion.div>
        {pointsEarned !== 0 && <motion.div className="text-center mb-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: [0, 1, 1, 0], y: [-20, 0, 0, -10] }} transition={{ duration: 1.5, times: [0, 0.2, 0.7, 1] }}>
          <span className="font-pixel text-[1rem] sm:text-[1.2rem]" style={{ color: pointsEarned > 0 ? '#FFE66D' : '#FF2E9A' }}>{pointsEarned > 0 ? '+' : ''}{pointsEarned} PTS</span>
        </motion.div>}
        {isCorrect && combo >= 2 && <motion.div className="text-center mb-3" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}>
          <span className="font-pixel text-[0.7rem] text-[#FFE66D]">COMBO x{combo >= 5 ? 3 : combo >= 4 ? 2.5 : combo >= 3 ? 2 : 1.5}!</span>
        </motion.div>}
        <motion.div className="bg-[#1F2833]/80 border border-[#2A3645] p-4 flex items-start gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Lightbulb size={18} className="text-[#FFE66D] mt-0.5 shrink-0" />
          <p className="text-[#F5F5F5] text-sm font-body leading-relaxed italic">{explanation}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
