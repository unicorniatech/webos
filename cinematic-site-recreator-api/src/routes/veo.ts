import { Hono } from 'hono'
import { generateVideo, pollVideoOperation } from '../services/veo.js'
import type { VideoGenRequest } from '../types/index.js'

export const veoRouter = new Hono()

// Start video generation (may take 1–5 minutes)
veoRouter.post('/generate', async c => {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return c.json({ error: 'GOOGLE_AI_API_KEY not configured' }, 503)
  }

  const body = await c.req.json<VideoGenRequest>()

  if (!body.prompt) {
    return c.json({ error: 'prompt is required' }, 400)
  }

  try {
    console.log(`[veo] Starting video generation for concept ${body.conceptId}...`)
    const result = await generateVideo(body)
    console.log(`[veo] Status: ${result.status}`)
    return c.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Veo error'
    console.error(`[veo] Error: ${message}`)
    return c.json({ error: message }, 500)
  }
})

// Poll operation status
veoRouter.get('/status/:operationName', async c => {
  const operationName = decodeURIComponent(c.req.param('operationName'))

  try {
    const result = await pollVideoOperation(operationName)
    return c.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Poll error'
    return c.json({ error: message }, 500)
  }
})
