import type { Question } from '../data/questions';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'MENU' | 'PLAYING' | 'QUESTION' | 'LEVEL_COMPLETE' | 'GAME_OVER' | 'PAUSED';

export type TokenType = 'GREEN' | 'YELLOW' | 'RED';

export type WallMode = 'wrap' | 'wall';

export interface Position {
  x: number;
  y: number;
}

export interface Token {
  pos: Position;
  type: TokenType;
  spawnProgress: number; // 0 to 1, for pop-in animation
  label?: string;
  active?: boolean; // yellow tokens start inactive and activate after 3 green tokens eaten
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface SnakeSegment {
  pos: Position;
  prevPos: Position; // for smooth interpolation
}

export interface SnakeState {
  segments: SnakeSegment[];
  direction: Direction;
  nextDirection: Direction;
  isAlive: boolean;
  invincibleTimer: number; // ms remaining of invincibility after hit
}

export interface LevelConfig {
  level: number;
  name: string;
  theme: string;
  tickSpeed: number; // ms per tick
  wallMode: WallMode;
  targetLength: number;
  greenTokenWeight: number;
  yellowTokenWeight: number;
  redTokenWeight: number;
  maxTokens: number; // max number of active (eatable) tokens on the board
  yellowCount: number; // number of yellow tokens always present (inactive until charged)
  questionDifficulties: ('easy' | 'normal' | 'hard')[];
  speedBarFill: number; // 1-5
}

export interface GameState {
  snake: SnakeState;
  tokens: Token[];
  particles: Particle[];
  score: number;
  level: number;
  lives: number;
  combo: number; // consecutive correct answers
  comboMultiplier: number;
  wallMode: WallMode;
  status: GameStatus;
  currentQuestion: Question | null;
  questionTimer: number;
  tokensCollected: number;
  yellowTokenCharge: number; // 0-3, each green eaten increments; at 3 activates a yellow
  yellowTokensCollected: number;
  levelYellowTotal: number; // yellow tokens collected this level (for pass condition)
  levelYellowCorrect: number; // correct yellow answers this level
  questionsCorrect: number;
  questionsTotal: number;
  maxLength: number;
  survivalTime: number; // seconds survived (for bonus)
  lastTickTime: number;
  isSpeedBoost: boolean;
  speedBoostTimer: number;
  screenShake: number; // ms remaining of screen shake
  flashColor: string | null; // screen flash color
  flashTimer: number;
}

export interface HUDInfo {
  score: number;
  level: number;
  lives: number;
  combo: number;
  comboMultiplier: number;
  snakeLength: number;
  targetLength: number;
  speedBarFill: number;
  levelName: string;
  wallMode: WallMode;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}
