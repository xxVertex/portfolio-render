# 🕹️ Pixel Runner

A retro pixel art infinite runner built with React + HTML5 Canvas. No game engine — pure hand-crafted pixel art drawn programmatically.

## Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Jump | SPACE / ↑ / W | Tap |
| Double Jump | SPACE / ↑ again (mid-air) | Tap again |
| Slide / Duck | ↓ / S | Swipe down |
| Start / Retry | SPACE | Tap |

## Features

- 🏃 **Pixel art runner** with run, jump, and slide animations
- 🦘 **Double jump** — second jump available in mid-air
- 🛡️ **Slide / Duck** — avoid high obstacles
- 💎 **3 Power-ups:**
  - 🔵 **Shield** — absorbs one hit
  - ⚡ **Speed boost** — 2x speed + 2x score for ~5s
  - 🟠 **Shrink** — become tiny to dodge obstacles
- 🪙 **Coins** — +10 points each, some require jumping
- 📈 **Progressive difficulty** — speed increases over time
- 🏆 **Leaderboard** — top 10 high scores saved locally
- 📺 **CRT / scanline effect** — authentic retro feel
- 🌄 **Parallax backgrounds** — layered pixel mountains

## Getting Started

```bash
git clone https://github.com/xxVertex/pixel-runner.git
cd pixel-runner
npm install
npm start
```

## Build

```bash
npm run build
```

Deploy the `/build` folder to Vercel or Netlify.

## Project Structure

```
src/
├── game/
│   ├── constants.js    # Game config, palette, pixel art sprites
│   ├── engine.js       # Game loop, physics, collision, rendering
│   └── renderer.js     # Low-level pixel draw helpers
├── components/
│   ├── GameCanvas.jsx  # Canvas + input + game loop controller
│   └── Leaderboard.jsx # Score table UI
├── App.jsx             # Shell layout
└── App.css             # Retro pixel UI design system
```

## License

MIT
