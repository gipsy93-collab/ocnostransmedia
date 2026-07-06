import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import type { Question } from '../data/questions';
import { LETTER_LABELS, isBossQuestion, isFinalBoss } from './types';
import { getShortCategory, getCategoryColor } from './QuizEngine';

interface QuestionCardProps { question: Question; questionIndex: number; totalQuestions: number; round: number; selectedAnswer: number | null; isRevealed: boolean; correctAnswer: number; onSelectAnswer: (index: number) => void; disabled: boolean; }

export default function QuestionCard({ question, questionIndex, totalQuestions, round, selectedAnswer, isRevealed, correctAnswer, onSelectAnswer, disabled }: QuestionCardProps) {
  const [displayText, setDisplayText] = useState('');
  const boss = isBossQuestion(questionIndex);
  const finalBoss = isFinalBoss(round, questionIndex);

  useEffect(() => {
    setDisplayText('');
    const words = question.text.split(' ');
    let cw = 0;
    const iv = setInterval(() => { if (cw < words.length) { setDisplayText(words.slice(0, cw + 1).join(' ')); cw++; } else clearInterval(iv); }, 30);
    return () => clearInterval(iv);
  }, [question.text]);

  const btnStyle = (index: number) => {
    const base = 'relative w-full min-h-[64px] p-3 sm:p-4 text-left border-2 transition-all duration-200 font-body text-sm sm:text-base';
    if (isRevealed) {
      if (index === correctAnswer) return `${base} bg-[#4CAF50]/15 border-[#4CAF50] text-[#F5F5F5]`;
      if (index === selectedAnswer && index !== correctAnswer) return `${base} bg-[#FF2E9A]/15 border-[#FF2E9A] text-[#F5F5F5]`;
      return `${base} bg-[#1F2833]/50 border-[#2A3645]/50 text-[#8A95A5] opacity-60`;
    }
    if (index === selectedAnswer) return `${base} bg-[#FFE66D]/10 border-[#FFE66D] text-[#F5F5F5]`;
    if (disabled) return `${base} bg-[#1F2833] border-[#2A3645] text-[#8A95A5] cursor-not-allowed opacity-60`;
    return `${base} bg-[#1F2833] border-[#2A3645] text-[#F5F5F5] hover:border-[#FFE66D] hover:bg-[#FFE66D]/5 hover:-translate-y-0.5 cursor-pointer`;
  };

  return (
    <motion.div className="w-full max-w-[800px] mx-auto px-3 sm:px-4" initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, x: -100 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
      <div className={`bg-[#1F2833] p-4 sm:p-6 mb-4 relative ${finalBoss ? 'border-2 border-[#FF2E9A]' : boss ? 'border-2 border-[#FF2E9A]/70' : 'border-2 border-[#2A3645]'}`} style={finalBoss || boss ? { boxShadow: `0 0 20px ${finalBoss ? 'rgba(255,46,154,0.4)' : 'rgba(255,46,154,0.2)'}` } : {}}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#8A95A5] text-xs font-body uppercase">PREGUNTA {questionIndex + 1} DE {totalQuestions}</span>
          {finalBoss && <motion.div className="flex items-center gap-1 bg-[#FF2E9A] px-2 py-0.5" animate={{ boxShadow: ['0 0 5px rgba(255,46,154,0.5)', '0 0 15px rgba(255,46,154,0.8)', '0 0 5px rgba(255,46,154,0.5)'] }} transition={{ duration: 1, repeat: Infinity }}>
            <Star size={12} className="text-white fill-white" /><span className="font-pixel text-[0.5rem] text-white uppercase">FINAL BOSS</span><Star size={12} className="text-white fill-white" /></motion.div>}
          {boss && !finalBoss && <motion.div className="flex items-center gap-1 bg-[#FF2E9A]/80 px-2 py-0.5" animate={{ boxShadow: ['0 0 5px rgba(255,46,154,0.3)', '0 0 10px rgba(255,46,154,0.5)', '0 0 5px rgba(255,46,154,0.3)'] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Star size={12} className="text-white fill-white" /><span className="font-pixel text-[0.5rem] text-white uppercase">BOSS</span><Star size={12} className="text-white fill-white" /></motion.div>}
        </div>
        <h2 className="font-display text-[clamp(1rem,2.5vw,1.3rem)] text-[#F5F5F5] font-medium leading-relaxed mb-4 min-h-[3rem]">
          {displayText}{displayText.length < question.text.length && <span className="inline-block w-2 h-4 bg-[#66FCF1] ml-1 animate-pulse" />}
        </h2>
        <span className="inline-block text-[0.65rem] font-body uppercase tracking-[0.1em] px-2 py-0.5" style={{ color: getCategoryColor(question.category), border: `1px solid ${getCategoryColor(question.category)}40`, backgroundColor: `${getCategoryColor(question.category)}10` }}>{getShortCategory(question.category)}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((opt, index) => (
          <motion.button key={`${question.id}-${index}`} className={btnStyle(index)} onClick={() => !disabled && !isRevealed && onSelectAnswer(index)} whileHover={!disabled && !isRevealed ? { scale: 1.02 } : {}} whileTap={!disabled && !isRevealed ? { scale: 0.97 } : {}} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 300 }} disabled={disabled || isRevealed}>
            <span className="font-pixel text-[0.7rem] sm:text-[0.8rem] text-[#FFE66D] mr-2">{LETTER_LABELS[index]}</span>
            <span className="text-[#F5F5F5]">{opt}</span>
            {isRevealed && index === correctAnswer && <motion.span className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-[#4CAF50] text-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.2 }}>✓</motion.span>}
            {isRevealed && index === selectedAnswer && index !== correctAnswer && <motion.span className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-[#FF2E9A] text-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.2 }}>✕</motion.span>}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
