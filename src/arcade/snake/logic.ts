import type {
  Position,
  Direction,
  Token,
  TokenType,
  SnakeState,
  GameState,
  Particle,
  WallMode,
  LevelConfig,
} from './types';
import {
  GRID_COLS,
  GRID_ROWS,
  LEVELS,
  GREEN_TOKEN_LABELS,
  RED_TOKEN_LABELS,
  POINTS,
  SPAWN_ANIMATION_DURATION,
  getComboMultiplier,
  YELLOW_ACTIVATION_THRESHOLD,
  QUESTIONS_PER_LEVEL,
} from './constants';
import { questions } from '../data/questions';
import type { Question } from '../data/questions';

// ─── Direction Helpers ───

export const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export function isOpposite(dir1: Direction, dir2: Direction): boolean {
  return OPPOSITE[dir1] === dir2;
}

// ─── Position Helpers ───

export function posEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function clampGrid(pos: Position, wallMode: WallMode): Position | null {
  if (wallMode === 'wrap') {
    return {
      x: ((pos.x % GRID_COLS) + GRID_COLS) % GRID_COLS,
      y: ((pos.y % GRID_ROWS) + GRID_ROWS) % GRID_ROWS,
    };
  } else {
    if (pos.x < 0 || pos.x >= GRID_COLS || pos.y < 0 || pos.y >= GRID_ROWS) {
      return null; // hit wall
    }
    return pos;
  }
}

export function getRandomEmptyCell(
  snakeSegments: Position[],
  tokens: Token[],
): Position {
  const occupied = new Set<string>();
  for (const s of snakeSegments) {
    occupied.add(`${s.x},${s.y}`);
  }
  for (const t of tokens) {
    occupied.add(`${t.pos.x},${t.pos.y}`);
  }

  const emptyCells: Position[] = [];
  for (let x = 0; x < GRID_COLS; x++) {
    for (let y = 0; y < GRID_ROWS; y++) {
      if (!occupied.has(`${x},${y}`)) {
        emptyCells.push({ x, y });
      }
    }
  }

  if (emptyCells.length === 0) {
    return { x: 0, y: 0 };
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// ─── Snake Factory ───

export function createSnake(): SnakeState {
  const centerX = Math.floor(GRID_COLS / 2);
  const centerY = Math.floor(GRID_ROWS / 2);
  return {
    segments: [
      { pos: { x: centerX, y: centerY }, prevPos: { x: centerX, y: centerY } },
      { pos: { x: centerX - 1, y: centerY }, prevPos: { x: centerX - 1, y: centerY } },
      { pos: { x: centerX - 2, y: centerY }, prevPos: { x: centerX - 2, y: centerY } },
    ],
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    isAlive: true,
    invincibleTimer: 0,
  };
}

// ─── Token Factory ───

export function spawnToken(
  snakeSegments: Position[],
  tokens: Token[],
  levelConfig: LevelConfig,
  forceType?: TokenType,
): Token {
  const pos = getRandomEmptyCell(snakeSegments, tokens);

  let type: TokenType;
  if (forceType) {
    type = forceType;
  } else {
    const roll = Math.random() * 100;
    if (roll < levelConfig.greenTokenWeight) {
      type = 'GREEN';
    } else if (roll < levelConfig.greenTokenWeight + levelConfig.yellowTokenWeight) {
      type = 'YELLOW';
    } else {
      type = 'RED';
    }
  }

  const label =
    type === 'GREEN'
      ? GREEN_TOKEN_LABELS[Math.floor(Math.random() * GREEN_TOKEN_LABELS.length)]
      : type === 'RED'
        ? RED_TOKEN_LABELS[Math.floor(Math.random() * RED_TOKEN_LABELS.length)]
        : undefined;

  return {
    pos,
    type,
    spawnProgress: 0,
    label,
    active: type !== 'YELLOW', // yellow tokens start locked
  };
}

// ─── Particle Factory ───

export function createParticles(
  x: number,
  y: number,
  color: string,
  count: number,
  cellSize: number,
): Particle[] {
  const particles: Particle[] = [];
  const centerX = x * cellSize + cellSize / 2;
  const centerY = y * cellSize + cellSize / 2;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 50 + Math.random() * 100;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.5 + Math.random() * 0.3,
      maxLife: 0.5 + Math.random() * 0.3,
      color,
      size: 2 + Math.random() * 3,
    });
  }

  return particles;
}

