import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight,
  ChevronRight, X, RotateCcw, Home, Play,
} from 'lucide-react';
import NeonButton from '../arcade/components/NeonButton';
import QuestionModal from '../arcade/components/QuestionModal';
import GameCanvas from '../arcade/snake/GameCanvas';
import SnakeHUD from '../arcade/snake/SnakeHUD';
import { useGameLoop, useInputHandler } from '../arcade/snake/useGameLoop';
import { useGameStore } from '../arcade/store/gameStore';
import type { GameState, Direction, WallMode } from '../arcade/snake/types';
import { initGameState, startLevel, advanceLevel, handleQuestionAnswer, OPPOSITE } from '../arcade/snake/logic';
import { LEVELS } from '../arcade/snake/constants';
import type { Question } from '../arcade/data/questions';

interface SnakeGameProps {
  embedded?: boolean;
  onComplete?: () => void;
}

function DPad({ onDirection }: { onDirection: (dir: Direction) => void }) {
  const btn = 'w-14 h-14 bg-[#1F2833]/60 border border-[#2A3645] flex items-center justify-center text-[#8A95A5] active:bg-[#4CAF50]/40 active:text-[#4CAF50] active:border-[#4CAF50] transition-all duration-100 rounded-sm cursor-pointer select-none';
  const press = (dir: Direction) => (e: React.PointerEvent) => {
    e.preventDefault();
    onDirection(dir);
  };
  return (
    <div className="flex flex-col items-center gap-1" role="group" aria-label="Control direccional táctil">
      <button type="button" className={btn} onPointerDown={press('UP')} aria-label="Mover arriba"><ArrowUp size={24} /></button>
      <div className="flex gap-1">
        <button type="button" className={btn} onPointerDown={press('LEFT')} aria-label="Mover izquierda"><ArrowLeftIcon size={24} /></button>
        <div className="w-14 h-14" aria-hidden="true" />
        <button type="button" className={btn} onPointerDown={press('RIGHT')} aria-label="Mover derecha"><ArrowRight size={24} /></button>
      </div>
      <button type="button" className={btn} onPointerDown={press('DOWN')} aria-label="Mover abajo"><ArrowDown size={24} /></button>
    </div>
  );
}

