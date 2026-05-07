import { GoogleGenAI } from '@google/genai'
import type { ImageGenRequest, ImageGenResult } from '../types/index.js'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY ?? '' })

export async function generateImage(req: ImageGenRequest): Promise<ImageGenResult> {
  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-001',
    prompt: req.prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: req.aspectRatio ?? '16:9',
      outputMimeType: 'image/jpeg',
      // Safe for commercial use
      personGeneration: 'allow_adult',
    },
  })

  const generated = response.generatedImages?.[0]
  if (!generated?.image?.imageBytes) {
    throw new Error('Imagen 3 returned no image data')
  }

  return {
    conceptId: req.conceptId,
    base64: generated.image.imageBytes,
    mimeType: 'image/jpeg',
    prompt: req.prompt,
  }
}
