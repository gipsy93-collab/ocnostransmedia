import type { LevelConfig } from './types';

// Grid configuration
export const GRID_COLS = 25;
export const GRID_ROWS = 20;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 640;
export const CELL_SIZE = CANVAS_WIDTH / GRID_COLS; // 32px

// Colors
export const COLORS = {
  bg: '#0B0C10',
  gridLine: '#1F2833',
  gridChecker: 'rgba(255,255,255,0.015)',
  snakeHead: '#66FCF1',
  snakeHeadGlow: 'rgba(102,252,241,0.4)',
  snakeBody: '#4CAF50',
  snakeBodyDark: '#3d8b40',
  snakeTail: '#2e6b30',
  snakeEye: '#0B0C10',
  greenToken: '#4CAF50',
  greenTokenGlow: 'rgba(76,175,80,0.5)',
  yellowToken: '#FFE66D',
  yellowTokenGlow: 'rgba(255,230,109,0.5)',
  redToken: '#FF2E9A',
  redTokenGlow: 'rgba(255,46,154,0.5)',
  wall: '#FF2E9A',
  wallGlow: 'rgba(255,46,154,0.3)',
  textPrimary: '#F5F5F5',
  textSecondary: '#8A95A5',
  accentCyan: '#66FCF1',
  accentYellow: '#FFE66D',
  accentMagenta: '#FF2E9A',
  accentGreen: '#4CAF50',
};

// Game timing
export const SPAWN_ANIMATION_DURATION = 200; // ms for token pop-in
export const INVINCIBILITY_DURATION = 3000; // ms after losing a life
export const SPEED_PENALTY_DURATION = 3000; // ms of faster speed after wrong answer
export const SPEED_BOOST_DURATION = 5000; // ms of 2x score multiplier
export const QUESTION_TIME_LIMIT = 15; // seconds
export const TOKEN_SPAWN_DELAY = 1500; // ms between token spawns
export const TRAIL_LENGTH = 5; // number of fading trail positions behind head
export const MAX_PARTICLES = 50;

// Level configurations
export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: 'Conceptos Básicos',
    theme: 'Metodología y conceptos clave',
    tickSpeed: 150,
    wallMode: 'wrap',
    targetLength: 15,
    greenTokenWeight: 100,
    yellowTokenWeight: 0,
    redTokenWeight: 0,
    maxTokens: 3,
    yellowCount: 2,
    questionDifficulties: ['easy'],
    speedBarFill: 1,
  },
  {
    level: 2,
    name: 'Naturaleza y Memoria',
    theme: 'Temas centrales de Tomoji',
    tickSpeed: 130,
    wallMode: 'wrap',
    targetLength: 25,
    greenTokenWeight: 70,
    yellowTokenWeight: 30,
    redTokenWeight: 0,
    maxTokens: 3,
    yellowCount: 3,
    questionDifficulties: ['easy', 'normal'],
    speedBarFill: 2,
  },
  {
    level: 3,
    name: 'Género e Interculturalidad',
    theme: 'Roles y diversidad cultural',
    tickSpeed: 110,
    wallMode: 'wrap',
    targetLength: 35,
    greenTokenWeight: 60,
    yellowTokenWeight: 25,
    redTokenWeight: 15,
    maxTokens: 4,
    yellowCount: 4,
    questionDifficulties: ['normal'],
    speedBarFill: 3,
  },
  {
    level: 4,
    name: 'Filosofía Oriental',
    theme: 'Intertextos y géneros',
    tickSpeed: 100,
    wallMode: 'wall',
    targetLength: 45,
    greenTokenWeight: 50,
    yellowTokenWeight: 30,
    redTokenWeight: 20,
    maxTokens: 4,
    yellowCount: 5,
    questionDifficulties: ['normal', 'hard'],
    speedBarFill: 4,
  },
  {
    level: 5,
    name: 'Maestría Didáctica',
    theme: 'Síntesis total del artículo',
    tickSpeed: 85,
    wallMode: 'wall',
    targetLength: 60,
    greenTokenWeight: 45,
    yellowTokenWeight: 35,
    redTokenWeight: 20,
    maxTokens: 5,
    yellowCount: 6,
    questionDifficulties: ['hard'],
    speedBarFill: 5,
  },
  {
    level: 6,
    name: 'Investigación Aplicada',
    theme: 'Estado del arte y metodologías',
    tickSpeed: 80,
    wallMode: 'wall',
    targetLength: 75,
    greenTokenWeight: 40,
    yellowTokenWeight: 30,
    redTokenWeight: 30,
    maxTokens: 5,
    yellowCount: 7,
    questionDifficulties: ['hard'],
    speedBarFill: 5,
  },
  {
    level: 7,
    name: 'Seminario Avanzado',
    theme: 'Discusiones teóricas contemporáneas',
    tickSpeed: 75,
    wallMode: 'wall',
    targetLength: 90,
    greenTokenWeight: 35,
    yellowTokenWeight: 30,
    redTokenWeight: 35,
    maxTokens: 6,
    yellowCount: 8,
    questionDifficulties: ['hard'],
    speedBarFill: 5,
  },
  {
    level: 8,
    name: 'Cátedra Magistral',
    theme: 'Síntesis crítica del campo',
    tickSpeed: 70,
    wallMode: 'wall',
    targetLength: 110,
    greenTokenWeight: 30,
    yellowTokenWeight: 30,
    redTokenWeight: 40,
    maxTokens: 6,
    yellowCount: 9,
    questionDifficulties: ['hard'],
    speedBarFill: 5,
  },
];

// Combo multipliers
export const COMBO_MULTIPLIERS: Record<number, number> = {
  0: 1,
  1: 1,
  2: 1.5,
  3: 2,
  4: 3,
};

export function getComboMultiplier(combo: number): number {
  if (combo <= 1) return 1;
  if (combo === 2) return 1.5;
  if (combo === 3) return 2;
  return 3;
}

// Scoring
export const POINTS = {
  greenToken: 10,
  yellowCorrect: 50,
  yellowWrong: -20,
  redToken: -30,
  levelComplete: (level: number) => 100 * level,
  bonusLife: 500, // every 500 points = bonus life
};

// Labels for green tokens (shortened for canvas legibility)
export const GREEN_TOKEN_LABELS = [
  'INTER', 'C LECT', 'DIDACT', 'TEMA', 'LITER',
  'DIVERS', 'MANGA', 'TOMOJI', 'TANIG', 'NARRAT',
  'SLICE', 'COMP L',
];

// Labels for red tokens (shortened)
export const RED_TOKEN_LABELS = [
  'MANGA=OK', 'TXT=OK', 'SIN-ADAP', 'DECODIF', 'ANIME', 'SIN-MANGA',
];

export const YELLOW_ACTIVATION_THRESHOLD = 3;

// Questions used per level (tracked to avoid repeats)
export const QUESTIONS_PER_LEVEL = 3; // max yellow questions per level
