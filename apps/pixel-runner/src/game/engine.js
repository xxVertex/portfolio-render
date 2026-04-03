import {
  CANVAS_W, CANVAS_H, PIXEL, GROUND_Y, GRAVITY,
  JUMP_FORCE, DOUBLE_JUMP_FORCE, SLIDE_DURATION,
  INITIAL_SPEED, SPEED_INCREMENT, MAX_SPEED,
  POINTS_PER_FRAME, POWERUP_DURATION, PALETTE, SPRITES
} from "./constants";
import {
  drawSprite, drawPixelText, drawPixelRect,
  drawScanlines, drawStars, drawGround
} from "./renderer";

function makePeaks(w, baseY, count, variance) {
  const peaks = [];
  for (let i = 0; i <= count; i++) {
    peaks.push({
      x: (w / count) * i,
      y: baseY - Math.random() * variance,
      speed: 1,
    });
  }
  return peaks;
}

function makeStars(w, h, count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * (h * 0.6),
    size: Math.random() < 0.3 ? 2 : 1,
    brightness: 0.3 + Math.random() * 0.7,
  }));
}

export function createGameState() {
  return {
    // Player
    player: {
      x: 80,
      y: GROUND_Y - 48,
      vy: 0,
      w: 32, h: 48,
      onGround: true,
      jumpsLeft: 2,
      sliding: false,
      slideTimer: 0,
      frame: 0,
      frameTimer: 0,
    },
    // Game state
    running: false,
    dead: false,
    started: false,
    score: 0,
    hiScore: parseInt(localStorage.getItem("pixelrunner-hi") || "0"),
    speed: INITIAL_SPEED,
    frame: 0,
    // Entities
    obstacles: [],
    coins: [],
    powerups: [],
    particles: [],
    // Powerup states
    shield: false,
    shieldTimer: 0,
    speedBoost: false,
    speedTimer: 0,
    shrink: false,
    shrinkTimer: 0,
    // BG
    bgOffset: 0,
    fgOffset: 0,
    groundOffset: 0,
    stars: makeStars(CANVAS_W, CANVAS_H, 60),
    mountainsFar: makePeaks(CANVAS_W, 160, 8, 60),
    mountainsNear: makePeaks(CANVAS_W, 200, 12, 40),
    // Leaderboard
    leaderboard: JSON.parse(localStorage.getItem("pixelrunner-lb") || "[]"),
    playerName: "",
    showLeaderboard: false,
  };
}

export function resetGame(state) {
  const fresh = createGameState();
  return {
    ...fresh,
    hiScore: state.hiScore,
    leaderboard: state.leaderboard,
    running: true,
    started: true,
    dead: false,
  };
}

// Spawn helpers
function spawnObstacle(state) {
  const types = ["tall", "wide", "double"];
  const type = types[Math.floor(Math.random() * types.length)];
  let w, h, sprite;
  if (type === "tall")   { w = 16; h = 32; sprite = "obstacle_tall"; }
  else if (type === "wide") { w = 24; h = 16; sprite = "obstacle_wide"; }
  else                   { w = 32; h = 24; sprite = "obstacle_double"; }
  state.obstacles.push({
    x: CANVAS_W + 20,
    y: GROUND_Y - h,
    w, h, sprite, type,
  });
}

function spawnCoin(state) {
  const y = Math.random() < 0.4
    ? GROUND_Y - 80  // high coin (require jump)
    : GROUND_Y - 32; // low coin
  state.coins.push({ x: CANVAS_W + 20, y, w: 16, h: 16, collected: false, bobTimer: Math.random() * Math.PI * 2 });
}

function spawnPowerup(state) {
  const types = ["shield", "speed", "shrink"];
  const type = types[Math.floor(Math.random() * types.length)];
  state.powerups.push({
    x: CANVAS_W + 20,
    y: GROUND_Y - 80,
    w: 24, h: 24,
    type, bobTimer: 0,
  });
}

