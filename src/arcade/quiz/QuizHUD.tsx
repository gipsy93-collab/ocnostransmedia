import { motion } from 'motion/react';
import { Heart, Zap } from 'lucide-react';
import { getComboLabel, getComboMultiplier } from './QuizEngine';
import type { QuizDifficulty } from './types';

interface QuizHUDProps { score: number; lives: number; maxLives: number; combo: number; currentRound: number; currentQuestionIndex: number; difficulty: QuizDifficulty; roundName: string; }

export default function QuizHUD({ score, lives, maxLives, combo, currentRound, currentQuestionIndex, difficulty }: QuizHUDProps) {
  const dc = difficulty === 'easy' ? 'text-[#4CAF50]' : difficulty === 'normal' ? 'text-[#FFE66D]' : 'text-[#FF2E9A]';
  const cm = getComboMultiplier(combo);
  return (
    <div className="w-full bg-[#0B0C10]/90 backdrop-blur-sm" style={{ borderBottom: '2px solid #FFE66D' }}>
      <div className="max-w-[800px] mx-auto px-3 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div><span className="font-pixel text-[0.5rem] sm:text-[0.6rem] text-[#8A95A5] uppercase">Score</span>
              <motion.span key={score} className="font-pixel text-[0.75rem] sm:text-[0.85rem] text-[#FFE66D] tabular-nums" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 0.12 }}>{String(score).padStart(6, '0')}</motion.span></div>
            {combo >= 2 && <motion.div className="flex items-center gap-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
              <Zap size={14} className={cm >= 3 ? 'text-[#FF2E9A]' : cm >= 2 ? 'text-[#FFE66D]' : 'text-[#66FCF1]'} />
              <span className={`font-pixel text-[0.6rem] sm:text-[0.7rem] ${cm >= 3 ? 'text-[#FF2E9A]' : cm >= 2 ? 'text-[#FFE66D]' : 'text-[#66FCF1]'}`}>{getComboLabel(combo)}</span>
            </motion.div>}
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-[0.65rem] sm:text-[0.8rem] text-[#F5F5F5] uppercase tracking-wider">Ronda {currentRound} de 5 — <span className={dc}>{difficulty === 'easy' ? 'Fácil' : difficulty === 'normal' ? 'Normal' : 'Difícil'}</span></span>
            <div className="w-full max-w-[140px] h-1.5 bg-[#2A3645] mt-1 overflow-hidden"><div className="h-full bg-[#FFE66D] transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }} /></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[0.5rem] text-[#8A95A5] uppercase hidden sm:inline">Vidas</span>
            <div className="flex items-center gap-1">{Array.from({ length: maxLives }, (_, i) => (
              <motion.div key={i} animate={i >= lives ? { y: 50, rotate: 45, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }} transition={i >= lives ? { duration: 0.5 } : { duration: 0.2 }}>
                <Heart size={16} className={i < lives ? 'text-[#FF2E9A] fill-[#FF2E9A]' : 'text-[#2A3645]'} />
              </motion.div>
            ))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
