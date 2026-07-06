import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2, Heart } from 'lucide-react';
import NeonButton from '../components/NeonButton';
import { useGameStore } from '../store/gameStore';
import type { Cell, PlayerPos, Enemy } from './renderer';
import { drawGame } from './renderer';
import QuestionModal from '../components/QuestionModal';
import { questions } from '../data/questions';
import type { Question } from '../data/questions';

const ROWS = 7;
const TOTAL_CELLS = 28; // 1+2+3+4+5+6+7

interface GameState {
  cells: Cell[];
  playerPos: PlayerPos;
  enemies: Enemy[];
  score: number;
  lives: number;
  level: number;
  phase: 'playing' | 'won' | 'gameOver' | 'question';
  enemyMoveTimer: number;
  currentQuestion: Question | null;
  isJumping: boolean;
  quizPassed: boolean;
}

function buildCells(level: number): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= r; c++) {
      cells.push({ row: r, col: c, completed: false, isBonus: false });
    }
  }
  
  // Randomly assign bonus cubes based on level, excluding the start pos
  const available = cells.filter(c => !(c.row === 0 && c.col === 0));
  const bonusCount = Math.min(3, level);
  for (let i = 0; i < bonusCount; i++) {
    const idx = Math.floor(Math.random() * available.length);
    available[idx].isBonus = true;
    available.splice(idx, 1);
  }
  
  return cells;
}

const LEVEL_CONFIGS = [
  { enemyCount: 2, enemySpeed: 850, hasChaser: false, name: 'Conceptos Básicos' },
  { enemyCount: 3, enemySpeed: 750, hasChaser: true, name: 'Temas Centrales' },
  { enemyCount: 3, enemySpeed: 650, hasChaser: true, name: 'Análisis Formal' },
  { enemyCount: 4, enemySpeed: 550, hasChaser: true, name: 'Interculturalidad' },
  { enemyCount: 5, enemySpeed: 450, hasChaser: true, name: 'Síntesis Crítica' },
];

function getLevelConfig(level: number) {
  return LEVEL_CONFIGS[Math.min(level - 1, LEVEL_CONFIGS.length - 1)];
}

function spawnEnemies(count: number): Enemy[] {
  return []; // Enemies spawn dynamically from the top now
}

function getFallerMoves(row: number, col: number): PlayerPos[] {
  return [
    { row: row + 1, col: col },
    { row: row + 1, col: col + 1 }
  ];
}

