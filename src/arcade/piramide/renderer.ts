export interface Cell {
  row: number;
  col: number;
  completed: boolean;
  isBonus?: boolean;
}

export interface PlayerPos {
  row: number;
  col: number;
}

export interface Enemy {
  row: number;
  col: number;
  type?: 'faller' | 'chaser';
}

const COLORS = {
  bg: '#000000',
  // Unvisited cube (blue top)
  cubeTop: '#0055FF',
  cubeLeft: '#888888',
  cubeRight: '#444444',
  cubeTopGlow: 'transparent',
  // Completed cube (yellow top)
  cubeCompletedTop: '#FFCC00',
  cubeCompletedLeft: '#888888',
  cubeCompletedRight: '#444444',
  cubeCompletedGlow: 'transparent',
  // Bonus cube (cyan top)
  cubeBonusTop: '#00FFFF',
  cubeBonusLeft: '#888888',
  cubeBonusRight: '#444444',
  cubeBonusGlow: 'transparent',
  // Avatar
  avatarBody: '#FF5500',
  avatarHat: '#FF5500',
  avatarHatBrim: '#FF5500',
  avatarEye: '#000000',
  avatarGlow: 'transparent',
  // Enemy
  enemyBody: '#CC00CC',
  enemyGlow: 'transparent',
  // UI
  textScore: '#FFE66D',
  textLives: '#FF2E9A',
  textLevel: '#8A95A5',
};

const ROWS = 7;
const CELL_W = 140;
const CELL_H = 70;

function getCubeCenter(row: number, col: number): { x: number; y: number } {
  const startX = 600;
  const startY = 200;
  return {
    x: startX - (row * CELL_W) / 2 + col * CELL_W,
    y: startY + row * CELL_H,
  };
}

function darken(hex: string, factor: number): string {
  const r = Math.min(255, Math.round(parseInt(hex.slice(1, 3), 16) * factor));
  const g = Math.min(255, Math.round(parseInt(hex.slice(3, 5), 16) * factor));
  const b = Math.min(255, Math.round(parseInt(hex.slice(5, 7), 16) * factor));
  return `rgb(${r},${g},${b})`;
}

function lighten(hex: string, factor: number): string {
  const r = Math.min(255, Math.round(255 - (255 - parseInt(hex.slice(1, 3), 16)) * factor));
  const g = Math.min(255, Math.round(255 - (255 - parseInt(hex.slice(3, 5), 16)) * factor));
  const b = Math.min(255, Math.round(255 - (255 - parseInt(hex.slice(5, 7), 16)) * factor));
  return `rgb(${r},${g},${b})`;
}

function draw3DCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  topColor: string,
  leftColor: string,
  rightColor: string,
  glowColor: string,
  timestamp: number,
): void {
  ctx.shadowBlur = 0;

  // Left face
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - w / 2, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy + h);
  ctx.lineTo(cx, cy + h / 2);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + w / 2, cy + h / 2);
  ctx.lineTo(cx + w / 2, cy + h);
  ctx.lineTo(cx, cy + h / 2);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();

  // Top face
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + w / 2, cy + h / 2);
  ctx.lineTo(cx, cy + h);
  ctx.lineTo(cx - w / 2, cy + h / 2);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();
}

