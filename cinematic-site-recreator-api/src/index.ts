import 'node:process'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { analyzeRouter } from './routes/analyze.js'
import { imagenRouter } from './routes/imagen.js'
import { veoRouter } from './routes/veo.js'

// Load .env manually (no dotenv dep — use Node 20.6+ --env-file or set vars in shell)
// For dev: create a .env file and run: node --env-file=.env node_modules/.bin/tsx src/index.ts
// Or install dotenv: npm i dotenv and uncomment below:
// import 'dotenv/config'

const app = new Hono()

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173'
const PORT = Number(process.env.PORT ?? 3001)

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: [CORS_ORIGIN, 'http://localhost:5173', 'http://localhost:4173'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
)

// Health check
app.get('/health', c =>
  c.json({
    status: 'ok',
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    google: !!process.env.GOOGLE_AI_API_KEY,
    timestamp: new Date().toISOString(),
  }),
)

app.route('/api/analyze', analyzeRouter)
app.route('/api/generate-image', imagenRouter)
app.route('/api/video', veoRouter)

app.notFound(c => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
})

console.log(`
╔══════════════════════════════════════╗
║   Cinematic Site Recreator API       ║
║   http://localhost:${PORT}               ║
╚══════════════════════════════════════╝
  Anthropic: ${process.env.ANTHROPIC_API_KEY ? '✓ configured' : '✗ missing ANTHROPIC_API_KEY'}
  Google AI: ${process.env.GOOGLE_AI_API_KEY ? '✓ configured' : '✗ missing GOOGLE_AI_API_KEY'}
`)

serve({ fetch: app.fetch, port: PORT })
