import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Question } from '../data/questions';

interface QuestionModalProps {
  question: Question | null;
  onAnswer: (correct: boolean) => void;
  timeLimit?: number;
}

export default function QuestionModal({
  question,
  onAnswer,
  timeLimit = 15,
}: QuestionModalProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (question) {
      setTimeLeft(timeLimit);
      setSelectedIndex(null);
      setFeedback(null);
    }
  }, [question, timeLimit]);

  useEffect(() => {
    if (!question || selectedIndex !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          setSelectedIndex(-1);
          setFeedback('wrong');
          setTimeout(() => onAnswer(false), 800);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [question, selectedIndex, onAnswer]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null || !question) return;

      setSelectedIndex(index);
      const isCorrect = index === question.correctAnswer;
      setFeedback(isCorrect ? 'correct' : 'wrong');

      setTimeout(() => {
        onAnswer(isCorrect);
      }, isCorrect ? 800 : 1200);
    },
    [selectedIndex, question, onAnswer],
  );

  if (!question) return null;

  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerColor =
    timerPercent > 50 ? '#FFE66D' : timerPercent > 25 ? '#FF2E9A' : '#FF2E9A';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(11, 12, 16, 0.85)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="w-full max-w-xl bg-[#1F2833] border-[3px] border-[#66FCF1] p-6 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Shake animation on wrong */}
          <div
            className={
              feedback === 'wrong' ? 'animate-shake' : ''
            }
          >
            {/* Question text */}
            <h3 className="font-display text-lg md:text-xl text-[#F5F5F5] text-center mb-6 leading-relaxed">
              {question.text}
            </h3>

            {/* Category & Difficulty badges */}
            <div className="flex justify-center gap-3 mb-4">
              <span className="text-[0.65rem] font-pixel uppercase text-[#8A95A5] bg-[#2A3645] px-2 py-1">
                {question.category}
              </span>
              <span
                className={`text-[0.65rem] font-pixel uppercase px-2 py-1 ${
                  question.difficulty === 'easy'
                    ? 'text-[#4CAF50] bg-[#4CAF50]/10'
                    : question.difficulty === 'normal'
                    ? 'text-[#FFE66D] bg-[#FFE66D]/10'
                    : 'text-[#FF2E9A] bg-[#FF2E9A]/10'
                }`}
              >
                {question.difficulty}
              </span>
            </div>

            {/* Timer bar */}
            <div className="w-full h-3 bg-[#2A3645] mb-6 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: timerColor }}
                animate={{ width: `${timerPercent}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Answer buttons grid */}
            <div
              className={`grid gap-3 ${
                question.options.length <= 2
                  ? 'grid-cols-1'
                  : question.options.length === 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {question.options.map((option, index) => {
                let btnStyle =
                  'border-2 border-[#2A3645] text-[#F5F5F5] bg-transparent hover:border-[#66FCF1] hover:text-[#66FCF1] hover:bg-[#66FCF1]/10';

                if (selectedIndex !== null) {
                  if (index === question.correctAnswer) {
                    btnStyle =
                      'border-2 border-[#4CAF50] text-[#4CAF50] bg-[#4CAF50]/20';
                  } else if (index === selectedIndex && !feedback?.includes('correct')) {
                    btnStyle =
                      'border-2 border-[#FF2E9A] text-[#FF2E9A] bg-[#FF2E9A]/20 animate-shake';
                  } else {
                    btnStyle =
                      'border-2 border-[#2A3645] text-[#8A95A5] bg-transparent opacity-50';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={selectedIndex !== null}
                    className={`
                      px-4 py-3 font-display text-sm text-left
                      transition-all duration-150
                      ${btnStyle}
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                    `}
                  >
                    <span className="font-pixel text-xs mr-3 opacity-60">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Explanation after answering */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  className={`mt-4 p-3 text-sm font-body ${
                    feedback === 'correct'
                      ? 'text-[#4CAF50] bg-[#4CAF50]/10 border border-[#4CAF50]/30'
                      : 'text-[#FF2E9A] bg-[#FF2E9A]/10 border border-[#FF2E9A]/30'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {question.explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
