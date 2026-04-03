import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Sub-apps — must come before the portfolio catch-all
const subApps = [
  { route: '/spendr',      dir: 'apps/spendr/build' },
  { route: '/skies',       dir: 'apps/skies/build' },
  { route: '/pixel-runner', dir: 'apps/pixel-runner/build' },
  { route: '/world-forge', dir: 'apps/world-forge/build' },
]

for (const { route, dir } of subApps) {
  const buildDir = path.join(__dirname, dir)
  app.use(route, express.static(buildDir))
  // SPA fallback for each sub-app (handles client-side routing inside the app)
  app.get(`${route}/*`, (_req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'))
  })
}

// Portfolio (Vite build → dist/)
app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Running on port ${PORT}`))