function spawnParticle(state, x, y, color, count = 6) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 5 - 2,
      life: 1,
      decay: 0.04 + Math.random() * 0.04,
      size: PIXEL + Math.floor(Math.random() * PIXEL),
      color,
    });
  }
}

function rectOverlap(a, b, margin = 4) {
  return (
    a.x + margin < b.x + b.w - margin &&
    a.x + a.w - margin > b.x + margin &&
    a.y + margin < b.y + b.h - margin &&
    a.y + a.h - margin > b.y + margin
  );
}

export function updateGame(state, keys) {
  if (!state.running || state.dead) return state;

  const s = { ...state };
  s.frame++;
  s.score += POINTS_PER_FRAME * (s.speedBoost ? 2 : 1);
  s.speed = Math.min(INITIAL_SPEED + s.frame * SPEED_INCREMENT, MAX_SPEED);

  const effectiveSpeed = s.speedBoost ? s.speed * 1.6 : s.speed;

  // Background parallax
  s.bgOffset += effectiveSpeed * 0.3;
  s.groundOffset += effectiveSpeed;

  // Player physics
  const p = { ...s.player };
  const shrinkScale = s.shrink ? 0.6 : 1;
  const pH = s.shrink ? 29 : (p.sliding ? 20 : 48);
  const pW = s.shrink ? 19 : 32;

  // Jump
  if (keys.jump && p.jumpsLeft > 0) {
    if (p.onGround) {
      p.vy = JUMP_FORCE;
      p.onGround = false;
      p.jumpsLeft = 1;
      spawnParticle(s, p.x + pW / 2, p.y + pH, PALETTE.ground1, 5);
    } else if (p.jumpsLeft > 0) {
      p.vy = DOUBLE_JUMP_FORCE;
      p.jumpsLeft = 0;
      spawnParticle(s, p.x + pW / 2, p.y + pH / 2, PALETTE.shield, 8);
    }
    keys.jump = false;
  }

  // Slide
  if (keys.slide && p.onGround && !p.sliding) {
    p.sliding = true;
    p.slideTimer = SLIDE_DURATION;
  }
  if (p.sliding) {
    p.slideTimer--;
    if (p.slideTimer <= 0) p.sliding = false;
  }

  // Gravity
  p.vy += GRAVITY;
  p.y += p.vy;

  // Ground collision
  const groundLevel = GROUND_Y - pH;
  if (p.y >= groundLevel) {
    p.y = groundLevel;
    p.vy = 0;
    p.onGround = true;
    p.jumpsLeft = 2;
  } else {
    p.onGround = false;
  }

  // Animation
  p.frameTimer++;
  if (p.frameTimer > 8) { p.frame = (p.frame + 1) % 2; p.frameTimer = 0; }

  p.w = pW; p.h = pH;
  s.player = p;

  // Spawn logic
  const spawnInterval = Math.max(60, 120 - s.frame * 0.02);
  if (s.frame % Math.floor(spawnInterval) === 0) spawnObstacle(s);
  if (s.frame % 80 === 0) spawnCoin(s);
  if (s.frame % 400 === 0 && s.frame > 200) spawnPowerup(s);

  // Obstacle update & collision
  s.obstacles = s.obstacles.filter(o => o.x + o.w > -20).map(o => {
    const updated = { ...o, x: o.x - effectiveSpeed };
    const hitbox = { x: p.x, y: p.y, w: p.w, h: p.h };
    if (rectOverlap(hitbox, updated)) {
      if (s.shield) {
        s.shield = false;
        s.shieldTimer = 0;
        spawnParticle(s, p.x + p.w / 2, p.y + p.h / 2, PALETTE.shield, 12);
        return null;
      }
      s.dead = true;
      s.running = false;
      spawnParticle(s, p.x + p.w / 2, p.y + p.h / 2, PALETTE.player, 16);
    }
    return updated;
  }).filter(Boolean);

  // Coin update & collection
  s.coins = s.coins.filter(c => c.x + c.w > -20).map(c => {
    const updated = { ...c, x: c.x - effectiveSpeed, bobTimer: c.bobTimer + 0.1 };
    updated.displayY = updated.y + Math.sin(updated.bobTimer) * 4;
    if (!updated.collected && rectOverlap({ x: p.x, y: p.y, w: p.w, h: p.h }, { ...updated, y: updated.displayY })) {
      updated.collected = true;
      s.score += 10;
      spawnParticle(s, updated.x + 8, updated.displayY + 8, PALETTE.coin, 6);
    }
    return updated;
  }).filter(c => !c.collected);

  // Powerup update & collection
  s.powerups = s.powerups.filter(pu => pu.x + pu.w > -20).map(pu => {
    const updated = { ...pu, x: pu.x - effectiveSpeed, bobTimer: pu.bobTimer + 0.08 };
    updated.displayY = updated.y + Math.sin(updated.bobTimer) * 5;
    if (rectOverlap({ x: p.x, y: p.y, w: p.w, h: p.h }, { ...updated, y: updated.displayY })) {
      if (updated.type === "shield")  { s.shield = true; s.shieldTimer = POWERUP_DURATION; }
      if (updated.type === "speed")   { s.speedBoost = true; s.speedTimer = POWERUP_DURATION; }
      if (updated.type === "shrink")  { s.shrink = true; s.shrinkTimer = POWERUP_DURATION; }
      spawnParticle(s, updated.x + 12, updated.displayY + 12, updated.type === "shield" ? PALETTE.shield : updated.type === "speed" ? PALETTE.speed : PALETTE.shrink, 10);
      return null;
    }
    return updated;
  }).filter(Boolean);

  // Powerup timers
  if (s.shield && --s.shieldTimer <= 0) { s.shield = false; }
  if (s.speedBoost && --s.speedTimer <= 0) { s.speedBoost = false; }
  if (s.shrink && --s.shrinkTimer <= 0) { s.shrink = false; }

  // Particles
  s.particles = s.particles
    .map(pt => ({ ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy, vy: pt.vy + 0.2, life: pt.life - pt.decay }))
    .filter(pt => pt.life > 0);

  // Hi score
  if (Math.floor(s.score) > s.hiScore) {
    s.hiScore = Math.floor(s.score);
    localStorage.setItem("pixelrunner-hi", s.hiScore);
  }

  return s;
}