// ─── Initial Token Spawning ───

function spawnInitialTokens(snakeSegments: Position[], levelConfig: LevelConfig): Token[] {
  const tokens: Token[] = [];
  // Spawn yellowCount yellow tokens (inactive)
  for (let i = 0; i < levelConfig.yellowCount; i++) {
    tokens.push(spawnToken(snakeSegments, tokens, levelConfig, 'YELLOW'));
  }
  // Spawn up to maxTokens active tokens (green/red)
  for (let i = 0; i < levelConfig.maxTokens; i++) {
    tokens.push(spawnToken(snakeSegments, tokens, levelConfig));
  }
  return tokens;
}

// ─── Question Selection (avoids repeats per level) ───

const usedQuestionIds = new Set<number>();

export function getRandomQuestion(difficulties: string[]): Question | null {
  const pool = questions.filter((q) => difficulties.includes(q.difficulty));
  // Filter out already used questions
  const available = pool.filter((q) => !usedQuestionIds.has(q.id));
  if (available.length === 0) {
    // Reset if we've exhausted all questions
    usedQuestionIds.clear();
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const q = available[Math.floor(Math.random() * available.length)];
  usedQuestionIds.add(q.id);
  return q;
}

// ─── Game Tick Logic ───

export interface TickResult {
  newState: GameState;
  event?: 'token-collected' | 'yellow-token' | 'red-token' | 'self-collision' | 'wall-collision' | 'level-complete' | 'game-over';
  eventData?: Record<string, unknown>;
}

export function gameTick(state: GameState, deltaTime: number): TickResult {
  if (state.status !== 'PLAYING') {
    return { newState: state };
  }

  let newState = { ...state };
  newState.snake = { ...state.snake, segments: state.snake.segments.map((s) => ({ ...s })) };
  newState.tokens = state.tokens.map((t) => ({ ...t }));
  newState.particles = state.particles.map((p) => ({ ...p }));

  // Update timers
  newState.survivalTime += deltaTime / 1000;

  if (newState.snake.invincibleTimer > 0) {
    newState.snake.invincibleTimer = Math.max(0, newState.snake.invincibleTimer - deltaTime);
  }

  if (newState.isSpeedBoost) {
    newState.speedBoostTimer -= deltaTime;
    if (newState.speedBoostTimer <= 0) {
      newState.isSpeedBoost = false;
    }
  }

  if (newState.screenShake > 0) {
    newState.screenShake = Math.max(0, newState.screenShake - deltaTime);
  }

  if (newState.flashTimer > 0) {
    newState.flashTimer = Math.max(0, newState.flashTimer - deltaTime);
    if (newState.flashTimer <= 0) {
      newState.flashColor = null;
    }
  }

  // Update token spawn animations
  for (const token of newState.tokens) {
    if (token.spawnProgress < 1) {
      token.spawnProgress = Math.min(1, token.spawnProgress + deltaTime / SPAWN_ANIMATION_DURATION);
    }
  }

  // Update particles
  newState.particles = newState.particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx * (deltaTime / 1000),
      y: p.y + p.vy * (deltaTime / 1000),
      vy: p.vy + 100 * (deltaTime / 1000), // gravity
      life: p.life - deltaTime / 1000,
    }))
    .filter((p) => p.life > 0);

  // Move snake
  newState.snake.direction = newState.snake.nextDirection;
  const dirVec = DIRECTION_VECTORS[newState.snake.direction];
  const head = newState.snake.segments[0];

  const newHeadPos: Position = {
    x: head.pos.x + dirVec.x,
    y: head.pos.y + dirVec.y,
  };

  // Apply wall/wrap
  const clampedPos = clampGrid(newHeadPos, newState.wallMode);

  if (clampedPos === null) {
    // Wall collision
    if (newState.snake.invincibleTimer > 0) {
      return { newState };
    }
    return handleCollision(newState, 'wall-collision');
  }

  // Save previous positions for interpolation
  for (const seg of newState.snake.segments) {
    seg.prevPos = { ...seg.pos };
  }

  // Check self-collision
  const hitSelf = newState.snake.segments.some((s) => posEqual(s.pos, clampedPos));
  if (hitSelf) {
    if (newState.snake.invincibleTimer > 0) {
      return { newState };
    }
    return handleCollision(newState, 'self-collision');
  }

  // Move segments (follow the leader)
  for (let i = newState.snake.segments.length - 1; i > 0; i--) {
    newState.snake.segments[i].pos = { ...newState.snake.segments[i - 1].pos };
  }
  newState.snake.segments[0].pos = clampedPos;

  // Check token collection (skip inactive yellow tokens)
  const tokenIndex = newState.tokens.findIndex((t) => posEqual(t.pos, clampedPos) && !(t.type === 'YELLOW' && !t.active));
  if (tokenIndex >= 0) {
    return handleTokenCollection(newState, tokenIndex);
  }

  return { newState };
}

