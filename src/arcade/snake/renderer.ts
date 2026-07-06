import type { GameState } from './types';
import {
  GRID_COLS,
  GRID_ROWS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLORS,
} from './constants';

// ─── Main Render ───

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  timestamp: number,
): void {
  const cellSize = CANVAS_WIDTH / GRID_COLS;

  ctx.save();

  // Apply screen shake
  if (state.screenShake > 0) {
    const intensity = 5;
    const dx = (Math.random() - 0.5) * 2 * intensity;
    const dy = (Math.random() - 0.5) * 2 * intensity;
    ctx.translate(dx, dy);
  }

  // Clear background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw checkerboard grid
  drawGrid(ctx, cellSize, timestamp);

  // Draw wall border if wall mode
  if (state.wallMode === 'wall') {
    drawWallBorder(ctx, cellSize, timestamp);
  }

  // Draw tokens
  for (const token of state.tokens) {
    drawToken(ctx, token, cellSize, timestamp);
  }

  // Draw particles
  for (const particle of state.particles) {
    drawParticle(ctx, particle);
  }

  // Draw snake
  if (state.snake.isAlive) {
    drawSnake(ctx, state, cellSize, timestamp);
  }

  // Draw screen flash overlay
  if (state.flashColor && state.flashTimer > 0) {
    const alpha = Math.min(1, state.flashTimer / 200) * 0.3;
    ctx.fillStyle = state.flashColor;
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

// ─── Grid Drawing ───

function drawGrid(
  ctx: CanvasRenderingContext2D,
  cellSize: number,
  _timestamp: number,
): void {
  for (let x = 0; x < GRID_COLS; x++) {
    for (let y = 0; y < GRID_ROWS; y++) {
      if ((x + y) % 2 === 0) {
        ctx.fillStyle = COLORS.gridChecker;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Subtle grid lines
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.3;
  for (let x = 0; x <= GRID_COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= GRID_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(CANVAS_WIDTH, y * cellSize);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ─── Wall Border ───

function drawWallBorder(
  ctx: CanvasRenderingContext2D,
  cellSize: number,
  timestamp: number,
): void {
  const pulse = Math.sin(timestamp / 500) * 0.2 + 0.8;
  ctx.strokeStyle = COLORS.wall;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLORS.wallGlow;
  ctx.shadowBlur = 10 * pulse;

  ctx.strokeRect(
    cellSize * 0.5,
    cellSize * 0.5,
    CANVAS_WIDTH - cellSize,
    CANVAS_HEIGHT - cellSize,
  );

  ctx.shadowBlur = 0;

  // Corner rivets
  const corners = [
    { x: cellSize, y: cellSize },
    { x: CANVAS_WIDTH - cellSize, y: cellSize },
    { x: cellSize, y: CANVAS_HEIGHT - cellSize },
    { x: CANVAS_WIDTH - cellSize, y: CANVAS_HEIGHT - cellSize },
  ];

  for (const corner of corners) {
    ctx.fillStyle = COLORS.wall;
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── Token Drawing ───

function drawToken(
  ctx: CanvasRenderingContext2D,
  token: { pos: { x: number; y: number }; type: string; spawnProgress: number; label?: string; active?: boolean },
  cellSize: number,
  timestamp: number,
): void {
  const cx = token.pos.x * cellSize + cellSize / 2;
  const cy = token.pos.y * cellSize + cellSize / 2;
  const scale = easeOutElastic(token.spawnProgress);
  const radius = (cellSize * 0.35) * scale;

  if (radius <= 0) return;

  ctx.save();
  ctx.translate(cx, cy);

  // Glow pulse
  const pulse = Math.sin(timestamp / 400 + token.pos.x * 0.5) * 0.15 + 0.85;

  if (token.type === 'GREEN') {
    // Green knowledge token - circle with glow
    ctx.shadowColor = COLORS.greenTokenGlow;
    ctx.shadowBlur = 15 * pulse * scale;

    ctx.fillStyle = COLORS.greenToken;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Label inside
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 11px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(token.label ?? 'OK', 0, 0);

  } else if (token.type === 'YELLOW') {
    const isActive = token.active === true;

    // Outer glow (always visible)
    ctx.shadowColor = isActive ? COLORS.yellowTokenGlow : 'rgba(255, 230, 109, 0.25)';
    ctx.shadowBlur = (isActive ? 25 : 10) * pulse * scale;

    // Background circle (always bright yellow, slightly dimmer when locked)
    ctx.fillStyle = isActive ? COLORS.yellowToken : 'rgba(200, 180, 80, 0.7)';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Cross-out / lock indicator when inactive
    ctx.shadowBlur = 0;
    if (isActive) {
      // Active: pulsing "?" with ring
      const activePulse = Math.sin(timestamp / 200) * 0.25 + 0.75;
      ctx.fillStyle = `rgba(255, 230, 109, ${activePulse})`;
      ctx.font = `bold ${radius * 0.8}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 0, 0);
      ctx.strokeStyle = `rgba(255, 230, 109, ${activePulse * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Inactive: visible "?" with lock bar across
      ctx.fillStyle = '#000';
      ctx.globalAlpha = 0.5;
      ctx.font = `bold ${radius * 0.7}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 0, 0);
      ctx.globalAlpha = 1;
      // Lock bar
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(-radius * 0.4, -2, radius * 0.8, 4);
    }

  } else if (token.type === 'RED') {
    // Red misconception token
    ctx.shadowColor = COLORS.redTokenGlow;
    ctx.shadowBlur = 15 * pulse * scale;

    ctx.fillStyle = COLORS.redToken;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Label inside
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 11px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(token.label ?? 'X', 0, 0);
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

// ─── Particle Drawing ───

function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: { x: number; y: number; color: string; size: number; life: number; maxLife: number },
): void {
  const alpha = Math.max(0, particle.life / particle.maxLife);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = particle.color;
  ctx.fillRect(
    particle.x - particle.size / 2,
    particle.y - particle.size / 2,
    particle.size,
    particle.size,
  );
  ctx.globalAlpha = 1;
}

// ─── Snake Drawing ───

function drawSnake(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  cellSize: number,
  timestamp: number,
): void {
  const segments = state.snake.segments;
  const isInvincible = state.snake.invincibleTimer > 0;
  const blinkOn = Math.floor(timestamp / 150) % 2 === 0;

  if (isInvincible && !blinkOn) {
    ctx.globalAlpha = 0.4;
  }

  // Draw body from tail to head (so head is on top)
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    const cx = seg.pos.x * cellSize + cellSize / 2;
    const cy = seg.pos.y * cellSize + cellSize / 2;

    if (i === 0) {
      // Head
      drawSnakeHead(ctx, cx, cy, cellSize, state.snake.direction, timestamp);
    } else {
      // Body - gradient from body color to tail color
      const ratio = i / segments.length;
      const r = Math.round(
        parseInt(COLORS.snakeBody.slice(1, 3), 16) * (1 - ratio) +
          parseInt(COLORS.snakeTail.slice(1, 3), 16) * ratio,
      );
      const g = Math.round(
        parseInt(COLORS.snakeBody.slice(3, 5), 16) * (1 - ratio) +
          parseInt(COLORS.snakeTail.slice(3, 5), 16) * ratio,
      );
      const b = Math.round(
        parseInt(COLORS.snakeBody.slice(5, 7), 16) * (1 - ratio) +
          parseInt(COLORS.snakeTail.slice(5, 7), 16) * ratio,
      );
      const color = `rgb(${r}, ${g}, ${b})`;

      const size = cellSize * 0.85 * (1 - ratio * 0.2); // tail is slightly smaller
      const rounded = size * 0.3;

      ctx.fillStyle = color;
      roundRect(ctx, cx - size / 2, cy - size / 2, size, size, rounded);
      ctx.fill();

      // Corner indicator for turning segments
      if (i < segments.length - 1) {
        const prev = segments[i - 1];
        const next = segments[i + 1];
        if (
          prev.pos.x !== next.pos.x &&
          prev.pos.y !== next.pos.y
        ) {
          // This is a corner - subtle highlight
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          roundRect(ctx, cx - size / 4, cy - size / 4, size / 2, size / 2, rounded / 2);
          ctx.fill();
        }
      }
    }
  }

  ctx.globalAlpha = 1;
}

function drawSnakeHead(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cellSize: number,
  direction: string,
  timestamp: number,
): void {
  const size = cellSize * 0.9;
  const pulse = Math.sin(timestamp / 300) * 0.05 + 1;

  // Head glow
  ctx.shadowColor = COLORS.snakeHeadGlow;
  ctx.shadowBlur = 12;

  // Head body
  ctx.fillStyle = COLORS.snakeHead;
  roundRect(ctx, cx - size / 2, cy - size / 2, size, size, size * 0.25);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Eyes - position based on direction
  const eyeSize = size * 0.15;
  const eyeOffset = size * 0.2;
  const eyePositions = getEyePositions(direction, cx, cy, eyeOffset);

  for (const eyePos of eyePositions) {
    ctx.fillStyle = COLORS.bg;
    ctx.beginPath();
    ctx.arc(eyePos.x, eyePos.y, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyePos.x - eyeSize * 0.2, eyePos.y - eyeSize * 0.3, eyeSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tongue flicker (every 2-3 seconds)
  const tongueCycle = (timestamp % 2500) / 2500;
  if (tongueCycle > 0.8 && tongueCycle < 0.95) {
    drawTongue(ctx, cx, cy, cellSize, direction);
  }

  // Speed boost aura
  if (pulse > 1.02) {
    ctx.strokeStyle = 'rgba(102, 252, 241, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.6 * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function getEyePositions(
  direction: string,
  cx: number,
  cy: number,
  offset: number,
): Array<{ x: number; y: number }> {
  switch (direction) {
    case 'UP':
      return [
        { x: cx - offset, y: cy - offset },
        { x: cx + offset, y: cy - offset },
      ];
    case 'DOWN':
      return [
        { x: cx - offset, y: cy + offset },
        { x: cx + offset, y: cy + offset },
      ];
    case 'LEFT':
      return [
        { x: cx - offset, y: cy - offset },
        { x: cx - offset, y: cy + offset },
      ];
    case 'RIGHT':
      return [
        { x: cx + offset, y: cy - offset },
        { x: cx + offset, y: cy + offset },
      ];
    default:
      return [
        { x: cx - offset, y: cy - offset },
        { x: cx + offset, y: cy - offset },
      ];
  }
}

function drawTongue(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cellSize: number,
  direction: string,
): void {
  ctx.strokeStyle = '#FF2E9A';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';

  const length = cellSize * 0.3;
  let startX = cx;
  let startY = cy;
  let endX = cx;
  let endY = cy;

  switch (direction) {
    case 'UP':
      startY = cy - cellSize * 0.4;
      endY = startY - length;
      break;
    case 'DOWN':
      startY = cy + cellSize * 0.4;
      endY = startY + length;
      break;
    case 'LEFT':
      startX = cx - cellSize * 0.4;
      endX = startX - length;
      break;
    case 'RIGHT':
      startX = cx + cellSize * 0.4;
      endX = startX + length;
      break;
  }

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Fork
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  if (direction === 'UP' || direction === 'DOWN') {
    ctx.lineTo(endX - 3, endY + (direction === 'UP' ? -4 : 4));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX + 3, endY + (direction === 'UP' ? -4 : 4));
  } else {
    ctx.lineTo(endX + (direction === 'LEFT' ? -4 : 4), endY - 3);
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX + (direction === 'LEFT' ? -4 : 4), endY + 3);
  }
  ctx.stroke();
}

// ─── Utility: Rounded Rectangle ───

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Easing Functions ───

function easeOutElastic(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
