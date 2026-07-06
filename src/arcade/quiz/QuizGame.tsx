import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import type { QuizDifficulty, QuestionHistory, GamePhase } from './types';
import { ROUND_CONFIGS, DIFFICULTY_SETTINGS } from './types';
import { selectQuestionsForRound, getTimerForQuestion, calculateScore } from './QuizEngine';
import QuizMenu from './QuizMenu';
import QuizHUD from './QuizHUD';
import QuizTimer from './QuizTimer';
import QuestionCard from './QuestionCard';
import QuizFeedback from './QuizFeedback';
import RoundTransition from './RoundTransition';
import QuizResults from './QuizResults';

export default function QuizGame() {
  const { highScores, setHighScore, startGame: storeStartGame, endGame: storeEndGame } = useGameStore();
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('normal');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxLives, setMaxLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [totalTimePlayed, setTotalTimePlayed] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [bossesDefeated, setBossesDefeated] = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<any[]>([]);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());
  const [shakeScreen, setShakeScreen] = useState(false);
  const [roundStartIndex, setRoundStartIndex] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countdownText, setCountdownText] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = roundQuestions[currentQuestionIndex] || null;
  const isBoss = currentQuestionIndex === 4;
  const isFinalBossQ = currentRound === 5 && currentQuestionIndex === 4;

  const clearTimer = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);
  const clearTotal = useCallback(() => { if (totalTimeRef.current) { clearInterval(totalTimeRef.current); totalTimeRef.current = null; } }, []);

  useEffect(() => {
    if (phase === 'PLAYING' || phase === 'ANSWER_REVEALED') {
      totalTimeRef.current = setInterval(() => setTotalTimePlayed((p) => p + 1), 1000);
      return () => clearTotal();
    }
  }, [phase, clearTotal]);

  useEffect(() => {
    if (phase === 'PLAYING' && currentQuestion) {
      const dur = getTimerForQuestion(currentRound, currentQuestionIndex, difficulty);
      setTimeRemaining(dur);
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0.1) { clearTimer(); handleTimeUp(); return 0; }
          return prev - 0.1;
        });
      }, 100);
      return () => clearTimer();
    }
  }, [phase, currentQuestion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'PLAYING' && selectedAnswer === null) {
        const k = e.key.toUpperCase();
        if (k === '1' || k === 'A') handleSelectAnswer(0);
        else if (k === '2' || k === 'B') handleSelectAnswer(1);
        else if (k === '3' || k === 'C') handleSelectAnswer(2);
        else if (k === '4' || k === 'D') handleSelectAnswer(3);
      } else if (phase === 'ANSWER_REVEALED' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, selectedAnswer]);

  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return;
    setIsTimeout(true); setSelectedAnswer(null); setIsCorrect(false); setCombo(0);
    setLives((prev) => { if (prev - 1 <= 0) setTimeout(() => handleGameOver(), 500); return prev - 1; });
    setPointsEarned(-50);
    setQuestionHistory((prev) => [...prev, { question: currentQuestion, selectedAnswer: null, isCorrect: false, pointsEarned: -50, timeSpent: getTimerForQuestion(currentRound, currentQuestionIndex, difficulty) }]);
    setScore((prev) => Math.max(0, prev - 50));
    setShakeScreen(true); setTimeout(() => setShakeScreen(false), 400);
    setPhase('ANSWER_REVEALED');
  }, [currentQuestion]);

  const handleSelectAnswer = useCallback((index: number) => {
    if (phase !== 'PLAYING' || !currentQuestion || selectedAnswer !== null) return;
    clearTimer();
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctAnswer;
    setIsCorrect(correct); setIsTimeout(false);
    const sr = calculateScore(correct, correct ? combo + 1 : 0, timeRemaining, isBoss, isFinalBossQ);
    setPointsEarned(sr.totalPoints);
    if (correct) {
      setCombo((c) => c + 1); setMaxCombo((c) => Math.max(c, combo + 1));
      setScore((p) => p + sr.totalPoints); setQuestionsCorrect((p) => p + 1);
      if (isBoss || isFinalBossQ) setBossesDefeated((p) => p + 1);
    } else {
      setCombo(0); setScore((p) => Math.max(0, p - 50));
      setLives((prev) => { if (prev - 1 <= 0) setTimeout(() => handleGameOver(), 1500); return prev - 1; });
      setShakeScreen(true); setTimeout(() => setShakeScreen(false), 400);
    }
    setQuestionHistory((prev) => [...prev, { question: currentQuestion, selectedAnswer: index, isCorrect: correct, pointsEarned: sr.totalPoints, timeSpent: getTimerForQuestion(currentRound, currentQuestionIndex, difficulty) - timeRemaining }]);
    setPhase('ANSWER_REVEALED');
  }, [phase, currentQuestion, selectedAnswer, combo, timeRemaining, isBoss, isFinalBossQ, clearTimer]);

  const handleGameOver = useCallback(() => {
    clearTimer(); clearTotal();
    setHighScore('quiz', score); setPhase('GAME_OVER'); storeEndGame();
  }, [clearTimer, clearTotal, score, setHighScore, storeEndGame]);

  const handleContinue = useCallback(() => {
    if (lives <= 0) { handleGameOver(); return; }
    if (currentQuestionIndex < roundQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1); setSelectedAnswer(null);
      setIsCorrect(null); setPointsEarned(0); setIsTimeout(false); setPhase('PLAYING');
    } else {
      const rc = questionHistory.slice(roundStartIndex).filter((q) => q.isCorrect).length;
      if (rc === 5) setScore((p) => p + 300);
      if (currentRound >= 5) { setHighScore('quiz', score + (rc === 5 ? 300 : 0)); storeEndGame(); setPhase('FINAL_SCORE'); }
      else setPhase('ROUND_TRANSITION');
    }
  }, [lives, currentQuestionIndex, roundQuestions.length, currentRound, questionHistory, roundStartIndex, score]);

  const handleStartGame = useCallback((diff: QuizDifficulty) => {
    setDifficulty(diff);
    const s = DIFFICULTY_SETTINGS[diff];
    setLives(s.livesPerRound); setMaxLives(s.livesPerRound); setScore(0); setCombo(0);
    setMaxCombo(0); setQuestionsCorrect(0); setBossesDefeated(0); setTotalTimePlayed(0);
    setQuestionHistory([]); setUsedQuestionIds(new Set<number>()); setCurrentRound(1);
    setCurrentQuestionIndex(0); setRoundStartIndex(0); setSelectedAnswer(null); setIsCorrect(null);
    storeStartGame('quiz');
    const r1 = ROUND_CONFIGS[0];
    const qs = selectQuestionsForRound(r1, new Set<number>());
    setRoundQuestions(qs); qs.forEach((q) => setUsedQuestionIds((p) => new Set(p).add(q.id)));
    setCountdown(3); setCountdownText(r1.theme);
    setPhase('COUNTDOWN');
  }, [storeStartGame]);

  useEffect(() => {
    if (phase === 'COUNTDOWN') {
      if (countdown > 0) { const t = setTimeout(() => setCountdown((c) => c - 1), 800); return () => clearTimeout(t); }
      else { const t = setTimeout(() => setPhase('PLAYING'), 800); return () => clearTimeout(t); }
    }
  }, [phase, countdown]);

  const handleNextRound = useCallback(() => {
    const nr = currentRound + 1; setCurrentRound(nr); setCurrentQuestionIndex(0);
    setRoundStartIndex(questionHistory.length); setSelectedAnswer(null); setIsCorrect(null);
    const rc = questionHistory.slice(roundStartIndex).filter((q) => q.isCorrect).length;
    const s = DIFFICULTY_SETTINGS[difficulty];
    const bl = rc === 5 ? 1 : 0;
    setLives(Math.min(s.livesPerRound + bl, s.livesPerRound + 1));
    setMaxLives(s.livesPerRound + bl);
    const rcfg = ROUND_CONFIGS[nr - 1];
    const nu = new Set<number>(usedQuestionIds);
    const qs = selectQuestionsForRound(rcfg, nu);
    setRoundQuestions(qs); qs.forEach((q) => nu.add(q.id)); setUsedQuestionIds(nu);
    setCountdown(3); setCountdownText(rcfg.theme); setPhase('COUNTDOWN');
  }, [currentRound, questionHistory, roundStartIndex, difficulty, usedQuestionIds]);

  const handlePlayAgain = useCallback(() => { handleStartGame(difficulty); }, [difficulty, handleStartGame]);
  const handleGoMenu = useCallback(() => { clearTimer(); clearTotal(); setPhase('MENU'); storeEndGame(); }, [clearTimer, clearTotal, storeEndGame]);
  const handleTimeUpCb = useCallback(() => { if (phase === 'PLAYING' && selectedAnswer === null) handleTimeUp(); }, [phase, selectedAnswer, handleTimeUp]);
  const shakeV = { shake: { x: [0, -10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.4 } }, still: { x: 0 } };
  const curRC = ROUND_CONFIGS[currentRound - 1];

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {(phase === 'PLAYING' || phase === 'ANSWER_REVEALED' || phase === 'ROUND_TRANSITION') && (
        <QuizHUD score={score} lives={lives} maxLives={maxLives} combo={combo} currentRound={currentRound} currentQuestionIndex={currentQuestionIndex} difficulty={difficulty} roundName={curRC?.name || ''} />
      )}
      <motion.div className="flex-1 flex items-center justify-center py-4 sm:py-8 px-2 sm:px-4 relative" variants={shakeV} animate={shakeScreen ? 'shake' : 'still'}>
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,230,109,0.03) 0%, transparent 60%)' }} aria-hidden="true" />
        <AnimatePresence mode="wait">
          {phase === 'MENU' && <motion.div key="menu"><QuizMenu onStart={handleStartGame} highScore={highScores.quiz} /></motion.div>}
          {phase === 'COUNTDOWN' && (
            <motion.div key="countdown" className="text-center z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.p className="font-display text-[clamp(1rem,3vw,1.5rem)] text-[#8A95A5] uppercase tracking-wider mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>RONDA {currentRound}</motion.p>
              <motion.p className="font-pixel text-[clamp(1.2rem,4vw,2rem)] text-[#FFE66D] uppercase tracking-wider mb-8" style={{ textShadow: '0 0 20px #FFE66D60' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>{countdownText}</motion.p>
              <motion.div className="font-pixel text-[clamp(4rem,12vw,8rem)]" style={{ color: countdown === 3 ? '#4CAF50' : countdown === 2 ? '#FFE66D' : countdown === 1 ? '#FF2E9A' : '#66FCF1', textShadow: `0 0 30px ${countdown === 3 ? '#4CAF50' : countdown === 2 ? '#FFE66D' : countdown === 1 ? '#FF2E9A' : '#66FCF1'}80` }} key={countdown} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>{countdown > 0 ? countdown : '¡COMIENZA!'}</motion.div>
            </motion.div>
          )}
          {phase === 'PLAYING' && currentQuestion && (
            <motion.div key={`playing-${currentRound}-${currentQuestionIndex}`} className="w-full max-w-[800px] z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }}>
              <div className="px-3 sm:px-4 mb-4"><QuizTimer duration={getTimerForQuestion(currentRound, currentQuestionIndex, difficulty)} timeRemaining={timeRemaining} onTimeUp={handleTimeUpCb} /></div>
              <QuestionCard question={currentQuestion} questionIndex={currentQuestionIndex} totalQuestions={5} round={currentRound} selectedAnswer={selectedAnswer} isRevealed={false} correctAnswer={currentQuestion.correctAnswer} onSelectAnswer={handleSelectAnswer} disabled={false} />
              <div className="text-center mt-4"><span className="text-[#8A95A5] text-xs font-body">Pulsa 1-4 o A-D para seleccionar</span></div>
            </motion.div>
          )}
          {phase === 'ANSWER_REVEALED' && currentQuestion && (
            <motion.div key={`feedback-${currentRound}-${currentQuestionIndex}`} className="w-full max-w-[800px] z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuestionCard question={currentQuestion} questionIndex={currentQuestionIndex} totalQuestions={5} round={currentRound} selectedAnswer={selectedAnswer} isRevealed={true} correctAnswer={currentQuestion.correctAnswer} onSelectAnswer={() => {}} disabled={true} />
              <QuizFeedback isCorrect={isCorrect ?? false} isTimeout={isTimeout} pointsEarned={pointsEarned} explanation={currentQuestion.explanation} combo={combo} onContinue={handleContinue} autoAdvance={lives > 0} autoAdvanceDelay={isCorrect ? 2200 : 2700} />
            </motion.div>
          )}
          {phase === 'ROUND_TRANSITION' && (
            <motion.div key={`rt-${currentRound}`}><RoundTransition round={currentRound} questionHistory={questionHistory} roundStartIndex={roundStartIndex} livesRemaining={lives} onNextRound={handleNextRound} onViewResults={() => { setHighScore('quiz', score); storeEndGame(); setPhase('FINAL_SCORE'); }} isLastRound={currentRound >= 5} /></motion.div>
          )}
          {(phase === 'GAME_OVER' || phase === 'FINAL_SCORE') && (
            <motion.div key={phase}><QuizResults score={score} questionsCorrect={questionsCorrect} totalQuestions={phase === 'FINAL_SCORE' ? 25 : questionHistory.length} maxCombo={maxCombo} livesRemaining={lives} bossesDefeated={bossesDefeated} timePlayed={totalTimePlayed} difficulty={difficulty} questionHistory={questionHistory} onPlayAgain={handlePlayAgain} onGoMenu={handleGoMenu} isHighScore={score >= highScores.quiz} /></motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
