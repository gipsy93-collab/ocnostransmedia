import React, { useRef, useCallback, useEffect } from 'react';
import type { GameState, Direction } from './types';
import { gameTick, spawnMissingTokens } from './logic';
import { LEVELS } from './constants';

interface GameLoopCallbacks {
  onStateChange: (state: GameState) => void;
  onQuestionTrigger: (question: import('../data/questions').Question) => void;
}

export function useGameLoop() {
  const stateRef = useRef<GameState | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const callbacksRef = useRef<GameLoopCallbacks | null>(null);
  const tokenSpawnTimerRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  const startLoop = useCallback(
    (initialState: GameState, callbacks: GameLoopCallbacks) => {
      stateRef.current = initialState;
      callbacksRef.current = callbacks;
      lastTimeRef.current = performance.now();
      accumulatorRef.current = 0;
      tokenSpawnTimerRef.current = 0;
      isRunningRef.current = true;

      const loop = (now: number) => {
        if (!isRunningRef.current || !stateRef.current) return;

        const deltaTime = now - lastTimeRef.current;
        lastTimeRef.current = now;

        // Prevent huge time steps (tab switch, etc.)
        const clampedDelta = Math.min(deltaTime, 100);

        if (stateRef.current.status === 'PLAYING') {
          const levelConfig = LEVELS[stateRef.current.level - 1];
          const tickSpeed = stateRef.current.isSpeedBoost
            ? levelConfig.tickSpeed * 0.7
            : levelConfig.tickSpeed;

          accumulatorRef.current += clampedDelta;

          // Run game ticks at the configured speed (máx. 5 ticks/frame anti death-spiral)
          let ticks = 0;
          while (accumulatorRef.current >= tickSpeed && ticks < 5) {
            accumulatorRef.current -= tickSpeed;
            ticks++;
            const result = gameTick(stateRef.current, tickSpeed);
            stateRef.current = result.newState;

            if (result.event) {
              switch (result.event) {
                case 'yellow-token':
                  if (stateRef.current.currentQuestion) {
                    callbacksRef.current?.onQuestionTrigger(stateRef.current.currentQuestion);
                  }
                  break;
                case 'level-complete':
                  callbacksRef.current?.onStateChange(stateRef.current);
                  break;
                case 'game-over':
                  callbacksRef.current?.onStateChange(stateRef.current);
                  // Detener el loop: no hay más ticks que procesar
                  isRunningRef.current = false;
                  return;
              }
            }
          }

          // Token spawning
          tokenSpawnTimerRef.current += clampedDelta;
          if (tokenSpawnTimerRef.current >= 1500) {
            tokenSpawnTimerRef.current = 0;
            stateRef.current = spawnMissingTokens(stateRef.current);
          }
        }

        // Always update particles (even when paused/question)
        if (stateRef.current.particles.length > 0 && stateRef.current.status !== 'PLAYING') {
          stateRef.current = {
            ...stateRef.current,
            particles: stateRef.current.particles
              .map((p) => ({
                ...p,
                life: p.life - clampedDelta / 1000,
              }))
              .filter((p) => p.life > 0),
          };
        }

        callbacksRef.current?.onStateChange(stateRef.current);
        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);
    },
    [],
  );

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  const updateState = useCallback((newState: GameState) => {
    stateRef.current = newState;
  }, []);

  const getState = useCallback(() => {
    return stateRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, [stopLoop]);

  return {
    startLoop,
    stopLoop,
    updateState,
    getState,
  };
}

// ─── Input Handling ───

export function useInputHandler(
  onDirectionChange: (dir: Direction) => void,
  onPause: () => void,
  isGameActive?: () => boolean,
) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  // Use refs to avoid stale closures
  const onDirectionChangeRef = useRef(onDirectionChange);
  const onPauseRef = useRef(onPause);
  const isGameActiveRef = useRef(isGameActive);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onDirectionChangeRef.current = onDirectionChange;
    onPauseRef.current = onPause;
    isGameActiveRef.current = isGameActive;
  }, [onDirectionChange, onPause, isGameActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // No capturar teclas mientras el usuario escribe (chat IA, campos, contenido editable)
      const el = e.target as HTMLElement | null;
      if (
        el && (
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.isContentEditable
        )
      ) {
        return;
      }

      // Si el juego no está en PLAYING/PAUSED (p. ej. modal de pregunta abierto),
      // no consumir teclas: el modal necesita A-D y Escape debe poder cerrarlo/ignorarse
      if (isGameActiveRef.current && !isGameActiveRef.current()) return;

      // Prevent default for game keys to avoid page scrolling
      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'Escape'];
      if (gameKeys.includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onDirectionChangeRef.current('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onDirectionChangeRef.current('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onDirectionChangeRef.current('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onDirectionChangeRef.current('RIGHT');
          break;
        case ' ':
        case 'Escape':
          onPauseRef.current();
          break;
      }
    };

    // Use capture phase to ensure we get the event first
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []); // Empty deps - effect only runs once, uses refs for latest callbacks

  // Touch / Swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;

      // Minimum 30px distance, max 200ms for swipe
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30 || dt > 200) {
        touchStartRef.current = null;
        return;
      }

      // Determine dominant direction
      if (Math.abs(dx) > Math.abs(dy)) {
        onDirectionChangeRef.current(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onDirectionChangeRef.current(dy > 0 ? 'DOWN' : 'UP');
      }

      touchStartRef.current = null;
    },
    [],
  );

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}
