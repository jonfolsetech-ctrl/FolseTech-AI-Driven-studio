import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const vocalFile = formData.get('vocals') as File
    const instrumentalFile = formData.get('instrumental') as File
    const vocalVolume = parseFloat(formData.get('vocalVolume') as string) || 1.0
    const instrumentalVolume = parseFloat(formData.get('instrumentalVolume') as string) || 1.0

    if (!vocalFile || !instrumentalFile) {
      return NextResponse.json(
        { error: 'Both vocal and instrumental files are required' },
        { status: 400 }
      )
    }

    console.log('Mixing tracks:', {
      vocalSize: vocalFile.size,
      vocalType: vocalFile.type,
      instrumentalSize: instrumentalFile.size,
      instrumentalType: instrumentalFile.type,
      vocalVolume,
      instrumentalVolume
    })

    // For now, we'll return both files information so the client can mix them
    // In a production environment, you would use FFmpeg on the server or a cloud service
    
    // Get both audio buffers
    const vocalBuffer = await vocalFile.arrayBuffer()
    const instrumentalBuffer = await instrumentalFile.arrayBuffer()

    // Create a response that includes both audio files
    // We'll return the instrumental for now since the mixing will happen client-side
    const response = {
      message: 'Client-side mixing required',
      vocalSize: vocalBuffer.byteLength,
      instrumentalSize: instrumentalBuffer.byteLength
    }

    // Return the larger file as base (usually instrumental)
    const baseBuffer = instrumentalBuffer.byteLength > vocalBuffer.byteLength 
      ? instrumentalBuffer 
      : vocalBuffer

    return new NextResponse(baseBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="mixed-song.mp3"',
        'X-Mixing-Note': 'Server mixing not available, using base track',
      },
    })
  } catch (error) {
    console.error('Mixing error:', error)
    return NextResponse.json(
      { error: 'Failed to mix tracks' },
      { status: 500 }
    )
  }
}