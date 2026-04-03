// Canvas / display
export const CANVAS_W = 800;
export const CANVAS_H = 300;
export const PIXEL = 4; // base pixel size for art
export const GROUND_Y = 220;
export const FPS = 60;

// Physics
export const GRAVITY = 0.6;
export const JUMP_FORCE = -13;
export const DOUBLE_JUMP_FORCE = -11;
export const SLIDE_DURATION = 40; // frames

// Game speed
export const INITIAL_SPEED = 5;
export const SPEED_INCREMENT = 0.0015;
export const MAX_SPEED = 18;

// Scoring
export const POINTS_PER_FRAME = 0.1;
export const POWERUP_DURATION = 300; // frames (~5s)

// Colors — NES-inspired 4-layer palette
export const PALETTE = {
  sky1:    "#1a1a2e",  // deep night sky
  sky2:    "#16213e",
  mountain:"#0f3460",
  ground1: "#533483",
  ground2: "#2d1b69",
  ground3: "#1a0a3d",
  player:  "#e94560",
  playerShade: "#c73652",
  playerLight: "#ff6b8a",
  obstacle:"#e94560",
  obstacleDark:"#a01030",
  coin:    "#ffd700",
  coinShine:"#fff8a0",
  shield:  "#00d4ff",
  speed:   "#00ff88",
  shrink:  "#ff8c00",
  star:    "#ffffff",
  ui:      "#ffffff",
  uiDim:   "#888888",
  scanline:"rgba(0,0,0,0.08)",
};

// Pixel art sprites (2D arrays, each cell = one PIXEL block)
// 0=transparent, 1=main, 2=shade, 3=light

export const SPRITES = {
  // 8x12 runner standing
  runner_stand: [
    [0,0,1,1,1,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,2,1,1,2,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,0,0,1,0,0],
    [0,0,1,0,0,1,0,0],
    [0,1,1,0,0,1,1,0],
    [0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0],
  ],
  // 8x12 runner mid-run (legs spread)
  runner_run1: [
    [0,0,1,1,1,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,2,1,1,2,1,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,0,0,0],
    [1,1,0,0,0,1,1,0],
    [1,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0],
  ],
  // 8x12 runner other leg
  runner_run2: [
    [0,0,1,1,1,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,2,1,1,2,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,1,1,0],
    [0,1,1,0,0,0,0,1],
    [0,1,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  // 12x6 sliding
  runner_slide: [
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,1,3,3,1,1,1,1,1,1,0],
    [0,0,0,1,1,2,1,1,2,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  // Tall obstacle (cactus-like)
  obstacle_tall: [
    [0,1,1,0],
    [0,1,1,0],
    [1,1,1,0],
    [1,1,1,1],
    [0,1,1,1],
    [0,1,1,0],
    [0,1,1,0],
    [0,1,1,0],
  ],
  // Wide obstacle (low wall)
  obstacle_wide: [
    [1,1,1,1,1,1],
    [1,2,2,2,2,1],
    [1,2,1,1,2,1],
    [1,1,1,1,1,1],
  ],
  // Double obstacle
  obstacle_double: [
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [1,1,1,0,0,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,1,1,0],
  ],
  // Coin (4x4)
  coin: [
    [0,1,1,0],
    [1,3,3,1],
    [1,3,3,1],
    [0,1,1,0],
  ],
  // Shield powerup (6x6)
  powerup_shield: [
    [0,1,1,1,1,0],
    [1,1,3,3,1,1],
    [1,3,3,3,3,1],
    [1,3,3,3,3,1],
    [0,1,3,3,1,0],
    [0,0,1,1,0,0],
  ],
  // Speed powerup (6x6)
  powerup_speed: [
    [0,0,1,0,0,0],
    [0,1,1,1,0,0],
    [1,1,1,1,1,0],
    [0,1,1,1,1,1],
    [0,0,1,1,1,0],
    [0,0,0,1,0,0],
  ],
  // Shrink powerup
  powerup_shrink: [
    [1,0,0,0,0,1],
    [0,1,0,0,1,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,1,0,0,1,0],
    [1,0,0,0,0,1],
  ],
};
