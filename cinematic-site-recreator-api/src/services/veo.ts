import { GoogleGenAI } from '@google/genai'
import type { VideoGenRequest, VideoGenResult } from '../types/index.js'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY ?? '' })

const POLL_INTERVAL_MS = 10_000
const MAX_POLLS = 30 // 5 minutes max

export async function generateVideo(req: VideoGenRequest): Promise<VideoGenResult> {
  // Start generation — returns a long-running operation
  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: req.prompt,
    config: {
      aspectRatio: req.aspectRatio ?? '16:9',
      numberOfVideos: 1,
      durationSeconds: req.durationSeconds ?? 8,
    },
  })

  // Poll until done
  let polls = 0
  while (!operation.done && polls < MAX_POLLS) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))
    operation = await ai.operations.getVideosOperation({ operation })
    polls++
  }

  if (!operation.done) {
    // Return pending — client can poll /api/video-status
    return {
      conceptId: req.conceptId,
      operationName: operation.name ?? '',
      status: 'pending',
      prompt: req.prompt,
    }
  }

  const video = operation.response?.generatedVideos?.[0]
  const videoUri = video?.video?.uri

  return {
    conceptId: req.conceptId,
    operationName: operation.name ?? '',
    status: videoUri ? 'complete' : 'failed',
    videoUrl: videoUri,
    prompt: req.prompt,
  }
}

// Poll an existing operation (client-facing for long generations)
export async function pollVideoOperation(operationName: string): Promise<VideoGenResult> {
  const operation = await ai.operations.getVideosOperation({
    operation: { name: operationName },
  })

  const video = operation.response?.generatedVideos?.[0]
  const videoUri = video?.video?.uri

  return {
    conceptId: 0,
    operationName: operationName,
    status: operation.done ? (videoUri ? 'complete' : 'failed') : 'pending',
    videoUrl: videoUri,
    prompt: '',
  }
}