function handleCollision(state: GameState, type: 'wall-collision' | 'self-collision'): TickResult {
  const newState = { ...state };
  newState.snake = { ...state.snake, segments: state.snake.segments.map((s) => ({ ...s })) };

  newState.lives -= 1;
  newState.screenShake = 300;
  newState.flashColor = '#FF2E9A';
  newState.flashTimer = 300;

  if (newState.lives <= 0) {
    newState.status = 'GAME_OVER';
    newState.snake.isAlive = false;
    return { newState, event: 'game-over' };
  }

  // Reset snake to center
  newState.snake = createSnake();
  newState.snake.invincibleTimer = 3000;

  return { newState, event: type };
}

function handleTokenCollection(state: GameState, tokenIndex: number): TickResult {
  const newState = { ...state };
  newState.snake = { ...state.snake, segments: state.snake.segments.map((s) => ({ ...s })) };
  newState.tokens = [...state.tokens];
  newState.particles = [...state.particles];

  const token = newState.tokens[tokenIndex];
  const levelConfig = LEVELS[newState.level - 1];
  const cellSize = 32;

  if (token.type === 'GREEN') {
    // Green: +10 points, grow by 1
    const multiplier = newState.isSpeedBoost ? 2 : getComboMultiplier(newState.combo);
    const points = POINTS.greenToken * multiplier;
    newState.score += points;
    newState.tokensCollected += 1;

    // Add tail segment
    const tail = newState.snake.segments[newState.snake.segments.length - 1];
    newState.snake.segments.push({
      pos: { ...tail.pos },
      prevPos: { ...tail.prevPos },
    });

    // Particles
    newState.particles.push(
      ...createParticles(token.pos.x, token.pos.y, '#4CAF50', 8, cellSize),
    );

    // Remove collected token
    newState.tokens.splice(tokenIndex, 1);

    // Charge yellow token: every 3 green tokens activates a yellow
    newState.yellowTokenCharge += 1;
    if (newState.yellowTokenCharge >= YELLOW_ACTIVATION_THRESHOLD) {
      const inactiveIdx = newState.tokens.findIndex((t) => t.type === 'YELLOW' && !t.active);
      if (inactiveIdx >= 0) {
        newState.tokens[inactiveIdx] = { ...newState.tokens[inactiveIdx], active: true, spawnProgress: 0 };
      }
      newState.yellowTokenCharge = 0;
    }

    // Check level complete (target length + yellow majority)
    const newMaxLength = Math.max(newState.maxLength, newState.snake.segments.length);
    newState.maxLength = newMaxLength;

    const yellowMajority = newState.levelYellowTotal === 0
      ? true
      : newState.levelYellowCorrect >= Math.floor(newState.levelYellowTotal / 2) + 1;

    if (newState.snake.segments.length >= levelConfig.targetLength && yellowMajority) {
      newState.score += POINTS.levelComplete(newState.level);
      newState.status = 'LEVEL_COMPLETE';
      return { newState, event: 'level-complete' };
    }

    // Spawn new token if needed
    if (newState.tokens.length < levelConfig.maxTokens) {
      setTimeout(() => {
        // This will be handled by the game loop
      }, 1500);
    }

    return { newState, event: 'token-collected' };
  }

  if (token.type === 'YELLOW') {
    // Yellow: trigger question (only if active)
    if (!token.active) return { newState };

    newState.yellowTokensCollected += 1;
    newState.levelYellowTotal += 1;
    const question = getRandomQuestion(levelConfig.questionDifficulties);
    if (question) {
      newState.currentQuestion = question;
      newState.status = 'QUESTION';
    }
    // Remove token
    newState.tokens.splice(tokenIndex, 1);

    // Particles
    newState.particles.push(
      ...createParticles(token.pos.x, token.pos.y, '#FFE66D', 10, cellSize),
    );

    return { newState, event: 'yellow-token' };
  }

  if (token.type === 'RED') {
    // Red: -30 points, shrink by 2
    newState.score = Math.max(0, newState.score + POINTS.redToken);
    newState.screenShake = 300;
    newState.flashColor = '#FF2E9A';
    newState.flashTimer = 300;
    newState.combo = 0; // Reset combo on red token

    // Remove segments (minimum length 3)
    const targetLength = Math.max(3, newState.snake.segments.length - 2);
    while (newState.snake.segments.length > targetLength) {
      newState.snake.segments.pop();
    }

    // Particles
    newState.particles.push(
      ...createParticles(token.pos.x, token.pos.y, '#FF2E9A', 8, cellSize),
    );

    // Remove token
    newState.tokens.splice(tokenIndex, 1);

    // Check if snake too short
    if (newState.snake.segments.length < 3) {
      newState.status = 'GAME_OVER';
      newState.snake.isAlive = false;
      return { newState, event: 'game-over' };
    }

    return { newState, event: 'red-token' };
  }

  return { newState };
}