export function drawGame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  cells: Cell[],
  playerPos: PlayerPos,
  enemies: Enemy[],
  score: number,
  level: number,
  lives: number,
  levelName: string,
  timestamp: number,
): void {
  const W = 1200;
  const H = 1100;
  canvas.width = W;
  canvas.height = H;

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);

  // Draw HUD inside canvas
  drawHUD(ctx, W, H, score, level, lives, levelName);

  // Draw cubes from back to front (row 0 first, row 6 last)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= r; c++) {
      const cell = cells.find((cl) => cl.row === r && cl.col === c);
      if (!cell) continue;
      const p = getCubeCenter(r, c);

      if (cell.completed) {
        draw3DCube(ctx, p.x, p.y, CELL_W, CELL_H,
          COLORS.cubeCompletedTop, COLORS.cubeCompletedLeft, COLORS.cubeCompletedRight,
          COLORS.cubeCompletedGlow, timestamp);
      } else if (cell.isBonus) {
        draw3DCube(ctx, p.x, p.y, CELL_W, CELL_H,
          COLORS.cubeBonusTop, COLORS.cubeBonusLeft, COLORS.cubeBonusRight,
          COLORS.cubeBonusGlow, timestamp);
          
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', p.x, p.y + CELL_H/4);
      } else {
        draw3DCube(ctx, p.x, p.y, CELL_W, CELL_H,
          COLORS.cubeTop, COLORS.cubeLeft, COLORS.cubeRight,
          COLORS.cubeTopGlow, timestamp);
      }
    }
  }

  // Draw enemies
  for (const enemy of enemies) {
    const p = getCubeCenter(enemy.row, enemy.col);
    drawEnemy(ctx, p.x, p.y, timestamp, enemy.type);
  }

  // Draw avatar on top
  const pp = getCubeCenter(playerPos.row, playerPos.col);
  const avatarBounce = Math.abs(Math.sin(timestamp / 180)) * 10;
  drawAvatar(ctx, pp.x, pp.y - avatarBounce, CELL_W, CELL_H, timestamp);

  // Apply CRT scanlines effect
  drawScanlines(ctx, W, H);
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  score: number,
  level: number,
  lives: number,
  levelName: string
): void {
  // Score (Yellow retro look)
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px "Pixelify Sans", "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE', 20, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(String(score).padStart(6, '0'), 20, 70);

  // Level info
  ctx.fillStyle = '#00FFFF';
  ctx.font = 'bold 18px "Pixelify Sans", "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`LEVEL: ${level}`, w - 20, 40);
  ctx.font = '14px "Pixelify Sans", "Courier New", monospace';
  ctx.fillText(levelName.toUpperCase(), w - 20, 65);

  // Lives (Icons)
  ctx.fillStyle = '#FF2E9A';
  ctx.textAlign = 'left';
  ctx.font = 'bold 18px "Pixelify Sans", "Courier New", monospace';
  ctx.fillText('LIVES:', 20, h - 30);
  
  for (let i = 0; i < 3; i++) {
    const x = 90 + i * 25;
    const y = h - 35;
    if (i < lives) {
      // Small heart or blob representing Q*bert life
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#2A3645';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawScanlines(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#000000';
  for (let i = 0; i < h; i += 3) {
    ctx.fillRect(0, i, w, 1);
  }
  
  // Subtle vignette
  const grad = ctx.createRadialGradient(w/2, h/2, w/4, w/2, h/2, w/1.2);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawEnemy(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  timestamp: number,
  type: 'faller' | 'chaser' = 'faller'
): void {
  const bounce = Math.abs(Math.sin(timestamp / 200 + cx)) * 15;
  const r = 10;

  ctx.shadowBlur = 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (Purple ball for chaser, Red for faller)
  ctx.fillStyle = type === 'chaser' ? COLORS.enemyBody : '#FF0000';
  ctx.beginPath();
  ctx.arc(cx, cy - 8 - bounce, r, 0, Math.PI * 2);
  ctx.fill();

  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 12 - bounce, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawAvatar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  timestamp: number,
): void {
  const bounce = Math.abs(Math.sin(timestamp / 180)) * 10;
  const ax = cx;
  const ay = cy - bounce - 5;

  ctx.shadowBlur = 0;

  // Shadow on cube
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(ax, cy + 2, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = COLORS.avatarBody;
  ctx.beginPath();
  ctx.arc(ax, ay, 12, 0, Math.PI * 2);
  ctx.fill();
  
  // Snout (Q*bert style)
  ctx.beginPath();
  ctx.ellipse(ax - 8, ay + 4, 8, 4, Math.PI/6, 0, Math.PI * 2);
  ctx.fill();
  
  // Hole in snout
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(ax - 13, ay + 6, 2, 3, Math.PI/6, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(ax - 2, ay - 4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ax + 6, ay - 4, 4, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = COLORS.avatarEye;
  ctx.beginPath();
  ctx.arc(ax - 3, ay - 4, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ax + 5, ay - 4, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
