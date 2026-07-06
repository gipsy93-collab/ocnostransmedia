import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRight, ChevronRight, X, Zap, Heart, RotateCcw, Home, Play } from 'lucide-react';
import NeonButton from '../components/NeonButton';
import QuestionModal from '../components/QuestionModal';
import GameCanvas from './GameCanvas';
import SnakeHUD from './SnakeHUD';
import { useGameLoop, useInputHandler } from './useGameLoop';
import { useGameStore } from '../store/gameStore';
import type { GameState, Direction, WallMode } from './types';
import { initGameState, startLevel, advanceLevel, handleQuestionAnswer, checkBonusLife, OPPOSITE } from './logic';
import { LEVELS } from './constants';
import type { Question } from '../data/questions';
import { questions } from '../data/questions';

function DPad({ onDirection }: { onDirection: (dir: Direction) => void }) {
  const btn = 'w-14 h-14 bg-[#1F2833]/60 border border-[#2A3645] flex items-center justify-center text-[#8A95A5] active:bg-[#4CAF50]/40 active:text-[#4CAF50] active:border-[#4CAF50] transition-all duration-100 rounded-sm';
  return (
    <div className="flex flex-col items-center gap-1">
      <button className={btn} onTouchStart={() => onDirection('UP')} aria-label="Arriba"><ArrowUp size={24} /></button>
      <div className="flex gap-1">
        <button className={btn} onTouchStart={() => onDirection('LEFT')} aria-label="Izquierda"><ArrowLeftIcon size={24} /></button>
        <div className="w-14 h-14" />
        <button className={btn} onTouchStart={() => onDirection('RIGHT')} aria-label="Derecha"><ArrowRight size={24} /></button>
      </div>
      <button className={btn} onTouchStart={() => onDirection('DOWN')} aria-label="Abajo"><ArrowDown size={24} /></button>
    </div>
  );
}

