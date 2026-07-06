import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, ChevronDown, ChevronUp, Heart, Zap, Star, CheckCircle, XCircle } from 'lucide-react';
import NeonButton from '../components/NeonButton';
import type { QuestionHistory, QuizDifficulty } from './types';
import { calculateGrade } from './QuizEngine';

interface QuizResultsProps { score: number; questionsCorrect: number; totalQuestions: number; maxCombo: number; livesRemaining: number; bossesDefeated: number; timePlayed: number; difficulty: QuizDifficulty; questionHistory: QuestionHistory[]; onPlayAgain: () => void; onGoMenu: () => void; isHighScore: boolean; }

export default function QuizResults({ score, questionsCorrect, totalQuestions, maxCombo, livesRemaining, bossesDefeated, timePlayed, difficulty, questionHistory, onPlayAgain, onGoMenu, isHighScore }: QuizResultsProps) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [revealedGrade, setRevealedGrade] = useState(false);
  const grade = calculateGrade(score);
  const pct = Math.round((questionsCorrect / totalQuestions) * 100);

  useEffect(() => {
    const steps = 60;
    const inc = score / steps;
    let cur = 0;
    const t = setInterval(() => { cur += inc; if (cur >= score) { setDisplayedScore(score); clearInterval(t); setTimeout(() => setRevealedGrade(true), 300); } else setDisplayedScore(Math.floor(cur)); }, 1500 / steps);
    return () => clearInterval(t);
  }, [score]);

  const fmt = (s: number) => `${Math.floor(s / 60)}min ${s % 60}s`;

  return (
    <motion.div className="w-full max-w-[700px] mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-[#1F2833] border-2 p-6 sm:p-8 mb-6" style={{ borderColor: grade.color, boxShadow: `0 0 30px ${grade.color}20` }} initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <h2 className="font-pixel text-[0.8rem] sm:text-[1rem] text-[#FFE66D] uppercase tracking-wider text-center mb-4">{questionsCorrect === totalQuestions ? '¡FELICIDADES! ¡COMPLETADO!' : score > 0 ? '¡QUIZ COMPLETADO!' : 'GAME OVER'}</h2>
        <div className="text-center mb-4">
          <motion.div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 mb-3" style={{ borderColor: grade.color, boxShadow: `0 0 40px ${grade.color}40, inset 0 0 20px ${grade.color}20` }} initial={{ scale: 0, rotate: -180 }} animate={revealedGrade ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}>
            <span className="font-pixel text-[2.5rem] sm:text-[3.5rem]" style={{ color: grade.color, textShadow: `0 0 20px ${grade.color}80` }}>{grade.grade}</span>
          </motion.div>
          <motion.p className="font-display text-lg sm:text-xl uppercase tracking-wider" style={{ color: grade.color }} initial={{ opacity: 0 }} animate={revealedGrade ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.3 }}>{grade.title}</motion.p>
        </div>
        <div className="text-center mb-6">
          <p className="text-[#8A95A5] text-xs uppercase tracking-wider font-body mb-1">Puntuación Total</p>
          <motion.p className="font-pixel text-[1.5rem] sm:text-[2rem] text-[#FFE66D]" style={{ textShadow: '0 0 20px #FFE66D60' }}>{String(displayedScore).padStart(6, '0')}</motion.p>
          {isHighScore && <motion.div className="flex items-center justify-center gap-1 mt-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}><Star size={16} className="text-[#FFE66D] fill-[#FFE66D]" /><span className="font-pixel text-[0.6rem] text-[#FFE66D]">¡NUEVO RÉCORD!</span><Star size={16} className="text-[#FFE66D] fill-[#FFE66D]" /></motion.div>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#2A3645]/50 p-3 text-center"><CheckCircle size={18} className="text-[#4CAF50] mx-auto mb-1" /><span className="font-pixel text-[0.8rem] text-[#F5F5F5]">{questionsCorrect}/{totalQuestions}</span><p className="text-[0.6rem] text-[#8A95A5] uppercase">Correctas</p></div>
          <div className="bg-[#2A3645]/50 p-3 text-center"><Zap size={18} className="text-[#66FCF1] mx-auto mb-1" /><span className="font-pixel text-[0.8rem] text-[#F5F5F5]">x{maxCombo}</span><p className="text-[0.6rem] text-[#8A95A5] uppercase">Max Combo</p></div>
          <div className="bg-[#2A3645]/50 p-3 text-center"><Heart size={18} className="text-[#FF2E9A] mx-auto mb-1" /><span className="font-pixel text-[0.8rem] text-[#F5F5F5]">{livesRemaining}</span><p className="text-[0.6rem] text-[#8A95A5] uppercase">Vidas</p></div>
          <div className="bg-[#2A3645]/50 p-3 text-center"><Trophy size={18} className="text-[#FFE66D] mx-auto mb-1" /><span className="font-pixel text-[0.8rem] text-[#FFE66D]">{bossesDefeated}/5</span><p className="text-[0.6rem] text-[#8A95A5] uppercase">Bosses</p></div>
        </div>
        <div className="flex justify-center gap-6 text-xs text-[#8A95A5] font-body mb-6"><span>Tiempo: {fmt(timePlayed)}</span><span>Dificultad: {difficulty === 'easy' ? 'Fácil' : difficulty === 'normal' ? 'Normal' : 'Difícil'}</span><span>{pct}% acierto</span></div>
        <div className="mb-4">
          <button onClick={() => setShowDetails(!showDetails)} className="flex items-center justify-center gap-2 w-full py-2 text-[#8A95A5] hover:text-[#66FCF1] transition-colors font-body text-sm">
            {showDetails ? <><ChevronUp size={16} /> Ocultar revisión</> : <><ChevronDown size={16} /> Ver revisión de preguntas</>}
          </button>
          {showDetails && <motion.div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            {questionHistory.map((h, i) => (
              <div key={i} className={`flex items-start gap-2 p-2 text-xs font-body ${h.isCorrect ? 'bg-[#4CAF50]/10 border-l-2 border-[#4CAF50]' : 'bg-[#FF2E9A]/10 border-l-2 border-[#FF2E9A]'}`}>
                {h.isCorrect ? <CheckCircle size={14} className="text-[#4CAF50] mt-0.5 shrink-0" /> : <XCircle size={14} className="text-[#FF2E9A] mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0"><p className="text-[#F5F5F5] truncate">{h.question.text}</p><p className="text-[#8A95A5] mt-0.5">{h.selectedAnswer !== null ? h.question.options[h.selectedAnswer] : 'Sin respuesta'}{!h.isCorrect && <span className="text-[#4CAF50] ml-1">✓ {h.question.options[h.question.correctAnswer]}</span>}</p></div>
                <span className="font-pixel text-[0.5rem] text-[#FFE66D] shrink-0">{h.pointsEarned > 0 ? `+${h.pointsEarned}` : '0'}</span>
              </div>
            ))}
          </motion.div>}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NeonButton variant="yellow" onClick={onPlayAgain}><RotateCcw size={16} className="mr-2" />JUGAR DE NUEVO</NeonButton>
          <NeonButton variant="cyan" onClick={onGoMenu}><Home size={16} className="mr-2" />MENÚ</NeonButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
