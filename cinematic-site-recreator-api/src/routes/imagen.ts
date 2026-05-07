import { Hono } from 'hono'
import { generateImage } from '../services/imagen.js'
import type { ImageGenRequest } from '../types/index.js'

export const imagenRouter = new Hono()

imagenRouter.post('/', async c => {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return c.json({ error: 'GOOGLE_AI_API_KEY not configured' }, 503)
  }

  const body = await c.req.json<ImageGenRequest>()

  if (!body.prompt) {
    return c.json({ error: 'prompt is required' }, 400)
  }

  try {
    console.log(`[imagen] Generating image for concept ${body.conceptId}...`)
    const result = await generateImage(body)
    console.log(`[imagen] Done — ${result.mimeType}`)
    return c.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Imagen error'
    console.error(`[imagen] Error: ${message}`)
    return c.json({ error: message }, 500)
  }
})