export function handleQuestionAnswer(state: GameState, correct: boolean): GameState {
  const newState = { ...state };
  newState.particles = [...state.particles];

  // Both correct and wrong: snake grows by 2, points only on correct
  if (correct) {
    newState.combo += 1;
    const multiplier = getComboMultiplier(newState.combo);
    const points = Math.floor(POINTS.yellowCorrect * multiplier);
    newState.score += points;
    newState.questionsCorrect += 1;
    newState.questionsTotal += 1;
    newState.levelYellowCorrect += 1;

    newState.flashColor = '#4CAF50';
    newState.flashTimer = 300;
  } else {
    // Wrong answer: snake still grows, no penalty
    newState.questionsTotal += 1;
    // No combo reset, no score deduction, no shake
    newState.flashColor = '#FFE66D';
    newState.flashTimer = 150;
  }

  // Grow by 2 segments regardless of correct/wrong
  for (let i = 0; i < 2; i++) {
    const tail = newState.snake.segments[newState.snake.segments.length - 1];
    newState.snake.segments.push({
      pos: { ...tail.pos },
      prevPos: { ...tail.prevPos },
    });
  }

  // Check level complete: need target length AND majority of yellow answers correct
  const levelConfig = LEVELS[newState.level - 1];
  const lenOk = newState.snake.segments.length >= levelConfig.targetLength;
  const yellowMajority = newState.levelYellowTotal === 0
    ? true // no yellows collected this level, skip yellow requirement
    : newState.levelYellowCorrect >= Math.floor(newState.levelYellowTotal / 2) + 1;

  if (lenOk && yellowMajority) {
    newState.score += POINTS.levelComplete(newState.level);
    newState.status = 'LEVEL_COMPLETE';
    newState.currentQuestion = null;
    return newState;
  }

  newState.currentQuestion = null;
  newState.status = 'PLAYING';
  return newState;
}