export default function SnakePage() {
  const [gameState, setGameState] = useState<GameState>(() => initGameState());
  const [showTutorial, setShowTutorial] = useState(false);
  const [wallMode, setWallMode] = useState<WallMode>('wrap');
  const gameLoop = useGameLoop();
  const { startLoop, stopLoop, updateState, getState } = gameLoop;
  const prevScoreRef = useRef(0);
  const store = useGameStore();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Focus game container when playing to ensure keyboard events are captured
  useEffect(() => {
    if (gameState.status === 'PLAYING' && gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, [gameState.status]);

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
    if (newState.score !== store.currentScore) store.incrementScore(newState.score - store.currentScore);
    if (newState.lives !== store.lives) {
      const diff = store.lives - newState.lives;
      if (diff > 0) for (let i = 0; i < diff; i++) store.loseLife();
    }
    if (checkBonusLife(newState, prevScoreRef.current)) {}
    prevScoreRef.current = newState.score;
  }, [store]);

  const handleQuestionTrigger = useCallback((question: Question) => {
    setGameState((prev) => ({ ...prev, currentQuestion: question, status: 'QUESTION' }));
  }, []);

  const handleDirectionChange = useCallback((dir: Direction) => {
    // Read directly from the game loop's state ref (not React state)
    // to ensure direction changes are immediately visible to the game tick
    const current = getState();
    if (!current || current.status !== 'PLAYING') return;

    // Prevent reversing direction
    if (OPPOSITE[current.snake.direction] === dir) return;
    if (OPPOSITE[current.snake.nextDirection] === dir) return;

    // Write directly to the game loop's stateRef
    updateState({
      ...current,
      snake: { ...current.snake, nextDirection: dir },
    });
  }, [getState, updateState]);

  const handlePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === 'PLAYING') return { ...prev, status: 'PAUSED' };
      if (prev.status === 'PAUSED') return { ...prev, status: 'PLAYING' };
      return prev;
    });
  }, []);

  const handleStartGame = useCallback(() => {
    const s = startLevel(1, wallMode);
    prevScoreRef.current = 0;
    store.startGame('snake');
    setGameState(s);
    startLoop(s, { onStateChange: handleStateChange, onQuestionTrigger: handleQuestionTrigger });
  }, [wallMode, startLoop, handleStateChange, handleQuestionTrigger, store]);

  const handleResume = useCallback(() => {
    setGameState((prev) => {
      const resumed = { ...prev, status: 'PLAYING' as const };
      updateState(resumed);
      return resumed;
    });
  }, [updateState]);

  const handleRestart = useCallback(() => {
    stopLoop();
    const s = startLevel(1, wallMode);
    prevScoreRef.current = 0;
    store.startGame('snake');
    setGameState(s);
    startLoop(s, { onStateChange: handleStateChange, onQuestionTrigger: handleQuestionTrigger });
  }, [wallMode, stopLoop, startLoop, handleStateChange, handleQuestionTrigger, store]);

  const handleBackToMenu = useCallback(() => {
    stopLoop();
    store.resetSession();
    setGameState(initGameState());
  }, [stopLoop, store]);

  const handleQuestionAnswered = useCallback((correct: boolean) => {
    setGameState((prev) => {
      const ns = handleQuestionAnswer(prev, correct);
      updateState(ns);
      if (correct) store.incrementQuestionsAnswered(true);
      else store.incrementQuestionsAnswered(false);
      return ns;
    });
  }, [updateState, store]);

  const handleNextLevel = useCallback(() => {
    setGameState((prev) => {
      const ns = advanceLevel(prev);
      updateState(ns);
      return ns;
    });
  }, [updateState]);

  const { handleTouchStart, handleTouchEnd } = useInputHandler(handleDirectionChange, handlePause);

  useEffect(() => { return () => { stopLoop(); }; }, [stopLoop]);
  useEffect(() => { if (gameState.status === 'PLAYING') updateState(gameState); }, [gameState.status, updateState]);

  const levelConfig = LEVELS[Math.min(gameState.level - 1, LEVELS.length - 1)];

  return (
    <div
      ref={gameContainerRef}
      tabIndex={0}
      className="min-h-[100dvh] flex flex-col items-center justify-center px-2 py-4 sm:py-8 relative outline-none"
      aria-label="Juego Serpiente del Saber. Use las flechas o WASD para mover, espacio para pausar."
    >
      <AnimatePresence mode="wait">
        {gameState.status === 'MENU' && (
          <motion.div key="menu" className="w-full max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="text-center mb-6">
              <h1 className="font-pixel text-xl sm:text-2xl text-[#4CAF50] mb-3" style={{ textShadow: '0 0 20px rgba(76,175,80,0.5)' }}>SERPIENTE DEL SABER</h1>
              <p className="text-[#8A95A5] font-body text-sm mt-3">Controla la serpiente, recolecta conocimiento y evita los errores</p>
            </div>
            <div className="bg-[#1F2833] border border-[#2A3645] p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-pixel text-xs text-[#4CAF50]">NIVEL 1</span>
                <span className="font-display text-xs text-[#8A95A5]">{levelConfig.name}</span>
              </div>
              <p className="text-[#8A95A5] text-xs font-body mb-2">Objetivo: Longitud {levelConfig.targetLength}</p>
            </div>
            <div className="flex gap-4 mb-6 justify-center">
              <button onClick={() => setWallMode('wrap')} className={`px-4 py-2 font-pixel text-[0.6rem] uppercase border-2 transition-all duration-150 ${wallMode === 'wrap' ? 'border-[#4CAF50] text-[#4CAF50] bg-[#4CAF50]/10' : 'border-[#2A3645] text-[#8A95A5] hover:border-[#4CAF50]/50'}`}>Wrap</button>
              <button onClick={() => setWallMode('wall')} className={`px-4 py-2 font-pixel text-[0.6rem] uppercase border-2 transition-all duration-150 ${wallMode === 'wall' ? 'border-[#FF2E9A] text-[#FF2E9A] bg-[#FF2E9A]/10' : 'border-[#2A3645] text-[#8A95A5] hover:border-[#FF2E9A]/50'}`}>Paredes</button>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <NeonButton variant="green" onClick={handleStartGame} size="large">COMENZAR</NeonButton>
              <NeonButton variant="cyan" onClick={() => setShowTutorial(true)}>CÓMO JUGAR</NeonButton>
              <Link to="/arcade"><NeonButton variant="yellow"><ArrowLeft size={16} className="mr-2" />VOLVER</NeonButton></Link>
            </div>
          </motion.div>
        )}

        {(gameState.status === 'PLAYING' || gameState.status === 'PAUSED' || gameState.status === 'QUESTION') && (
          <motion.div key="playing" className="w-full max-w-[800px] mx-auto flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SnakeHUD gameState={gameState} onPause={handlePause} />
            <div className="relative border-x-2 border-[#1F2833]">
              <GameCanvas gameState={gameState} onDirectionChange={handleDirectionChange} onPause={handlePause} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
              {gameState.status === 'PAUSED' && (
                <div className="absolute inset-0 bg-[#0B0C10]/85 flex flex-col items-center justify-center z-20">
                  <h2 className="font-pixel text-2xl text-[#4CAF50] mb-6">PAUSA</h2>
                  <div className="flex flex-col gap-3 items-center">
                    <NeonButton variant="green" onClick={handleResume}><Play size={16} className="mr-2" />REANUDAR</NeonButton>
                    <NeonButton variant="cyan" onClick={handleRestart}><RotateCcw size={16} className="mr-2" />REINICIAR</NeonButton>
                    <NeonButton variant="yellow" onClick={handleBackToMenu}><Home size={16} className="mr-2" />MENÚ</NeonButton>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-4 md:hidden"><DPad onDirection={handleDirectionChange} /></div>
            <div className="hidden md:flex justify-center mt-2 gap-4 text-[#8A95A5] text-xs font-body">
              <span>Flechas/WASD: Mover</span><span>Espacio: Pausa</span>
            </div>
            <QuestionModal question={gameState.currentQuestion} onAnswer={handleQuestionAnswered} timeLimit={15} />
          </motion.div>
        )}

        {gameState.status === 'LEVEL_COMPLETE' && (
          <motion.div key="level-complete" className="w-full max-w-md mx-auto text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="font-pixel text-xl text-[#4CAF50] mb-4" style={{ textShadow: '0 0 20px rgba(76,175,80,0.5)' }}>SUBISTE DE NIVEL!</h2>
            <div className="bg-[#1F2833] border border-[#2A3645] p-6 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Longitud:</span><span className="text-[#4CAF50] font-pixel text-sm">{gameState.snake.segments.length}</span></div>
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Conceptos:</span><span className="text-[#FFE66D] font-pixel text-sm">{gameState.tokensCollected}</span></div>
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Preguntas correctas:</span><span className="text-[#66FCF1] font-pixel text-sm">{gameState.questionsCorrect}/{gameState.questionsTotal}</span></div>
                <div className="border-t border-[#2A3645] pt-3 flex justify-between"><span className="text-[#F5F5F5] font-body font-medium">PUNTUACIÓN:</span><span className="text-[#FFE66D] font-pixel text-base" style={{ textShadow: '0 0 8px rgba(255,230,109,0.5)' }}>{String(gameState.score).padStart(6, '0')}</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center">
              {gameState.level < LEVELS.length ? <NeonButton variant="green" onClick={handleNextLevel} size="large">CONTINUAR<ChevronRight size={18} className="ml-2" /></NeonButton> : <NeonButton variant="green" onClick={handleRestart} size="large"><RotateCcw size={18} className="mr-2" />JUGAR DE NUEVO</NeonButton>}
              <NeonButton variant="yellow" onClick={handleBackToMenu}><Home size={16} className="mr-2" />MENÚ</NeonButton>
            </div>
          </motion.div>
        )}

        {gameState.status === 'GAME_OVER' && (
          <motion.div key="game-over" className="w-full max-w-md mx-auto text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="font-pixel text-2xl text-[#FF2E9A] mb-2" style={{ textShadow: '0 0 20px rgba(255,46,154,0.5)' }}>GAME OVER</h2>
            <p className="text-[#8A95A5] font-body text-sm mb-6">La serpiente se ha quedado sin vidas</p>
            <div className="bg-[#1F2833] border border-[#2A3645] p-6 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Nivel:</span><span className="text-[#66FCF1] font-pixel text-sm">{gameState.level}</span></div>
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Longitud máxima:</span><span className="text-[#4CAF50] font-pixel text-sm">{gameState.maxLength}</span></div>
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Conceptos:</span><span className="text-[#FFE66D] font-pixel text-sm">{gameState.tokensCollected}</span></div>
                <div className="border-t border-[#2A3645] pt-3"><div className="flex justify-between items-center"><span className="text-[#F5F5F5] font-body font-medium uppercase tracking-wider text-sm">PUNTUACIÓN FINAL:</span><span className="text-[#FFE66D] font-pixel text-lg" style={{ textShadow: '0 0 12px rgba(255,230,109,0.6)' }}>{String(gameState.score).padStart(6, '0')}</span></div></div>
                {gameState.score >= store.highScores.snake && gameState.score > 0 && <div className="text-center pt-3"><span className="font-pixel text-xs text-[#FFE66D]">NUEVO RÉCORD!</span></div>}
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <NeonButton variant="green" onClick={handleRestart} size="large"><RotateCcw size={18} className="mr-2" />REINTENTAR</NeonButton>
              <NeonButton variant="yellow" onClick={handleBackToMenu}><Home size={16} className="mr-2" />MENÚ PRINCIPAL</NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0C10]/90">
          <motion.div className="w-full max-w-lg bg-[#1F2833] border-[3px] border-[#66FCF1] p-6 relative max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setShowTutorial(false)} className="absolute top-3 right-3 text-[#8A95A5] hover:text-[#F5F5F5] transition-colors" aria-label="Cerrar tutorial"><X size={20} /></button>
            <h2 className="font-pixel text-lg text-[#66FCF1] mb-6 text-center">CÓMO JUGAR</h2>
            <div className="space-y-3 text-[#F5F5F5] text-sm font-body">
              <p>Usa <strong>FLECHAS</strong> o <strong>WASD</strong> para guiar la serpiente.</p>
              <p><span className="text-[#4CAF50]">● Verdes</span> = Conceptos correctos (+10 pts, crecen +1, cargan amarillos)</p>
              <p><span className="text-[#FFE66D]">● Amarillos</span> = Preguntas informativas (crecen +2, activar primero)</p>
              <p><span className="text-[#FF2E9A]">● Rojos</span> = Conceptos erróneos (-30 pts, encogen -2)</p>
              <p className="border-t border-[#2A3645] pt-3"><strong className="text-[#FFE66D]">⚡ Amarillos bloqueados:</strong> Aparecen en el tablero pero no se pueden comer. Cada 3 verdes consumidos, un amarillo se <strong className="text-[#66FCF1]">activa</strong> (brilla con anillo). Una vez activo, cómelo para abrir una ventana de información.</p>
              <p><strong className="text-[#FF2E9A]">⚠ Para avanzar de nivel:</strong> Debes alcanzar la longitud objetivo <strong className="text-[#66FCF1]">Y</strong> responder correctamente la <strong>mitad + 1</strong> de las preguntas amarillas del nivel. Si fallas, la serpiente igual crece, pero no cuenta como acierto.</p>
              <p>Tienes <strong>3 vidas</strong>. Cada nivel tiene más amarillos (2→3→4... hasta 9). Elige bien tus respuestas para desbloquear el siguiente nivel.</p>
            </div>
            <div className="mt-6 text-center"><NeonButton variant="green" onClick={() => setShowTutorial(false)}>ENTENDIDO</NeonButton></div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
