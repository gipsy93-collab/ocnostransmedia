import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronLeft, Trophy, Flame, Star, Heart, Clock, Zap } from 'lucide-react';
import NeonButton from '../components/NeonButton';
import type { QuizDifficulty } from './types';

interface QuizMenuProps { onStart: (difficulty: QuizDifficulty) => void; highScore: number; }

const diffOpts: { value: QuizDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'FÁCIL', color: '#4CAF50' },
  { value: 'normal', label: 'NORMAL', color: '#FFE66D' },
  { value: 'hard', label: 'DIFÍCIL', color: '#FF2E9A' },
];

export default function QuizMenu({ onStart, highScore }: QuizMenuProps) {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('normal');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <motion.div className="w-full max-w-[600px] mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
        <h1 className="font-pixel text-[clamp(1.2rem,4vw,2rem)] text-[#FFE66D] leading-tight tracking-wider" style={{ textShadow: '0 0 20px #FFE66D, 0 0 40px rgba(255,230,109,0.5)' }}>QUIZ RETRO</h1>
        <motion.p className="font-display text-[clamp(0.8rem,2.5vw,1.2rem)] text-[#66FCF1] mt-2 uppercase tracking-[0.1em]" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>Quiz Show Académico</motion.p>
      </motion.div>

      <motion.div className="bg-[#1F2833] border-2 border-[#2A3645] p-4 mb-6" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1"><Star size={20} className="text-[#FFE66D]" /><span className="font-pixel text-[0.6rem] text-[#8A95A5]">5 RONDAS</span><span className="font-pixel text-[0.5rem] text-[#8A95A5]">25 PREGUNTAS</span></div>
          <div className="flex flex-col items-center gap-1"><Heart size={20} className="text-[#FF2E9A]" /><span className="font-pixel text-[0.6rem] text-[#8A95A5]">VIDAS</span><span className="font-pixel text-[0.5rem] text-[#8A95A5]">POR RONDA</span></div>
          <div className="flex flex-col items-center gap-1"><Flame size={20} className="text-[#66FCF1]" /><span className="font-pixel text-[0.6rem] text-[#8A95A5]">COMBOS</span><span className="font-pixel text-[0.5rem] text-[#8A95A5]">MULTIPLICADORES</span></div>
        </div>
        {highScore > 0 && <div className="mt-3 pt-3 border-t border-[#2A3645] text-center"><span className="font-pixel text-[0.6rem] text-[#FFE66D]">MEJOR PUNTUACIÓN: {String(highScore).padStart(6, '0')}</span></div>}
      </motion.div>

      <motion.div className="mb-6" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
        <p className="font-pixel text-[0.6rem] text-[#8A95A5] uppercase tracking-wider text-center mb-3">Dificultad</p>
        <div className="flex justify-center gap-3">
          {diffOpts.map((opt) => (
            <motion.button key={opt.value} onClick={() => setDifficulty(opt.value)} whileTap={{ scale: 0.95 }}
              className={`font-pixel text-[0.6rem] sm:text-[0.7rem] uppercase tracking-wider px-4 py-2 border-2 transition-all duration-150 ${difficulty === opt.value ? '' : 'bg-transparent text-[#8A95A5] border-[#2A3645] hover:border-[#8A95A5]'}`}
              style={difficulty === opt.value ? { backgroundColor: opt.color, borderColor: opt.color, color: '#0B0C10', boxShadow: `0 0 15px ${opt.color}40` } : {}}>{opt.label}</motion.button>
          ))}
        </div>
        <p className="text-center text-[#8A95A5] text-xs font-body mt-2">{difficulty === 'easy' ? '20s por pregunta, 5 vidas' : difficulty === 'normal' ? '15s por pregunta, 3 vidas' : '10s por pregunta, 2 vidas'}</p>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-3" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
        <NeonButton variant="yellow" size="large" onClick={() => onStart(difficulty)}><Zap size={18} className="mr-2" />¡COMENZAR!</NeonButton>
        <NeonButton variant="cyan" onClick={() => setShowHelp(true)}><HelpCircle size={16} className="mr-2" />CÓMO JUGAR</NeonButton>
        <NeonButton variant="cyan" to="/arcade"><ChevronLeft size={16} className="mr-2" />VOLVER</NeonButton>
      </motion.div>

      <AnimatePresence>{showHelp && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[#0B0C10]/85" onClick={() => setShowHelp(false)} />
          <motion.div className="relative bg-[#1F2833] border-2 border-[#66FCF1] p-6 max-w-[480px] w-full max-h-[80vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25 }}>
            <h2 className="font-pixel text-[0.9rem] text-[#66FCF1] mb-4 text-center uppercase">Cómo Jugar</h2>
            <div className="space-y-4 text-sm font-body text-[#F5F5F5]">
              <p><Clock size={18} className="inline text-[#FFE66D] mr-2" />Responde antes de que se acabe el tiempo.</p>
              <p><Flame size={18} className="inline text-[#66FCF1] mr-2" /><strong className="text-[#66FCF1]">Combos:</strong> Respuestas correctas consecutivas multiplican puntos.</p>
              <p><Star size={18} className="inline text-[#FFE66D] mr-2" /><strong className="text-[#FFE66D]">Boss:</strong> La última pregunta de cada ronda vale el doble.</p>
              <p><Heart size={18} className="inline text-[#FF2E9A] mr-2" /><strong className="text-[#FF2E9A]">Vidas:</strong> Cada error te cuesta una vida.</p>
              <p><Trophy size={18} className="inline text-[#FFE66D] mr-2" /><strong className="text-[#FFE66D]">Rondas:</strong> 5 rondas con 5 preguntas cada una.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#2A3645]"><p className="text-[#8A95A5] text-xs text-center mb-4">Controles: 1-4 o A-D para respuesta · Enter para continuar</p><div className="flex justify-center"><NeonButton variant="green" onClick={() => setShowHelp(false)}>ENTENDIDO ✓</NeonButton></div></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </motion.div>
  );
}
