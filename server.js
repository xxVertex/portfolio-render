const express = require('express')
const path = require('path')

const app = express()

const subApps = [
  { route: '/spendr',       dir: 'apps/spendr/build' },
  { route: '/skies',        dir: 'apps/skies/build' },
  { route: '/pixel-runner', dir: 'apps/pixel-runner/build' },
  { route: '/world-forge',  dir: 'apps/world-forge/build' },
]

for (const { route, dir } of subApps) {
  const buildDir = path.join(__dirname, dir)
  app.use(route, express.static(buildDir))
  app.get(`${route}/*`, (_req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'))
  })
}

app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

module.exports = app

// local / Render
if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`Running on port ${PORT}`))
}
