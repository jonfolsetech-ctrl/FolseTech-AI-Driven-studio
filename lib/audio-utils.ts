/**
 * Audio utilities for DiffSVS integration
 */

/**
 * Convert audio file to base64 data URL
 */
export function audioBufferToDataUrl(
  buffer: ArrayBuffer,
  mimeType: string = 'audio/webm'
): string {
  const base64 = Buffer.from(buffer).toString('base64')
  return `data:${mimeType};base64,${base64}`
}

/**
 * Convert data URL to ArrayBuffer
 */
export async function dataUrlToArrayBuffer(dataUrl: string): Promise<ArrayBuffer> {
  const response = await fetch(dataUrl)
  return await response.arrayBuffer()
}

/**
 * Estimate audio duration from buffer size
 * Note: This is a rough estimate and may not be accurate
 */
export function estimateAudioDuration(
  bufferSize: number,
  sampleRate: number = 44100,
  bitDepth: number = 16,
  channels: number = 2
): number {
  const bytesPerSample = bitDepth / 8
  const bytesPerSecond = sampleRate * bytesPerSample * channels
  return (bufferSize / bytesPerSecond) * 1000 // in milliseconds
}

/**
 * Normalize audio volume
 */
export function normalizeAudioBuffer(buffer: Float32Array, targetLevel: number = 0.9): Float32Array {
  const maxAmplitude = Math.max(...Array.from(buffer).map(Math.abs))
  if (maxAmplitude === 0) return buffer

  const gain = targetLevel / maxAmplitude
  return buffer.map(sample => sample * gain)
}

/**
 * Convert pitch shift in semitones to frequency ratio
 */
export function semitoneToFrequencyRatio(semitones: number): number {
  return Math.pow(2, semitones / 12)
}

/**
 * Musical key to MIDI note mapping
 */
export const keyToMidiNote: Record<string, number> = {
  'C Major': 60,
  'C# Major': 61,
  'D Major': 62,
  'D# Major': 63,
  'E Major': 64,
  'F Major': 65,
  'F# Major': 66,
  'G Major': 67,
  'G# Major': 68,
  'A Major': 69,
  'A# Major': 70,
  'B Major': 71,
  'C Minor': 60,
  'D Minor': 62,
  'E Minor': 64,
  'F Minor': 65,
  'G Minor': 67,
  'A Minor': 69,
  'B Minor': 71,
}

/**
 * Get musical key information
 */
export function getKeyInfo(key: string): {
  root: string
  mode: 'major' | 'minor'
  midiNote: number
} {
  const parts = key.split(' ')
  const root = parts[0]
  const mode = parts[1]?.toLowerCase() as 'major' | 'minor'
  const midiNote = keyToMidiNote[key] || 60

  return { root, mode, midiNote }
}

/**
 * Validate audio file type
 */
export function isValidAudioType(mimeType: string): boolean {
  const validTypes = [
    'audio/webm',
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/wave',
    'audio/ogg',
    'audio/flac',
    'audio/aac',
    'audio/m4a',
  ]
  return validTypes.some(type => mimeType.includes(type))
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Format duration in milliseconds to MM:SS
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Detect voice characteristics from audio buffer
 * This is a placeholder for more advanced analysis
 */
export function detectVoiceCharacteristics(buffer: ArrayBuffer): {
  estimatedPitch: 'low' | 'medium' | 'high'
  suggestedVoiceType: string
  quality: 'poor' | 'fair' | 'good' | 'excellent'
} {
  // Simple heuristic based on buffer size
  const size = buffer.byteLength
  
  return {
    estimatedPitch: size < 500000 ? 'high' : size < 1000000 ? 'medium' : 'low',
    suggestedVoiceType: size < 750000 ? 'Female' : 'Male',
    quality: size < 200000 ? 'poor' : size < 500000 ? 'fair' : size < 1000000 ? 'good' : 'excellent',
  }
}

/**
 * Split lyrics into phonetic segments
 * Basic implementation - can be enhanced with NLP
 */
export function lyricsToPhonemes(lyrics: string): string[] {
  // Remove punctuation and split into words
  const words = lyrics
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  // Basic syllable splitting
  const phonemes: string[] = []
  for (const word of words) {
    // Split on vowel groups for rough syllable estimation
    const syllables = word.split(/(?=[aeiou])/i).filter(Boolean)
    phonemes.push(...syllables)
  }

  return phonemes
}

/**
 * Apply fade in/out to audio buffer
 */
export function applyFade(
  buffer: Float32Array,
  fadeInSamples: number,
  fadeOutSamples: number
): Float32Array {
  const result = new Float32Array(buffer)

  // Fade in
  for (let i = 0; i < fadeInSamples && i < result.length; i++) {
    result[i] *= i / fadeInSamples
  }

  // Fade out
  const startFadeOut = result.length - fadeOutSamples
  for (let i = 0; i < fadeOutSamples && startFadeOut + i < result.length; i++) {
    result[startFadeOut + i] *= 1 - i / fadeOutSamples
  }

  return result
}

/**
 * Mix two audio buffers
 */
export function mixAudioBuffers(
  buffer1: Float32Array,
  buffer2: Float32Array,
  ratio: number = 0.5
): Float32Array {
  const length = Math.max(buffer1.length, buffer2.length)
  const result = new Float32Array(length)

  for (let i = 0; i < length; i++) {
    const sample1 = i < buffer1.length ? buffer1[i] : 0
    const sample2 = i < buffer2.length ? buffer2[i] : 0
    result[i] = sample1 * ratio + sample2 * (1 - ratio)
  }

  return result
}
