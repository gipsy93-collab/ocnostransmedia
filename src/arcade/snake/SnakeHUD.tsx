import { Heart, Pause, Zap, Lock } from 'lucide-react';
import type { GameState } from './types';
import { LEVELS, YELLOW_ACTIVATION_THRESHOLD } from './constants';

interface SnakeHUDProps {
  gameState: GameState;
  onPause: () => void;
}

export default function SnakeHUD({ gameState, onPause }: SnakeHUDProps) {
  const { score, level, lives, combo, snake, wallMode } = gameState;
  const levelConfig = LEVELS[Math.min(level - 1, LEVELS.length - 1)];
  const comboMultiplier = combo <= 1 ? 1 : combo === 2 ? 1.5 : combo === 3 ? 2 : 3;

  return (
    <div
      className="w-full bg-[#0B0C10]/90 border-y-2 border-[#4CAF50] px-3 py-2"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      {/* Desktop: single row / Mobile: two rows */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[800px] mx-auto">
        {/* Left: Score + Length */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-col">
            <span className="font-pixel text-[0.55rem] text-[#8A95A5] leading-tight">SCORE</span>
            <span
              className="font-pixel text-xs md:text-sm text-[#FFE66D] tracking-wider transition-transform duration-100"
              style={{ textShadow: '0 0 8px rgba(255,230,109,0.5)' }}
            >
              {String(Math.max(0, score)).padStart(6, '0')}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-pixel text-[0.55rem] text-[#8A95A5] leading-tight">LONG</span>
            <span className="font-pixel text-xs text-[#4CAF50]">
              {snake.segments.length}/{levelConfig.targetLength}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-pixel text-[0.55rem] text-[#8A95A5] leading-tight">VEL</span>
            <div className="flex gap-0.5 mt-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-3 ${
                    i < levelConfig.speedBarFill ? 'bg-[#66FCF1]' : 'bg-[#2A3645]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Level + Combo + Yellow charge */}
        <div className="flex flex-col items-center">
          <span className="font-display text-[0.65rem] text-[#F5F5F5] uppercase tracking-wider">
            NIVEL {level} — {levelConfig.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {combo > 1 && (
              <div className="flex items-center gap-1">
                <Zap size={10} className="text-[#FFE66D]" />
                <span className="font-pixel text-[0.55rem] text-[#FFE66D]">
                  x{comboMultiplier}
                </span>
              </div>
            )}
            {/* Yellow charge indicator */}
            <div className="flex items-center gap-0.5" title="Come 3 verdes para activar un amarillo">
              <Lock size={8} className="text-[#FFE66D]" />
              {Array.from({ length: YELLOW_ACTIVATION_THRESHOLD }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-3 transition-colors duration-200 ${
                    i < gameState.yellowTokenCharge ? 'bg-[#FFE66D]' : 'bg-[#2A3645]'
                  }`}
                  style={i < gameState.yellowTokenCharge ? { boxShadow: '0 0 4px rgba(255,230,109,0.6)' } : {}}
                />
              ))}
            </div>
            {/* Yellow progress: correct / required */}
            {gameState.levelYellowTotal > 0 && (
              <span className="font-pixel text-[0.5rem] text-[#FFE66D]">
                {gameState.levelYellowCorrect}/{Math.floor(gameState.levelYellowTotal / 2) + 1}
              </span>
            )}
          </div>
        </div>

        {/* Right: Lives + Mode + Pause */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                size={14}
                className={i < lives ? 'text-[#FF2E9A]' : 'text-[#2A3645]'}
                fill={i < lives ? '#FF2E9A' : 'none'}
              />
            ))}
          </div>

          <span className="font-pixel text-[0.5rem] text-[#8A95A5] uppercase">
            {wallMode === 'wrap' ? 'WRAP' : 'WALL'}
          </span>

          <button
            onClick={onPause}
            className="p-1.5 text-[#8A95A5] hover:text-[#66FCF1] transition-colors duration-150"
            aria-label="Pausar"
          >
            <Pause size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
