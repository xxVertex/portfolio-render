import { PIXEL, PALETTE } from "./constants";

// Draw a sprite grid at (x,y) with a color map
export function drawSprite(ctx, sprite, x, y, colorMap, scale = 1) {
  const p = PIXEL * scale;
  sprite.forEach((row, ry) => {
    row.forEach((cell, rx) => {
      if (cell === 0) return;
      ctx.fillStyle = colorMap[cell] || "#ff00ff";
      ctx.fillRect(
        Math.floor(x + rx * p),
        Math.floor(y + ry * p),
        p, p
      );
    });
  });
}

// Draw pixelated text (uses canvas font)
export function drawPixelText(ctx, text, x, y, size = 10, color = PALETTE.ui, align = "left") {
  ctx.save();
  ctx.font = `${size}px 'Press Start 2P', monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.imageSmoothingEnabled = false;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Draw a pixel rect with optional border
export function drawPixelRect(ctx, x, y, w, h, fill, border) {
  ctx.fillStyle = fill;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = PIXEL / 2;
    ctx.strokeRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }
}

// Scanline CRT effect
export function drawScanlines(ctx, w, h) {
  ctx.fillStyle = PALETTE.scanline;
  for (let y = 0; y < h; y += 3) {
    ctx.fillRect(0, y, w, 1);
  }
}

// Stars in background
export function drawStars(ctx, stars) {
  stars.forEach(s => {
    ctx.fillStyle = `rgba(255,255,255,${s.brightness})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });
}

// Parallax mountain silhouette
export function drawMountains(ctx, offset, w, h, color, peaks) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, h);
  peaks.forEach(p => {
    const x = ((p.x - offset * p.speed) % (w + 200) + w + 200) % (w + 200) - 100;
    ctx.lineTo(x, p.y);
  });
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

// Ground tiles
export function drawGround(ctx, offset, w, groundY, tileW, colors) {
  const [c1, c2, c3] = colors;
  // Base ground
  ctx.fillStyle = c1;
  ctx.fillRect(0, groundY, w, 8);
  // stripe
  ctx.fillStyle = c2;
  ctx.fillRect(0, groundY + 8, w, 12);
  // deep
  ctx.fillStyle = c3;
  ctx.fillRect(0, groundY + 20, w, 80);

  // Moving ground detail tiles
  ctx.fillStyle = c2;
  for (let x = -(offset % tileW); x < w; x += tileW) {
    ctx.fillRect(x, groundY + 2, tileW - 4, 4);
  }
}