export default function SnakeGame({ embedded, onComplete }: SnakeGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => initGameState());
  const [showTutorial, setShowTutorial] = useState(false);
  const [wallMode, setWallMode] = useState<WallMode>('wrap');
  const [bestAtStart, setBestAtStart] = useState(0);
  const gameLoop = useGameLoop();
  const { startLoop, stopLoop, updateState, getState } = gameLoop;
  const prevScoreRef = useRef(0);
  const highScoreSnake = useGameStore((s) => s.highScores.snake);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState.status === 'PLAYING' && gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  }, [gameState.status]);

  // Tutorial: cerrar con Escape
  useEffect(() => {
    if (!showTutorial) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTutorial(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showTutorial]);

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
    const st = useGameStore.getState();
    if (newState.score !== st.currentScore) st.incrementScore(newState.score - st.currentScore);
    if (newState.lives !== st.lives) {
      const diff = st.lives - newState.lives;
      if (diff > 0) for (let i = 0; i < diff; i++) st.loseLife();
    }
    if (newState.score > 0 && newState.score > st.highScores.snake) {
      st.setHighScore('snake', newState.score);
    }
    prevScoreRef.current = newState.score;
  }, []);

  const handleQuestionTrigger = useCallback((question: Question) => {
    setGameState((prev) => ({ ...prev, currentQuestion: question, status: 'QUESTION' }));
  }, []);

  const handleDirectionChange = useCallback((dir: Direction) => {
    const current = getState();
    if (!current || current.status !== 'PLAYING') return;
    if (OPPOSITE[current.snake.direction] === dir) return;
    if (OPPOSITE[current.snake.nextDirection] === dir) return;
    updateState({ ...current, snake: { ...current.snake, nextDirection: dir } });
  }, [getState, updateState]);

  // La pausa debe sincronizar el ref del game loop, no solo el estado React
  const handlePause = useCallback(() => {
    const current = getState();
    if (!current) return;
    if (current.status === 'PLAYING') {
      const paused = { ...current, status: 'PAUSED' as const };
      updateState(paused);
      setGameState(paused);
    } else if (current.status === 'PAUSED') {
      const resumed = { ...current, status: 'PLAYING' as const };
      updateState(resumed);
      setGameState(resumed);
    }
  }, [getState, updateState]);

  const beginSession = useCallback((s: GameState) => {
    prevScoreRef.current = 0;
    const st = useGameStore.getState();
    setBestAtStart(st.highScores.snake);
    st.startGame('snake');
    setGameState(s);
    startLoop(s, { onStateChange: handleStateChange, onQuestionTrigger: handleQuestionTrigger });
  }, [startLoop, handleStateChange, handleQuestionTrigger]);

  const handleStartGame = useCallback(() => {
    beginSession(startLevel(1, wallMode));
  }, [wallMode, beginSession]);

  const handleResume = useCallback(() => {
    const current = getState();
    if (!current || current.status !== 'PAUSED') return;
    const resumed = { ...current, status: 'PLAYING' as const };
    updateState(resumed);
    setGameState(resumed);
  }, [getState, updateState]);

  const handleRestart = useCallback(() => {
    stopLoop();
    beginSession(startLevel(1, wallMode));
  }, [wallMode, stopLoop, beginSession]);

  const handleBackToMenu = useCallback(() => {
    stopLoop();
    useGameStore.getState().resetSession();
    setGameState(initGameState());
    if (onComplete) onComplete();
  }, [stopLoop, onComplete]);

  const handleQuestionAnswered = useCallback((correct: boolean) => {
    const current = getState();
    if (!current) return;
    const ns = handleQuestionAnswer(current, correct);
    updateState(ns);
    const st = useGameStore.getState();
    if (correct) st.incrementQuestionsAnswered(true);
    else st.incrementQuestionsAnswered(false);
    setGameState(ns);
  }, [getState, updateState]);

  const handleNextLevel = useCallback(() => {
    const current = getState();
    if (!current) return;
    const ns = advanceLevel(current);
    updateState(ns);
    setGameState(ns);
  }, [getState, updateState]);

  // El handler global solo consume teclas durante PLAYING/PAUSED (no durante preguntas)
  const isInputActive = useCallback(() => {
    const s = getState();
    return s?.status === 'PLAYING' || s?.status === 'PAUSED';
  }, [getState]);

  const { handleTouchStart, handleTouchEnd } = useInputHandler(handleDirectionChange, handlePause, isInputActive);

  useEffect(() => { return () => { stopLoop(); }; }, [stopLoop]);

  const levelConfig = LEVELS[Math.min(gameState.level - 1, LEVELS.length - 1)];
  const isRecord = gameState.score > 0 && gameState.score > bestAtStart;

  return (
    <div
      ref={gameContainerRef}
      tabIndex={0}
      className={`flex flex-col items-center justify-center px-2 py-4 sm:py-8 relative outline-none w-full ${embedded ? '' : 'max-w-[900px] mx-auto'} text-[#F5F5F5]`}
      aria-label="Juego Serpiente del Saber. Usa las flechas o WASD para mover, espacio para pausar."
    >
      <AnimatePresence mode="wait">
        {gameState.status === 'MENU' && (
          <motion.div key="menu" className="w-full max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="text-center mb-6">
              <h1 className="font-pixel text-xl sm:text-2xl text-[#4CAF50] mb-3" style={{ textShadow: '0 0 20px rgba(76,175,80,0.5)' }}>SERPIENTE DEL SABER</h1>
              <p className="text-[#8A95A5] font-body text-sm mt-3">Controla la serpiente, recolecta conocimiento y domina el artículo</p>
            </div>
            <div className="bg-[#1F2833] border border-[#2A3645] p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-pixel text-xs text-[#4CAF50]">NIVEL 1</span>
                <span className="font-display text-xs text-[#8A95A5]">{levelConfig.name}</span>
              </div>
              <p className="text-[#8A95A5] text-xs font-body mb-1">Objetivo: Longitud {levelConfig.targetLength}</p>
              <p className="text-[#8A95A5] text-xs font-body">{LEVELS.length} niveles · los amarillos se activan cada 3 verdes{highScoreSnake > 0 ? ` · RÉCORD: ${String(highScoreSnake).padStart(6, '0')}` : ''}</p>
            </div>
            <div className="flex gap-4 mb-6 justify-center" role="group" aria-label="Modo de paredes">
              <button type="button" onClick={() => setWallMode('wrap')} aria-pressed={wallMode === 'wrap'} className={`px-4 py-2 font-pixel text-[0.6rem] uppercase border-2 transition-all duration-150 cursor-pointer ${wallMode === 'wrap' ? 'border-[#4CAF50] text-[#4CAF50] bg-[#4CAF50]/10' : 'border-[#2A3645] text-[#8A95A5] hover:border-[#4CAF50]/50'}`}>Wrap</button>
              <button type="button" onClick={() => setWallMode('wall')} aria-pressed={wallMode === 'wall'} className={`px-4 py-2 font-pixel text-[0.6rem] uppercase border-2 transition-all duration-150 cursor-pointer ${wallMode === 'wall' ? 'border-[#FF2E9A] text-[#FF2E9A] bg-[#FF2E9A]/10' : 'border-[#2A3645] text-[#8A95A5] hover:border-[#FF2E9A]/50'}`}>Paredes</button>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <NeonButton variant="green" onClick={handleStartGame} size="large">COMENZAR</NeonButton>
              <NeonButton variant="cyan" onClick={() => setShowTutorial(true)}>CÓMO JUGAR</NeonButton>
              {embedded
                ? <NeonButton variant="yellow" onClick={handleBackToMenu}>VOLVER AL ARTÍCULO</NeonButton>
                : <NeonButton variant="yellow" to="/arcade">VOLVER AL ARCADE</NeonButton>}
            </div>
          </motion.div>
        )}

        {(gameState.status === 'PLAYING' || gameState.status === 'PAUSED' || gameState.status === 'QUESTION') && (
          <motion.div key="playing" className="w-full max-w-[800px] mx-auto flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SnakeHUD gameState={gameState} onPause={handlePause} />
            <div className="relative border-x-2 border-[#1F2833]">
              <GameCanvas gameState={gameState} onDirectionChange={handleDirectionChange} onPause={handlePause} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
              {gameState.status === 'PAUSED' && (
                <div className="absolute inset-0 bg-[#0B0C10]/85 flex flex-col items-center justify-center z-20" role="dialog" aria-label="Juego en pausa">
                  <h2 className="font-pixel text-2xl text-[#4CAF50] mb-6">PAUSA</h2>
                  <div className="flex flex-col gap-3 items-center">
                    <NeonButton variant="green" onClick={handleResume}><Play size={16} className="mr-2" />REANUDAR</NeonButton>
                    <NeonButton variant="cyan" onClick={handleRestart}><RotateCcw size={16} className="mr-2" />REINICIAR</NeonButton>
                    <NeonButton variant="yellow" onClick={handleBackToMenu}><Home size={16} className="mr-2" />SALIR</NeonButton>
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
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Amarillos:</span><span className="text-[#FFE66D] font-pixel text-sm">{gameState.levelYellowCorrect}/{gameState.levelYellowTotal}</span></div>
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Preguntas correctas:</span><span className="text-[#66FCF1] font-pixel text-sm">{gameState.questionsCorrect}/{gameState.questionsTotal}</span></div>
                <div className="border-t border-[#2A3645] pt-3 flex justify-between"><span className="text-[#F5F5F5] font-body font-medium">PUNTUACIÓN:</span><span className="text-[#FFE66D] font-pixel text-base" style={{ textShadow: '0 0 8px rgba(255,230,109,0.5)' }}>{String(gameState.score).padStart(6, '0')}</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center">
              {gameState.level < LEVELS.length
                ? <NeonButton variant="green" onClick={handleNextLevel} size="large">CONTINUAR<ChevronRight size={18} className="ml-2" /></NeonButton>
                : <NeonButton variant="green" onClick={handleRestart} size="large"><RotateCcw size={18} className="mr-2" />JUGAR DE NUEVO</NeonButton>}
              <NeonButton variant="yellow" onClick={handleBackToMenu}><Home size={16} className="mr-2" />VOLVER</NeonButton>
            </div>
          </motion.div>
        )}

        {gameState.status === 'GAME_OVER' && (
          <motion.div key="game-over" className="w-full max-w-md mx-auto text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} role="status" aria-label="Fin de la partida">
            <h2 className="font-pixel text-2xl text-[#FF2E9A] mb-2" style={{ textShadow: '0 0 20px rgba(255,46,154,0.5)' }}>GAME OVER</h2>
            <p className="text-[#8A95A5] font-body text-sm mb-6">La serpiente se ha quedado sin vidas</p>
            <div className="bg-[#1F2833] border border-[#2A3645] p-6 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Nivel:</span><span className="text-[#66FCF1] font-pixel text-sm">{gameState.level}</span></div>
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Longitud máxima:</span><span className="text-[#4CAF50] font-pixel text-sm">{gameState.maxLength}</span></div>
                <div className="flex justify-between"><span className="text-[#8A95A5] text-sm font-body">Conceptos:</span><span className="text-[#FFE66D] font-pixel text-sm">{gameState.tokensCollected}</span></div>
                <div className="border-t border-[#2A3645] pt-3"><div className="flex justify-between items-center"><span className="text-[#F5F5F5] font-body font-medium uppercase tracking-wider text-sm">PUNTUACIÓN FINAL:</span><span className="text-[#FFE66D] font-pixel text-lg" style={{ textShadow: '0 0 12px rgba(255,230,109,0.6)' }}>{String(gameState.score).padStart(6, '0')}</span></div></div>
                {isRecord && <div className="text-center pt-3"><span className="font-pixel text-xs text-[#FFE66D]">¡NUEVO RÉCORD!</span></div>}
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <NeonButton variant="green" onClick={handleRestart} size="large"><RotateCcw size={18} className="mr-2" />REINTENTAR</NeonButton>
              <NeonButton variant="yellow" onClick={handleBackToMenu}><Home size={16} className="mr-2" />{embedded ? 'VOLVER AL ARTÍCULO' : 'MENÚ PRINCIPAL'}</NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0C10]/90" role="dialog" aria-modal="true" aria-label="Cómo jugar">
          <motion.div className="w-full max-w-lg bg-[#1F2833] border-[3px] border-[#66FCF1] p-6 relative max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
            <button onClick={() => setShowTutorial(false)} className="absolute top-3 right-3 text-[#8A95A5] hover:text-[#F5F5F5] transition-colors cursor-pointer" aria-label="Cerrar tutorial"><X size={20} /></button>
            <h2 className="font-pixel text-lg text-[#66FCF1] mb-6 text-center">CÓMO JUGAR</h2>
            <div className="space-y-3 text-[#F5F5F5] text-sm font-body">
              <p>Usa <strong>FLECHAS</strong> o <strong>WASD</strong> para guiar la serpiente.</p>
              <p><span className="text-[#4CAF50]">● Verdes</span> = Conceptos correctos (+10 pts, crecen +1, cargan amarillos)</p>
              <p><span className="text-[#FFE66D]">● Amarillos</span> = Preguntas (crecen +2, activar primero)</p>
              <p><span className="text-[#FF2E9A]">● Rojos</span> = Conceptos erróneos (-30 pts, encogen -2)</p>
              <p className="border-t border-[#2A3645] pt-3"><strong className="text-[#FFE66D]">⚡ Amarillos bloqueados:</strong> Aparecen en el tablero pero no se pueden comer. Cada 3 verdes consumidos, un amarillo se <strong className="text-[#66FCF1]">activa</strong> (brilla con anillo). Una vez activo, cómelo para abrir una pregunta.</p>
              <p><strong className="text-[#FF2E9A]">⚠ Para avanzar de nivel:</strong> Alcanza la longitud objetivo <strong className="text-[#66FCF1]">Y</strong> responder correctamente la <strong>mitad + 1</strong> de las preguntas amarillas del nivel. Si fallas, la serpiente igual crece, pero no cuenta como acierto.</p>
              <p>Tienes <strong>3 vidas</strong> (máx. 5: ganas +1 cada 500 puntos). Cada nivel tiene más amarillos. Cada 3 verdes desbloquea un amarillo.</p>
            </div>
            <div className="mt-6 text-center"><NeonButton variant="green" onClick={() => setShowTutorial(false)}>ENTENDIDO</NeonButton></div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
