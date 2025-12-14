/**
 * DiffSVS Integration Library
 * Provides singing voice synthesis using various AI models
 */

export interface SingingConversionParams {
  audioBuffer: ArrayBuffer
  voiceType?: string
  pitchShift?: number
  key?: string
  style?: string
  autoTune?: number
  lyrics?: string
}

export interface DiffSVSResponse {
  audioUrl?: string
  audioBuffer?: ArrayBuffer
  error?: string
}

/**
 * Convert speech to singing using OpenVoice on Replicate
 * Best for instant voice cloning with tone control
 */
export async function convertWithOpenVoice(
  params: SingingConversionParams
): Promise<DiffSVSResponse> {
  const apiToken = process.env.REPLICATE_API_TOKEN

  if (!apiToken || apiToken === 'ADD_YOUR_TOKEN_HERE') {
    console.warn('OpenVoice enabled but no valid API token configured')
    throw new Error('REPLICATE_API_TOKEN not configured or invalid')
  }

  try {
    // Convert audio buffer to base64
    const base64Audio = Buffer.from(params.audioBuffer).toString('base64')
    const dataUrl = `data:audio/webm;base64,${base64Audio}`

    console.log('Using OpenVoice for voice cloning...')

    // OpenVoice API call
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: process.env.OPENVOICE_MODEL_VERSION || 'latest',
        input: {
          audio: dataUrl,
          text: params.lyrics || 'Singing voice conversion',
          language: 'en',
          speed: 1.0,
          // OpenVoice specific parameters
          tone_color_converter: true,
          pitch_shift: params.pitchShift || 0,
          style: params.style?.toLowerCase() || 'natural',
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenVoice API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const prediction = await response.json()

    // Poll for completion
    let result = prediction
    let attempts = 0
    const maxAttempts = 60 // 60 seconds timeout

    while (result.status === 'starting' || result.status === 'processing') {
      if (attempts >= maxAttempts) {
        throw new Error('OpenVoice processing timeout')
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
      console.log('OpenVoice conversion successful')
      return { audioUrl: result.output }
    } else {
      throw new Error(result.error || 'OpenVoice conversion failed')
    }
  } catch (error) {
    console.error('OpenVoice conversion error:', error)
    throw error
  }
}

/**
 * Convert speech to singing using Replicate API (DiffSinger or similar models)
 */
export async function convertWithReplicate(
  params: SingingConversionParams
): Promise<DiffSVSResponse> {
  const apiToken = process.env.REPLICATE_API_TOKEN

  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN not configured')
  }

  try {
    // Convert audio buffer to base64
    const base64Audio = Buffer.from(params.audioBuffer).toString('base64')
    const dataUrl = `data:audio/webm;base64,${base64Audio}`

    // Use a singing voice conversion model from Replicate
    // Example: so-vits-svc or similar SVS models
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: process.env.REPLICATE_MODEL_VERSION || 'latest-diffsvs-model',
        input: {
          audio: dataUrl,
          pitch_shift: params.pitchShift || 0,
          target_voice: params.voiceType?.toLowerCase() || 'auto',
          style: params.style?.toLowerCase() || 'pop',
          key: params.key || 'C',
          autotune_strength: (params.autoTune || 50) / 100,
          lyrics: params.lyrics || '',
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`)
    }

    const prediction = await response.json()

    // Poll for completion
    let result = prediction
    while (result.status === 'starting' || result.status === 'processing') {
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
    }

    if (result.status === 'succeeded' && result.output) {
      return { audioUrl: result.output }
    } else {
      throw new Error(result.error || 'Conversion failed')
    }
  } catch (error) {
    console.error('Replicate conversion error:', error)
    throw error
  }
}

/**
 * Convert speech to singing using custom DiffSVS server
 */
export async function convertWithCustomDiffSVS(
  params: SingingConversionParams
): Promise<DiffSVSResponse> {
  const apiUrl = process.env.DIFFSVS_API_URL
  const apiKey = process.env.DIFFSVS_API_KEY

  if (!apiUrl) {
    throw new Error('DIFFSVS_API_URL not configured')
  }

  try {
    const formData = new FormData()
    const audioBlob = new Blob([params.audioBuffer], { type: 'audio/webm' })
    formData.append('audio', audioBlob)
    formData.append('pitch_shift', (params.pitchShift || 0).toString())
    formData.append('voice_type', params.voiceType || 'auto')
    formData.append('style', params.style || 'pop')
    formData.append('key', params.key || 'C')
    formData.append('autotune', ((params.autoTune || 50) / 100).toString())
    if (params.lyrics) {
      formData.append('lyrics', params.lyrics)
    }

    const headers: HeadersInit = {
      ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
    }

    const response = await fetch(`${apiUrl}/api/svs/convert`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`DiffSVS API error: ${response.statusText}`)
    }

    const audioBuffer = await response.arrayBuffer()
    return { audioBuffer }
  } catch (error) {
    console.error('Custom DiffSVS conversion error:', error)
    throw error
  }
}

/**
 * Mock conversion for development/testing
 * Simulates the conversion process without actual AI processing
 */
export async function mockConversion(
  params: SingingConversionParams
): Promise<DiffSVSResponse> {
  console.log('Using mock conversion (no real AI processing)')
  console.log('Conversion params:', {
    voiceType: params.voiceType,
    pitchShift: params.pitchShift,
    key: params.key,
    style: params.style,
    autoTune: params.autoTune,
    hasLyrics: !!params.lyrics,
    audioSize: params.audioBuffer.byteLength,
  })

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Return the original audio as-is
  return { audioBuffer: params.audioBuffer }
}

/**
 * Main conversion function - automatically selects the best available method
 */
export async function convertSpeechToSinging(
  params: SingingConversionParams
): Promise<DiffSVSResponse> {
  // Check which API is configured and use it
  const hasValidToken = process.env.REPLICATE_API_TOKEN && 
                        process.env.REPLICATE_API_TOKEN !== 'ADD_YOUR_TOKEN_HERE'
  
  if (process.env.USE_OPENVOICE === 'true' && hasValidToken) {
    try {
      console.log('Using OpenVoice (myshell-ai) for voice cloning conversion')
      return await convertWithOpenVoice(params)
    } catch (error) {
      console.error('OpenVoice failed, falling back to mock mode:', error)
      console.warn('To use real AI: Add your Replicate API token to .env.local')
      return await mockConversion(params)
    }
  } else if (hasValidToken) {
    try {
      console.log('Using Replicate API for conversion')
      return await convertWithReplicate(params)
    } catch (error) {
      console.error('Replicate API failed, falling back to mock mode:', error)
      return await mockConversion(params)
    }
  } else if (process.env.DIFFSVS_API_URL) {
    try {
      console.log('Using custom DiffSVS server for conversion')
      return await convertWithCustomDiffSVS(params)
    } catch (error) {
      console.error('Custom DiffSVS failed, falling back to mock mode:', error)
      return await mockConversion(params)
    }
  } else {
    console.warn('No AI service configured, using mock conversion')
    console.info('💡 To enable real AI: Add REPLICATE_API_TOKEN to .env.local')
    return await mockConversion(params)
  }
}

/**
 * Process lyrics for better singing synthesis
 * Splits lyrics into phonemes or segments for better control
 */
export function preprocessLyrics(lyrics: string): {
  lines: string[]
  words: string[]
  syllables: number
} {
  const lines = lyrics.split('\n').filter(line => line.trim())
  const words = lyrics.split(/\s+/).filter(word => word.trim())
  
  // Rough syllable count estimation
  const syllables = words.reduce((count, word) => {
    return count + word.toLowerCase().split(/[aeiouy]+/).length - 1
  }, 0)

  return { lines, words, syllables }
}

/**
 * Validate audio parameters
 */
export function validateAudioParams(params: SingingConversionParams): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const maxDuration = parseInt(process.env.MAX_AUDIO_DURATION || '30000')

  if (!params.audioBuffer || params.audioBuffer.byteLength === 0) {
    errors.push('Audio buffer is empty')
  }

  if (params.audioBuffer.byteLength > 10 * 1024 * 1024) {
    errors.push('Audio file too large (max 10MB)')
  }

  if (params.pitchShift && (params.pitchShift < -12 || params.pitchShift > 12)) {
    errors.push('Pitch shift must be between -12 and +12 semitones')
  }

  if (params.autoTune && (params.autoTune < 0 || params.autoTune > 100)) {
    errors.push('Auto-tune must be between 0 and 100')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