function getChaserMoves(er: number, ec: number, pr: number, pc: number): PlayerPos | null {
  const moves = getValidMoves(er, ec);
  if (moves.length === 0) return null;
  moves.sort((a, b) => {
    const distA = Math.abs(a.row - pr) + Math.abs(a.col - pc);
    const distB = Math.abs(b.row - pr) + Math.abs(b.col - pc);
    return distA - distB;
  });
  const bestDist = Math.abs(moves[0].row - pr) + Math.abs(moves[0].col - pc);
  const bestMoves = moves.filter(m => (Math.abs(m.row - pr) + Math.abs(m.col - pc)) === bestDist);
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function getValidMoves(row: number, col: number): PlayerPos[] {
  const moves: PlayerPos[] = [];
  // UL: up-left (r-1, c-1)
  if (row > 0 && col > 0) moves.push({ row: row - 1, col: col - 1 });
  // UR: up-right (r-1, c)
  if (row > 0) moves.push({ row: row - 1, col });
  // DL: down-left (r+1, c)
  if (row < ROWS - 1) moves.push({ row: row + 1, col });
  // DR: down-right (r+1, c+1)
  if (row < ROWS - 1) moves.push({ row: row + 1, col: col + 1 });
  return moves;
}

export default function PiramidePage() {
  const [gs, setGs] = useState<GameState>(() => ({
    cells: buildCells(1),
    playerPos: { row: 0, col: 0 },
    enemies: spawnEnemies(getLevelConfig(1).enemyCount),
    score: 0,
    lives: 3,
    level: 1,
    phase: 'playing',
    enemyMoveTimer: Date.now(),
    currentQuestion: null,
    isJumping: false,
    quizPassed: false,
  }));

  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const store = useGameStore();

  // Refs for animation loop
  const gsRef = useRef(gs);
  gsRef.current = gs;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = gsRef.current;
    const config = getLevelConfig(state.level);
    drawGame(ctx, canvas, state.cells, state.playerPos, state.enemies, state.score, state.level, state.lives, config.name, performance.now());
  }, []);

  useEffect(() => {
    let animId: number;
    const loop = () => { draw(); animId = requestAnimationFrame(loop); };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  // Enemy movement timer
  useEffect(() => {
    if (gs.phase !== 'playing') return;
    const config = getLevelConfig(gs.level);
    const interval = setInterval(() => {
      setGs((prev) => {
        if (prev.phase !== 'playing') return prev;
        
        const newEnemies: Enemy[] = [];
        let newLives = prev.lives;
        let newPhase = prev.phase;
        let newPos = prev.playerPos;
        let hit = false;

        for (const e of prev.enemies) {
          let nextR = e.row;
          let nextC = e.col;
          
          if (e.type === 'chaser') {
            const move = getChaserMoves(e.row, e.col, prev.playerPos.row, prev.playerPos.col);
            if (move) { nextR = move.row; nextC = move.col; }
          } else {
            // faller
            if (e.row >= ROWS - 1) {
               continue; // falls off the bottom
            }
            const moves = getFallerMoves(e.row, e.col);
            const move = moves[Math.floor(Math.random() * moves.length)];
            nextR = move.row; nextC = move.col;
          }

          if (nextR === prev.playerPos.row && nextC === prev.playerPos.col) {
            hit = true;
          }
          newEnemies.push({ ...e, row: nextR, col: nextC });
        }

        // Spawn new enemy at the top if there's room
        if (newEnemies.length < config.enemyCount && Math.random() < 0.4) {
          // Don't spawn exactly where the player is to avoid cheap deaths
          if (prev.playerPos.row !== 0 || prev.playerPos.col !== 0) {
            const isChaser = config.hasChaser && !newEnemies.some(en => en.type === 'chaser');
            newEnemies.push({ row: 0, col: 0, type: isChaser ? 'chaser' : 'faller' });
          }
        }

        if (hit) {
          newLives -= 1;
          if (newLives <= 0) {
            newPhase = 'gameOver';
            store.setHighScore('qbert', prev.score);
          }
          newPos = { row: 0, col: 0 };
          newEnemies.length = 0; // Clear enemies on death to give a break
        }

        return {
          ...prev,
          enemies: newEnemies,
          lives: newLives,
          phase: newPhase,
          playerPos: newPos,
        };
      });
    }, config.enemySpeed);
    return () => clearInterval(interval);
  }, [gs.phase, gs.level, store]);

  const handleQuestionAnswered = useCallback((correct: boolean) => {
    setGs((prev) => {
      let newScore = prev.score;
      let newLives = prev.lives;
      let newPhase: GameState['phase'] = 'playing';
      let newPos = prev.playerPos;
      let newQuizPassed = prev.quizPassed;
      let newCells = prev.cells;
      
      if (correct) {
        newScore += 500;
        newQuizPassed = true;
        
        // Mark bonus cell as completed
        newCells = prev.cells.map(c => {
          if (c.row === prev.playerPos.row && c.col === prev.playerPos.col) {
            return { ...c, completed: true };
          }
          return c;
        });
        
        // Win check: All Cubes completed AND Quiz passed
        const allCubesDone = newCells.every(c => c.completed);
        if (allCubesDone) {
          newPhase = 'won';
          newScore += 1000 * prev.level;
          if (prev.level >= 5) store.setHighScore('qbert', newScore);
        }
      } else {
        // Penalty: lose a randomly completed square
        const completedNormalCells = prev.cells.filter(c => c.completed && !c.isBonus);
        if (completedNormalCells.length > 0) {
          const target = completedNormalCells[Math.floor(Math.random() * completedNormalCells.length)];
          newCells = prev.cells.map(c => 
            (c.row === target.row && c.col === target.col) ? { ...c, completed: false } : c
          );
        }

        // Teleport to start on wrong answer, no life lost
        newPos = { row: 0, col: 0 };
        newPhase = 'playing';
      }
      
      return {
        ...prev,
        cells: newCells,
        score: newScore,
        lives: newLives,
        phase: newPhase,
        playerPos: newPos,
        quizPassed: newQuizPassed,
        currentQuestion: null,
      };
    });
  }, [store]);

  const movePlayer = useCallback((nr: number, nc: number) => {
    setGs((prev) => {
      if (prev.phase !== 'playing' || prev.isJumping) return prev;
      
      // If player moves off the pyramid -> Death!
      if (nr < 0 || nr >= ROWS || nc < 0 || nc > nr) {
        let newLives = prev.lives - 1;
        let newPhase = prev.phase;
        if (newLives <= 0) {
          newPhase = 'gameOver';
          store.setHighScore('qbert', prev.score);
        }
        return {
          ...prev,
          playerPos: { row: 0, col: 0 },
          lives: newLives,
          phase: newPhase,
          enemies: [], // clear board to give player a break
        };
      }

      // Check if this is a valid diagonal move
      const dr = nr - prev.playerPos.row;
      const dc = nc - prev.playerPos.col;
      const validMoves: Record<string, [number, number]> = {
        'ul': [-1, -1], 'ur': [-1, 0], 'dl': [1, 0], 'dr': [1, 1],
      };
      const moveKey = Object.entries(validMoves).find(([, d]) => d[0] === dr && d[1] === dc);
      if (!moveKey) return prev;

      // Update cell (only complete normal cells, bonus cells complete on correct quiz answer)
      const newCells = prev.cells.map((c) =>
        c.row === nr && c.col === nc && !c.completed && !c.isBonus
          ? { ...c, completed: true }
          : c,
      );
      const cellWasChanged = newCells.some((c) => c.row === nr && c.col === nc && c.completed);

      // Check collision with enemies at new position
      const hit = prev.enemies.some((en) => en.row === nr && en.col === nc);
      let newLives = prev.lives;
      let newPhase = prev.phase;
      if (hit) {
        newLives -= 1;
        if (newLives <= 0) {
          newPhase = 'gameOver';
          store.setHighScore('qbert', prev.score);
        }
        return {
          ...prev,
          cells: newCells,
          playerPos: { row: 0, col: 0 },
          lives: newLives,
          phase: newPhase,
          enemies: [], // clear enemies on death
        };
      }

      const bonusPoints = cellWasChanged ? 25 : 0;
      const newScore = prev.score + bonusPoints;

      // Check if landed on a new bonus cell to trigger a question
      const landedOnBonus = prev.cells.some(c => c.row === nr && c.col === nc && c.isBonus && !c.completed);
      if (landedOnBonus) {
        const q = questions[Math.floor(Math.random() * questions.length)];
        return {
          ...prev,
          cells: newCells,
          playerPos: { row: nr, col: nc },
          score: newScore,
          phase: 'question',
          currentQuestion: q,
        };
      }

      // Check level complete (if player just completed the last normal cube)
      // Must also check if quiz was passed!
      const allCompleted = newCells.every((c) => c.completed);
      if (allCompleted && prev.quizPassed && newPhase === 'playing') {
        const levelBonus = 1000 * prev.level;
        const finalScore = newScore + levelBonus;
        if (prev.level >= 5) {
          store.setHighScore('qbert', finalScore);
        }
        return {
          ...prev,
          cells: newCells,
          playerPos: { row: nr, col: nc },
          score: finalScore,
          phase: 'won',
          isJumping: true,
        };
      }
      
      return {
        ...prev,
        cells: newCells,
        playerPos: { row: nr, col: nc },
        score: newScore,
        isJumping: true,
      };
    });

    // Reset jumping state after a short delay to simulate "weight"
    setTimeout(() => {
      setGs(prev => ({ ...prev, isJumping: false }));
    }, 280);
  }, [store]);

  // Keyboard handler
  const movePlayerRef = useRef(movePlayer);
  movePlayerRef.current = movePlayer;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const state = gsRef.current;
      let nr = state.playerPos.row;
      let nc = state.playerPos.col;
      const key = e.key.toLowerCase();
      // ↑=UL, ↓=DR, ←=DL, →=UR
      // W = UL, S = DR, A = DL, D = UR
      if (key === 'arrowup' || key === 'w') { nr -= 1; nc -= 1; }  // UL
      else if (key === 'arrowright' || key === 'd') { nr -= 1; }    // UR
      else if (key === 'arrowleft' || key === 'a') { nr += 1; }     // DL
      else if (key === 'arrowdown' || key === 's') { nr += 1; nc += 1; } // DR
      movePlayerRef.current(nr, nc);
    };
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, []);

  const handleNextLevel = useCallback(() => {
    const nextLvl = gs.level + 1;
    if (nextLvl > 5) return;
    const config = getLevelConfig(nextLvl);
    setGs({
      cells: buildCells(nextLvl),
      playerPos: { row: 0, col: 0 },
      enemies: spawnEnemies(config.enemyCount),
      score: gs.score,
      lives: gs.lives,
      level: nextLvl,
      phase: 'playing',
      enemyMoveTimer: Date.now(),
      currentQuestion: null,
      isJumping: false,
      quizPassed: false,
    });
  }, [gs.level, gs.lives, gs.score]);

  const handleRestart = useCallback(() => {
    setGs({
      cells: buildCells(1),
      playerPos: { row: 0, col: 0 },
      enemies: spawnEnemies(getLevelConfig(1).enemyCount),
      score: 0,
      lives: 3,
      level: 1,
      phase: 'playing',
      enemyMoveTimer: Date.now(),
      currentQuestion: null,
      isJumping: false,
      quizPassed: false,
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      gameRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const completedCount = gs.cells.filter((c) => c.completed).length;
  const config = getLevelConfig(gs.level);

  return (
    <>
      <div
        ref={gameRef}
        className={`flex flex-col items-center justify-center overflow-hidden bg-[#000] touch-none ${
          isFullscreen ? 'fixed inset-0 z-[9999]' : 'relative w-full max-w-[1200px] aspect-[1200/1100] mx-auto border-4 border-[#1F2833] rounded-lg shadow-2xl'
        }`}
      >
        {/* CRT Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] animate-pulse bg-white/5" />
        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,118,0.03))] bg-[length:100%_4px,3px_100%]" />
        
        {/* Canvas Wrapper for scaling */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            className={`${isFullscreen ? 'h-full w-auto' : 'w-full h-auto'} cursor-pointer object-contain`}
            style={{ imageRendering: 'pixelated' }}
            aria-label="Pirámide Q*bert Tomoji"
            onClick={() => {
              const next = gs.cells.find((c) => !c.completed && !c.isBonus);
              if (next) movePlayer(next.row, next.col);
            }}
          />
          
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 bg-[#1F2833]/80 border border-[#2A3645] rounded text-[#8A95A5] hover:text-[#66FCF1] hover:border-[#66FCF1] transition-colors z-30"
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        <QuestionModal
          question={gs.currentQuestion}
          onAnswer={handleQuestionAnswered}
          timeLimit={15}
        />

        {/* Overlays inside the fullscreen container */}
        <AnimatePresence>
          {gs.phase === 'gameOver' && (
            <motion.div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-full max-w-md bg-[#1F2833] border-[3px] border-[#FF2E9A] p-8 text-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <h2 className="font-pixel text-lg text-[#FF2E9A] mb-2" style={{ textShadow: '0 0 15px #FF2E9A' }}>GAME OVER</h2>
                <p className="font-pixel text-base text-[#FFE66D] mb-4" style={{ textShadow: '0 0 10px #FFE66D' }}>{String(gs.score).padStart(6, '0')}</p>
                <p className="text-[#8A95A5] text-xs font-body mb-4">Nivel {gs.level} · {completedCount}/{TOTAL_CELLS} cubos</p>
                <div className="flex flex-col gap-3 items-center">
                  <NeonButton variant="green" onClick={handleRestart} size="large">REINTENTAR</NeonButton>
                </div>
              </motion.div>
            </motion.div>
          )}

          {gs.phase === 'won' && (
            <motion.div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-full max-w-md bg-[#1F2833] border-[3px] border-[#66FCF1] p-8 text-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <h2 className="font-pixel text-lg text-[#66FCF1] mb-2" style={{ textShadow: '0 0 15px #66FCF1' }}>
                  {gs.level >= 5 ? '¡PIRÁMIDE COMPLETADA!' : `¡NIVEL ${gs.level} SUPERADO!`}
                </h2>
                <p className="font-pixel text-base text-[#FFE66D] mb-4" style={{ textShadow: '0 0 10px #FFE66D' }}>{String(gs.score).padStart(6, '0')}</p>
                <p className="text-[#4CAF50] text-xs font-body mb-4">Bonificación: +{1000 * gs.level} pts</p>
                <div className="flex flex-col gap-3 items-center">
                  {gs.level < 5 ? (
                    <NeonButton variant="green" onClick={handleNextLevel} size="large">SIGUIENTE NIVEL</NeonButton>
                  ) : (
                    <NeonButton variant="green" onClick={handleRestart} size="large">JUGAR DE NUEVO</NeonButton>
                  )}
                  <NeonButton variant="yellow" onClick={handleRestart}>REINICIAR</NeonButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls help */}
        <div className="mt-3 flex flex-col items-center gap-1 z-20">
          <p className="text-[#8A95A5] text-[10px] font-body">
            ↑=UL · →=UR · ←=DL · ↓=DR (WASD también)
          </p>
          {/* D-pad */}
          <div className="grid grid-cols-3 gap-1 md:hidden" aria-label="Controles táctiles">
            <div />
            <button onClick={() => movePlayer(gs.playerPos.row - 1, gs.playerPos.col - 1)} className="w-12 h-12 flex items-center justify-center bg-[#1F2833] border border-[#66FCF1] text-[#66FCF1] font-pixel text-lg active:bg-[#66FCF1]/20 rounded" aria-label="Arriba-izquierda">↖</button>
            <div />
            <button onClick={() => movePlayer(gs.playerPos.row + 1, gs.playerPos.col)} className="w-12 h-12 flex items-center justify-center bg-[#1F2833] border border-[#66FCF1] text-[#66FCF1] font-pixel text-lg active:bg-[#66FCF1]/20 rounded" aria-label="Abajo-izquierda">↙</button>
            <div className="w-12 h-12 bg-[#0B0C10] border border-[#2A3645] rounded" />
            <button onClick={() => movePlayer(gs.playerPos.row - 1, gs.playerPos.col)} className="w-12 h-12 flex items-center justify-center bg-[#1F2833] border border-[#66FCF1] text-[#66FCF1] font-pixel text-lg active:bg-[#66FCF1]/20 rounded" aria-label="Arriba-derecha">↗</button>
            <div />
            <button onClick={() => movePlayer(gs.playerPos.row + 1, gs.playerPos.col + 1)} className="w-12 h-12 flex items-center justify-center bg-[#1F2833] border border-[#66FCF1] text-[#66FCF1] font-pixel text-lg active:bg-[#66FCF1]/20 rounded" aria-label="Abajo-derecha">↘</button>
            <div />
          </div>
        </div>
      </div>
    </>
  );
}