export function spawnMissingTokens(state: GameState): GameState {
  const newState = { ...state };
  const levelConfig = LEVELS[state.level - 1];

  const snakePositions = state.snake.segments.map((s) => s.pos);

  // 1. Maintain yellowCount yellow tokens on the board (inactive)
  const yellows = newState.tokens.filter((t) => t.type === 'YELLOW').length;
  for (let i = yellows; i < levelConfig.yellowCount; i++) {
    const yt = spawnToken(snakePositions, newState.tokens, levelConfig, 'YELLOW');
    newState.tokens = [...newState.tokens, yt];
  }

  // 2. Maintain active (non-yellow-inactive) tokens up to maxTokens
  while (true) {
    const activeCount = newState.tokens.filter((t) => !(t.type === 'YELLOW' && !t.active)).length;
    if (activeCount >= levelConfig.maxTokens) break;
    const newToken = spawnToken(snakePositions, newState.tokens, levelConfig);
    newState.tokens = [...newState.tokens, newToken];
  }

  return newState;
}

export function initGameState(): GameState {
  const snake = createSnake();
  const levelConfig = LEVELS[0];

  const initialTokens = spawnInitialTokens(snake.segments.map((s) => s.pos), levelConfig);

  return {
    snake,
    tokens: initialTokens,
    particles: [],
    score: 0,
    level: 1,
    lives: 3,
    combo: 0,
    comboMultiplier: 1,
    wallMode: 'wrap',
    status: 'MENU',
    currentQuestion: null,
    questionTimer: 15,
    tokensCollected: 0,
    yellowTokenCharge: 0,
    yellowTokensCollected: 0,
    levelYellowTotal: 0,
    levelYellowCorrect: 0,
    questionsCorrect: 0,
    questionsTotal: 0,
    maxLength: 3,
    survivalTime: 0,
    lastTickTime: 0,
    isSpeedBoost: false,
    speedBoostTimer: 0,
    screenShake: 0,
    flashColor: null,
    flashTimer: 0,
  };
}

export function startLevel(level: number, wallMode: WallMode): GameState {
  const snake = createSnake();
  const levelConfig = LEVELS[Math.min(level - 1, LEVELS.length - 1)];

  const tokens = spawnInitialTokens(snake.segments.map((s) => s.pos), levelConfig);

  return {
    snake,
    tokens,
    particles: [],
    score: 0,
    level,
    lives: 3,
    combo: 0,
    comboMultiplier: 1,
    wallMode,
    status: 'PLAYING',
    currentQuestion: null,
    questionTimer: 15,
    tokensCollected: 0,
    yellowTokenCharge: 0,
    yellowTokensCollected: 0,
    levelYellowTotal: 0,
    levelYellowCorrect: 0,
    questionsCorrect: 0,
    questionsTotal: 0,
    maxLength: 3,
    survivalTime: 0,
    lastTickTime: Date.now(),
    isSpeedBoost: false,
    speedBoostTimer: 0,
    screenShake: 0,
    flashColor: null,
    flashTimer: 0,
  };
}

export function advanceLevel(state: GameState): GameState {
  const nextLevel = Math.min(state.level + 1, LEVELS.length);
  const snake = createSnake();
  const levelConfig = LEVELS[nextLevel - 1];

  const tokens = spawnInitialTokens(snake.segments.map((s) => s.pos), levelConfig);

  return {
    ...state,
    snake,
    tokens,
    particles: [],
    level: nextLevel,
    status: 'PLAYING',
    currentQuestion: null,
    isSpeedBoost: false,
    speedBoostTimer: 0,
    screenShake: 0,
    flashColor: null,
    flashTimer: 0,
    yellowTokenCharge: 0,
    yellowTokensCollected: 0,
    levelYellowTotal: 0,
    levelYellowCorrect: 0,
    lastTickTime: Date.now(),
  };
}

export function checkBonusLife(state: GameState, prevScore: number): boolean {
  const threshold = POINTS.bonusLife;
  return Math.floor(prevScore / threshold) < Math.floor(state.score / threshold);
}
