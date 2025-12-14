/**
 * Beat Generator Plugin System
 * Supports multiple AI music generation services
 */

export interface BeatGenerationParams {
  genre: string
  bpm: number
  mood: string
  stylePrompt?: string
  duration?: number
  key?: string
  instruments?: string[]
}

export interface BeatGenerationResponse {
  audioUrl?: string
  audioBuffer?: ArrayBuffer
  metadata?: {
    title: string
    genre: string
    bpm: number
    duration: number
    key?: string
  }
  error?: string
}

/**
 * Generate beat using Suno AI via Replicate
 */
export async function generateWithSuno(
  params: BeatGenerationParams
): Promise<BeatGenerationResponse> {
  const apiToken = process.env.REPLICATE_API_TOKEN

  if (!apiToken || apiToken === 'ADD_YOUR_TOKEN_HERE') {
    throw new Error('REPLICATE_API_TOKEN not configured')
  }

  try {
    const prompt = buildMusicPrompt(params)
    console.log('Generating beat with Suno AI:', prompt)

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: process.env.SUNO_MODEL_VERSION || 'latest',
        input: {
          prompt: prompt,
          duration: params.duration || 30,
          make_instrumental: true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Suno API error: ${response.status} - ${errorText}`)
    }

    const prediction = await response.json()

    // Poll for completion
    let result = prediction
    let attempts = 0
    const maxAttempts = 120 // 2 minutes timeout

    while (result.status === 'starting' || result.status === 'processing') {
      if (attempts >= maxAttempts) {
        throw new Error('Beat generation timeout')
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Token ${apiToken}`,
          },
        }
      )
      result = await pollResponse.json()
      attempts++
    }

    if (result.status === 'succeeded' && result.output) {
      return {
        audioUrl: result.output,
        metadata: {
          title: `Beat_${Date.now()}`,
          genre: params.genre,
          bpm: params.bpm,
          duration: params.duration || 30,
          key: params.key,
        },
      }
    } else {
      throw new Error(result.error || 'Beat generation failed')
    }
  } catch (error) {
    console.error('Suno generation error:', error)
    throw error
  }
}

/**
 * Generate beat using Stable Audio (Replicate)
 */
