import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Heart, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import type { QuestionHistory } from './types';
import { ROUND_CONFIGS } from './types';

interface RoundTransitionProps { round: number; questionHistory: QuestionHistory[]; roundStartIndex: number; livesRemaining: number; onNextRound: () => void; onViewResults: () => void; isLastRound: boolean; }

export default function RoundTransition({ round, questionHistory, roundStartIndex, livesRemaining, onNextRound, onViewResults, isLastRound }: RoundTransitionProps) {
  const [countdown, setCountdown] = useState(4);
  const [showContent, setShowContent] = useState(false);
  const rc = ROUND_CONFIGS[round - 1];
  const rq = questionHistory.slice(roundStartIndex, roundStartIndex + 5);
  const correct = rq.filter((q) => q.isCorrect).length;
  const pts = rq.reduce((s, q) => s + q.pointsEarned, 0);
  const perfect = correct === 5;

  useEffect(() => { const t = setTimeout(() => setShowContent(true), 300); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (countdown > 0) { const t = setTimeout(() => setCountdown(countdown - 1), 1000); return () => clearTimeout(t); }
    else { if (isLastRound) onViewResults(); else onNextRound(); }
  }, [countdown, isLastRound, onNextRound, onViewResults]);

  return (
    <motion.div className="w-full max-w-[600px] mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className={`bg-[#1F2833] border-2 p-6 text-center`} style={{ borderColor: rc?.accentColor || '#FFE66D', boxShadow: `0 0 30px ${(rc?.accentColor || '#FFE66D')}20` }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-pixel text-[clamp(0.9rem,3vw,1.2rem)] uppercase tracking-wider mb-1" style={{ color: rc?.accentColor || '#FFE66D' }}>{perfect ? '¡RONDA PERFECTA!' : `¡RONDA ${round} COMPLETADA!`}</h2>
          {rc && <p className="font-display text-sm text-[#8A95A5] uppercase tracking-wider mb-6">{rc.theme}</p>}
        </motion.div>
        <AnimatePresence>{showContent && <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex flex-col items-center gap-1"><CheckCircle size={20} className="text-[#4CAF50]" /><span className="font-pixel text-[0.9rem] text-[#F5F5F5]">{correct}/5</span><span className="text-[0.6rem] text-[#8A95A5] uppercase">Correctas</span></div>
          <div className="flex flex-col items-center gap-1"><Trophy size={20} className="text-[#FFE66D]" /><span className="font-pixel text-[0.9rem] text-[#FFE66D]">{pts > 0 ? `+${pts}` : pts}</span><span className="text-[0.6rem] text-[#8A95A5] uppercase">Puntos</span></div>
          <div className="flex flex-col items-center gap-1"><Heart size={20} className="text-[#FF2E9A]" /><span className="font-pixel text-[0.9rem] text-[#FF2E9A]">{livesRemaining}</span><span className="text-[0.6rem] text-[#8A95A5] uppercase">Vidas</span></div>
          <div className="flex flex-col items-center gap-1"><Zap size={20} className="text-[#66FCF1]" /><span className="font-pixel text-[0.9rem] text-[#66FCF1]">{perfect ? '+300' : '0'}</span><span className="text-[0.6rem] text-[#8A95A5] uppercase">Bonus</span></div>
        </motion.div>}</AnimatePresence>
        {perfect && <motion.div className="mb-4 py-2 px-4 bg-[#4CAF50]/10 border border-[#4CAF50]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 400 }}><span className="font-pixel text-[0.7rem] text-[#4CAF50]">¡BONUS PERFECTO! +300 PTS</span></motion.div>}
        <div className="flex items-center justify-center gap-2"><span className="font-pixel text-[0.6rem] text-[#8A95A5]">{isLastRound ? 'VIENDO RESULTADOS' : 'SIGUIENTE RONDA'}</span><ArrowRight size={14} className="text-[#8A95A5]" /><motion.span className="font-pixel text-[0.8rem] text-[#FFE66D]" key={countdown} initial={{ scale: 1.5 }} animate={{ scale: 1 }}>{countdown}</motion.span></div>
      </motion.div>
    </motion.div>
  );
}