export function saveScore(state, name) {
  const lb = [...state.leaderboard, { name: name.slice(0, 8).toUpperCase() || "ANON", score: Math.floor(state.score) }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  localStorage.setItem("pixelrunner-lb", JSON.stringify(lb));
  return lb;
}

// ── RENDER ──────────────────────────────────────────────────────────────────

export function renderGame(ctx, state) {
  const { player: p, obstacles, coins, powerups, particles } = state;

  // Sky background
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, PALETTE.sky1);
  grad.addColorStop(1, PALETTE.sky2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Stars
  state.stars.forEach(s => {
    ctx.fillStyle = `rgba(255,255,255,${s.brightness})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // Far mountains
  drawMountainRange(ctx, state.bgOffset * 0.15, CANVAS_W, 220, PALETTE.mountain, 10, 70);
  // Near mountains
  drawMountainRange(ctx, state.bgOffset * 0.3, CANVAS_W, 230, PALETTE.ground2, 14, 45);

  // Ground
  drawGround(ctx, state.groundOffset, CANVAS_W, GROUND_Y, 48,
    [PALETTE.ground1, PALETTE.ground2, PALETTE.ground3]);

  // Coins
  coins.forEach(c => {
    const colorMap = { 1: PALETTE.coin, 2: "#b8860b", 3: PALETTE.coinShine };
    drawSprite(ctx, SPRITES.coin, c.x, c.displayY || c.y, colorMap);
  });

  // Powerups
  powerups.forEach(pu => {
    const color = pu.type === "shield" ? PALETTE.shield : pu.type === "speed" ? PALETTE.speed : PALETTE.shrink;
    const colorMap = { 1: color, 2: color + "88", 3: "#ffffff" };
    const sprite = SPRITES[`powerup_${pu.type}`];
    if (sprite) drawSprite(ctx, sprite, pu.x, pu.displayY || pu.y, colorMap);
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(state.frame * 0.1);
    ctx.fillStyle = color;
    ctx.fillRect(pu.x - 4, (pu.displayY || pu.y) - 4, 32, 32);
    ctx.restore();
  });

  // Obstacles
  obstacles.forEach(o => {
    const colorMap = { 1: PALETTE.obstacle, 2: PALETTE.obstacleDark, 3: "#ff8080" };
    const sprite = SPRITES[o.sprite];
    if (sprite) drawSprite(ctx, sprite, o.x, o.y, colorMap);
  });

  // Particles
  particles.forEach(pt => {
    ctx.save();
    ctx.globalAlpha = pt.life;
    ctx.fillStyle = pt.color;
    ctx.fillRect(Math.floor(pt.x), Math.floor(pt.y), pt.size, pt.size);
    ctx.restore();
  });

  // Player
  renderPlayer(ctx, state);

  // Shield aura
  if (state.shield) {
    ctx.save();
    ctx.globalAlpha = 0.3 + 0.2 * Math.sin(state.frame * 0.2);
    ctx.strokeStyle = PALETTE.shield;
    ctx.lineWidth = 3;
    ctx.strokeRect(p.x - 4, p.y - 4, p.w + 8, p.h + 8);
    ctx.restore();
  }

  // HUD
  renderHUD(ctx, state);

  // Scanlines
  drawScanlines(ctx, CANVAS_W, CANVAS_H);
}

function renderPlayer(ctx, state) {
  const p = state.player;
  let sprite, colorMap;
  const mainColor = state.speedBoost ? PALETTE.speed : state.shrink ? PALETTE.shrink : PALETTE.player;
  const shadeColor = state.speedBoost ? "#009955" : state.shrink ? "#cc5500" : PALETTE.playerShade;
  const lightColor = state.speedBoost ? "#aaffcc" : state.shrink ? "#ffcc88" : PALETTE.playerLight;
  colorMap = { 1: mainColor, 2: shadeColor, 3: lightColor };

  if (p.sliding) {
    sprite = SPRITES.runner_slide;
    drawSprite(ctx, sprite, p.x, p.y + 28, colorMap);
  } else if (!p.onGround) {
    sprite = SPRITES.runner_run1;
    const scale = state.shrink ? 0.6 : 1;
    drawSprite(ctx, sprite, p.x, p.y, colorMap, scale);
  } else {
    sprite = p.frame === 0 ? SPRITES.runner_run1 : SPRITES.runner_run2;
    const scale = state.shrink ? 0.6 : 1;
    drawSprite(ctx, sprite, p.x, p.y, colorMap, scale);
  }
}

function renderHUD(ctx, state) {
  // Score
  drawPixelText(ctx, `SCORE ${Math.floor(state.score).toString().padStart(6, "0")}`, 12, 24, 10, PALETTE.ui);
  drawPixelText(ctx, `BEST  ${state.hiScore.toString().padStart(6, "0")}`, 12, 42, 8, PALETTE.uiDim);

  // Speed indicator
  const speedPct = (state.speed - 5) / (MAX_SPEED - 5);
  drawPixelText(ctx, "SPD", CANVAS_W - 120, 24, 8, PALETTE.uiDim);
  ctx.fillStyle = "#333";
  ctx.fillRect(CANVAS_W - 84, 14, 72, 8);
  ctx.fillStyle = speedPct > 0.7 ? PALETTE.player : PALETTE.speed;
  ctx.fillRect(CANVAS_W - 84, 14, Math.floor(72 * speedPct), 8);

  // Active powerup indicators
  let puX = CANVAS_W / 2 - 60;
  if (state.shield) {
    const pct = state.shieldTimer / 300;
    drawPowerupBar(ctx, puX, 8, PALETTE.shield, "SHD", pct);
    puX += 80;
  }
  if (state.speedBoost) {
    const pct = state.speedTimer / 300;
    drawPowerupBar(ctx, puX, 8, PALETTE.speed, "SPD", pct);
    puX += 80;
  }
  if (state.shrink) {
    const pct = state.shrinkTimer / 300;
    drawPowerupBar(ctx, puX, 8, PALETTE.shrink, "SML", pct);
  }
}

function drawPowerupBar(ctx, x, y, color, label, pct) {
  drawPixelText(ctx, label, x, y + 10, 7, color);
  ctx.fillStyle = "#333";
  ctx.fillRect(x + 28, y + 2, 44, 6);
  ctx.fillStyle = color;
  ctx.fillRect(x + 28, y + 2, Math.floor(44 * pct), 6);
}

function drawMountainRange(ctx, offset, w, baseY, color, count, variance) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_H);
  const step = (w + 400) / count;
  for (let i = -1; i <= count + 1; i++) {
    const x = ((i * step - (offset % (w + 400))) + w + 400) % (w + 400) - 200;
    const peakY = baseY - (i % 3 === 0 ? variance : variance * 0.6);
    if (i === -1) ctx.moveTo(x, CANVAS_H);
    ctx.lineTo(x - step / 2, CANVAS_H);
    ctx.lineTo(x, peakY);
  }
  ctx.lineTo(w + 200, CANVAS_H);
  ctx.closePath();
  ctx.fill();
}

export function renderStartScreen(ctx, hiScore, frame) {
  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, PALETTE.sky1);
  grad.addColorStop(1, PALETTE.sky2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Title box
  const pulse = Math.sin(frame * 0.05) * 4;
  drawPixelRect(ctx, 80, 40 + pulse, CANVAS_W - 160, 80, PALETTE.ground2, PALETTE.player);
  drawPixelText(ctx, "PIXEL RUNNER", CANVAS_W / 2, 90 + pulse, 18, PALETTE.player, "center");

  drawPixelText(ctx, "PRESS SPACE OR TAP TO START", CANVAS_W / 2, 160, 8,
    frame % 60 < 40 ? PALETTE.ui : PALETTE.uiDim, "center");

  drawPixelText(ctx, `HI-SCORE: ${hiScore}`, CANVAS_W / 2, 200, 9, PALETTE.coin, "center");

  drawPixelText(ctx, "SPACE / UP = JUMP   DOWN = SLIDE", CANVAS_W / 2, 240, 7, PALETTE.uiDim, "center");
  drawPixelText(ctx, "DOUBLE JUMP AVAILABLE IN AIR", CANVAS_W / 2, 258, 7, PALETTE.uiDim, "center");

  drawScanlines(ctx, CANVAS_W, CANVAS_H);
}

export function renderDeadScreen(ctx, state, frame) {
  // Darken
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawPixelRect(ctx, 120, 60, CANVAS_W - 240, 140, PALETTE.sky1, PALETTE.player);
  drawPixelText(ctx, "GAME OVER", CANVAS_W / 2, 105, 18, PALETTE.player, "center");
  drawPixelText(ctx, `SCORE: ${Math.floor(state.score)}`, CANVAS_W / 2, 135, 10, PALETTE.coin, "center");
  drawPixelText(ctx, `BEST:  ${state.hiScore}`, CANVAS_W / 2, 158, 9, PALETTE.ui, "center");
  drawPixelText(ctx, "PRESS SPACE TO RETRY", CANVAS_W / 2, 195,
    8, frame % 60 < 40 ? PALETTE.ui : PALETTE.uiDim, "center");

  drawScanlines(ctx, CANVAS_W, CANVAS_H);
}