export async function generateWithStableAudio(
  params: BeatGenerationParams
): Promise<BeatGenerationResponse> {
  const apiToken = process.env.REPLICATE_API_TOKEN

  if (!apiToken || apiToken === 'ADD_YOUR_TOKEN_HERE') {
    throw new Error('REPLICATE_API_TOKEN not configured')
  }

  try {
    const prompt = buildMusicPrompt(params)
    console.log('Generating beat with Stable Audio:', prompt)

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/stable-audio',
        input: {
          prompt: prompt,
          seconds_total: params.duration || 30,
          steps: 100,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Stable Audio API error: ${response.statusText}`)
    }

    const prediction = await response.json()

    // Poll for completion
    let result = prediction
    let attempts = 0

    while (result.status === 'starting' || result.status === 'processing') {
      if (attempts >= 120) throw new Error('Generation timeout')
      await new Promise(resolve => setTimeout(resolve, 1000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        { headers: { 'Authorization': `Token ${apiToken}` } }
      )
      result = await pollResponse.json()
      attempts++
    }

    if (result.status === 'succeeded' && result.output) {
      return {
        audioUrl: result.output,
        metadata: {
          title: `Beat_${Date.now()}`,
          genre: params.genre,
          bpm: params.bpm,
          duration: params.duration || 30,
        },
      }
    } else {
      throw new Error(result.error || 'Generation failed')
    }
  } catch (error) {
    console.error('Stable Audio error:', error)
    throw error
  }
}

/**
 * Generate beat using MusicGen (Meta)
 */
export async function generateWithMusicGen(
  params: BeatGenerationParams
): Promise<BeatGenerationResponse> {
  const apiToken = process.env.REPLICATE_API_TOKEN

  if (!apiToken || apiToken === 'ADD_YOUR_TOKEN_HERE') {
    throw new Error('REPLICATE_API_TOKEN not configured')
  }

  try {
    const prompt = buildMusicPrompt(params)
    console.log('Generating beat with MusicGen:', prompt)

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'meta/musicgen:latest',
        input: {
          prompt: prompt,
          duration: params.duration || 30,
          model_version: 'stereo-large',
          output_format: 'wav',
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`MusicGen API error: ${response.statusText}`)
    }

    const prediction = await response.json()

    // Poll for completion
    let result = prediction
    let attempts = 0

    while (result.status === 'starting' || result.status === 'processing') {
      if (attempts >= 120) throw new Error('Generation timeout')
      await new Promise(resolve => setTimeout(resolve, 1000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        { headers: { 'Authorization': `Token ${apiToken}` } }
      )
      result = await pollResponse.json()
      attempts++
    }

    if (result.status === 'succeeded' && result.output) {
      return {
        audioUrl: result.output,
        metadata: {
          title: `Beat_${Date.now()}`,
          genre: params.genre,
          bpm: params.bpm,
          duration: params.duration || 30,
        },
      }
    } else {
      throw new Error(result.error || 'Generation failed')
    }
  } catch (error) {
    console.error('MusicGen error:', error)
    throw error
  }
}

/**
 * Mock beat generation for development
 */
export async function mockGeneration(
  params: BeatGenerationParams
): Promise<BeatGenerationResponse> {
  console.log('Using mock beat generation')
  console.log('Generation params:', params)

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Return mock data
  return {
    metadata: {
      title: `Mock_Beat_${Date.now()}`,
      genre: params.genre,
      bpm: params.bpm,
      duration: params.duration || 30,
      key: params.key,
    },
  }
}

/**
 * Main beat generation function - automatically selects best method
 */
export async function generateBeat(
  params: BeatGenerationParams
): Promise<BeatGenerationResponse> {
  const hasValidToken = process.env.REPLICATE_API_TOKEN && 
                        process.env.REPLICATE_API_TOKEN !== 'ADD_YOUR_TOKEN_HERE'

  const service = process.env.BEAT_GENERATOR_SERVICE || 'musicgen'

  if (!hasValidToken) {
    console.warn('No AI service configured, using mock generation')
    console.info('💡 To enable real AI: Add REPLICATE_API_TOKEN to .env.local')
    return await mockGeneration(params)
  }

  try {
    switch (service) {
      case 'suno':
        console.log('Using Suno AI for beat generation')
        return await generateWithSuno(params)
      
      case 'stable-audio':
        console.log('Using Stable Audio for beat generation')
        return await generateWithStableAudio(params)
      
      case 'musicgen':
      default:
        console.log('Using MusicGen for beat generation')
        return await generateWithMusicGen(params)
    }
  } catch (error) {
    console.error('Beat generation failed, falling back to mock:', error)
    return await mockGeneration(params)
  }
}

/**
 * Build music prompt from parameters
 */
function buildMusicPrompt(params: BeatGenerationParams): string {
  const parts: string[] = []

  // Genre and mood
  parts.push(`${params.mood} ${params.genre} instrumental beat`)

  // BPM
  parts.push(`at ${params.bpm} BPM`)

  // Style description
  if (params.stylePrompt) {
    parts.push(params.stylePrompt)
  }

  // Key if specified
  if (params.key) {
    parts.push(`in ${params.key}`)
  }

  // Instruments if specified
  if (params.instruments && params.instruments.length > 0) {
    parts.push(`featuring ${params.instruments.join(', ')}`)
  }

  return parts.join(', ')
}

/**
 * Get available beat generation services
 */
export function getAvailableServices(): string[] {
  const services = ['musicgen', 'stable-audio', 'suno']
  const hasToken = process.env.REPLICATE_API_TOKEN && 
                   process.env.REPLICATE_API_TOKEN !== 'ADD_YOUR_TOKEN_HERE'
  
  return hasToken ? services : ['mock']
}

/**
 * Validate beat generation parameters
 */
export function validateBeatParams(params: BeatGenerationParams): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!params.genre) {
    errors.push('Genre is required')
  }

  if (params.bpm < 60 || params.bpm > 200) {
    errors.push('BPM must be between 60 and 200')
  }

  if (params.duration && (params.duration < 5 || params.duration > 180)) {
    errors.push('Duration must be between 5 and 180 seconds')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
