import { NextRequest, NextResponse } from 'next/server'
import { generateBeat, validateBeatParams } from '@/lib/beat-generator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { genre, bpm, mood, stylePrompt, duration, key, instruments } = body

    // Validate parameters
    const validation = validateBeatParams({ genre, bpm, mood, stylePrompt, duration, key, instruments })
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.errors },
        { status: 400 }
      )
    }

    console.log('Generating beat with params:', { genre, bpm, mood, stylePrompt, duration })

    // Generate the beat
    const result = await generateBeat({
      genre,
      bpm,
      mood,
      stylePrompt,
      duration,
      key,
      instruments,
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Return the result
    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      metadata: result.metadata,
    })

  } catch (error) {
    console.error('Beat generation API error:', error)
    return NextResponse.json(
      { 
        error: 'Beat generation failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}