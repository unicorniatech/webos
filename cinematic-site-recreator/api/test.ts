import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    // Test that OpenAI import works
    const OpenAI = (await import('openai')).default
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const models = await client.models.list()
    res.json({
      status: 'openai_ok',
      model_count: models.data.length,
      openai_key: !!process.env.OPENAI_API_KEY,
    })
  } catch (err) {
    res.json({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
