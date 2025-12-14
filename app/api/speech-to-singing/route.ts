import { NextRequest, NextResponse } from 'next/server'
import { 
  convertSpeechToSinging, 
  validateAudioParams, 
  preprocessLyrics 
} from '@/lib/diffsvs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const voiceType = formData.get('voiceType') as string
    const pitchShift = formData.get('pitchShift') as string
    const key = formData.get('key') as string
    const style = formData.get('style') as string
    const autoTune = formData.get('autoTune') as string
    const lyrics = formData.get('lyrics') as string

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Convert the audio file to a buffer
    const audioBuffer = await audioFile.arrayBuffer()

    // Prepare conversion parameters
    const conversionParams = {
      audioBuffer,
      voiceType,
      pitchShift: parseInt(pitchShift) || 0,
      key,
      style,
      autoTune: parseInt(autoTune) || 50,
      lyrics,
    }

    // Validate parameters
    const validation = validateAudioParams(conversionParams)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Process lyrics if provided
    let lyricsInfo = null
    if (lyrics) {
      lyricsInfo = preprocessLyrics(lyrics)
    }

    console.log('DiffSVS Processing with settings:', {
      voiceType,
      pitchShift,
      key,
      style,
      autoTune,
      lyrics: lyrics ? `${lyrics.substring(0, 50)}...` : 'none',
      lyricsInfo,
      fileSize: audioFile.size,
      fileType: audioFile.type
    })
    console.log('DiffSVS Processing with settings:', {
      voiceType,
      pitchShift,
      key,
      style,
      autoTune,
      lyrics: lyrics ? `${lyrics.substring(0, 50)}...` : 'none',
      lyricsInfo,
      fileSize: audioFile.size,
      fileType: audioFile.type
    })

    // Convert speech to singing using DiffSVS integration
    const result = await convertSpeechToSinging(conversionParams)

    // Handle the result
    let responseBuffer: ArrayBuffer
    let contentType = 'audio/webm'

    if (result.audioBuffer) {
      // Direct buffer response (from custom DiffSVS or mock)
      responseBuffer = result.audioBuffer
    } else if (result.audioUrl) {
      // Fetch from URL (from Replicate or other services)
      const audioResponse = await fetch(result.audioUrl)
      responseBuffer = await audioResponse.arrayBuffer()
      contentType = audioResponse.headers.get('content-type') || 'audio/mp3'
    } else {
      throw new Error('No audio output received from conversion')
    }

    console.log('Conversion successful:', {
      outputSize: responseBuffer.byteLength,
      contentType,
    })
    
    // Return the converted audio
    return new NextResponse(responseBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="singing-output.webm"',
        'X-Conversion-Method': result.audioUrl ? 'remote' : 'local',
      },
    })
  } catch (error) {
    console.error('Speech to singing error:', error)
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    )
  }
}