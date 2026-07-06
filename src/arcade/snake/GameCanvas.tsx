import React, { useRef, useEffect } from 'react';
import type { GameState, Direction } from './types';
import { renderGame } from './renderer';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

interface GameCanvasProps {
  gameState: GameState;
  onDirectionChange: (dir: Direction) => void;
  onPause: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export default function GameCanvas({
  gameState,
  onTouchStart,
  onTouchEnd,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const render = (timestamp: number) => {
      renderGame(ctx, gameState, timestamp);
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [gameState]);

  // Resize handler - set internal canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }, []);

  return (
    <div
      className="relative w-full max-w-[800px] mx-auto select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Aspect ratio wrapper */}
      <div
        className="relative w-full"
        style={{ paddingBottom: `${(CANVAS_HEIGHT / CANVAS_WIDTH) * 100}%` }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{
            imageRendering: 'pixelated',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={(e) => e.preventDefault()}
          aria-label="Serpiente del Saber - Canvas del juego"
        />
      </div>
    </div>
  );
}
