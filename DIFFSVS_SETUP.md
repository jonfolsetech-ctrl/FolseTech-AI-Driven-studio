# DiffSVS Integration Guide

This guide explains how to integrate DiffSVS (Singing Voice Synthesis) into your FolseTech AI Studio.

## Overview

DiffSVS enables realistic speech-to-singing conversion using AI models. The integration supports multiple backends:

1. **Replicate API** (Recommended for production)
2. **Custom DiffSVS Server** (Self-hosted)
3. **Mock Mode** (Development/testing)

## Quick Start

### 1. Configuration

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure your preferred service.

### 2. Option A: Using Replicate API (Easiest)

1. Sign up at [Replicate](https://replicate.com)
2. Get your API token from the dashboard
3. Add to `.env.local`:

```env
REPLICATE_API_TOKEN=r8_your_token_here
REPLICATE_MODEL_VERSION=model-version-id
```

#### Available Models on Replicate:

- **So-VITS-SVC**: Voice conversion model for singing
- **RVC (Retrieval-based Voice Conversion)**: High-quality voice cloning
- **Bark**: Text-to-audio model with singing capabilities
- **DiffSinger**: Dedicated singing voice synthesis

Search for "singing voice" or "voice conversion" on Replicate to find suitable models.

### 3. Option B: Self-Hosted DiffSVS Server

If you want to run your own DiffSVS server:

#### Docker Setup (Recommended)

```bash
# Clone DiffSVS repository
git clone https://github.com/MoonInTheRiver/DiffSinger
cd DiffSinger

# Build and run with Docker
docker build -t diffsvs .
docker run -p 8000:8000 diffsvs
```

#### Configuration

Add to `.env.local`:

```env
DIFFSVS_API_URL=http://localhost:8000
DIFFSVS_API_KEY=your_optional_api_key
```

#### API Endpoints

Your DiffSVS server should provide:

- `POST /api/svs/convert` - Main conversion endpoint
  - Form data: `audio`, `pitch_shift`, `voice_type`, `style`, `key`, `autotune`, `lyrics`
  - Returns: Audio file (WAV/MP3/WebM)

### 4. Option C: Development Mode (No Setup Required)

The system will automatically use mock mode if no API is configured. This is perfect for:

- UI/UX development
- Testing the interface
- Demonstrations without AI processing

## Features

### Voice Parameters

- **Voice Type**: Male, Female, Child, Custom
- **Pitch Shift**: -12 to +12 semitones
- **Auto-Tune Amount**: 0-100% correction strength

### Musical Settings

- **Key**: C Major, G Major, D Major, A Minor, E Minor, etc.
- **Style**: Pop, R&B, Rock, Jazz, Opera
- **Lyrics**: Optional text to guide the singing

### Audio Processing

- **Max Duration**: 30 seconds (configurable)
- **Sample Rate**: 44.1kHz
- **Supported Formats**: WebM, MP3, WAV, OGG

## Usage in Code

### Frontend Example

```typescript
const formData = new FormData()
formData.append('audio', audioBlob)
formData.append('voiceType', 'Female')
formData.append('pitchShift', '2')
formData.append('key', 'C Major')
formData.append('style', 'Pop')
formData.append('autoTune', '75')
formData.append('lyrics', 'Your lyrics here')

const response = await fetch('/api/speech-to-singing', {
  method: 'POST',
  body: formData,
})

const audioBlob = await response.blob()
```

### API Integration

The main conversion function automatically selects the best available method:

```typescript
import { convertSpeechToSinging } from '@/lib/diffsvs'

const result = await convertSpeechToSinging({
  audioBuffer: myAudioBuffer,
  voiceType: 'Female',
  pitchShift: 2,
  key: 'C Major',
  style: 'Pop',
  autoTune: 75,
  lyrics: 'Your lyrics here',
})
```

## Advanced Configuration

### Custom Model Training

To use your own trained voice models:

1. Train your model using DiffSinger or So-VITS-SVC
2. Export the model checkpoint
3. Host it on your server or upload to Replicate
4. Update the model version in your `.env.local`

### Lyrics Processing

The system preprocesses lyrics to improve singing quality:

```typescript
import { preprocessLyrics } from '@/lib/diffsvs'

const info = preprocessLyrics(`
  This is my song
  These are my lyrics
`)

console.log(info)
// { lines: [...], words: [...], syllables: 10 }
```

### Validation

Audio parameters are validated before processing:

```typescript
import { validateAudioParams } from '@/lib/diffsvs'

const validation = validateAudioParams(params)
if (!validation.valid) {
  console.error(validation.errors)
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REPLICATE_API_TOKEN` | Optional | Replicate API authentication token |
| `REPLICATE_MODEL_VERSION` | Optional | Specific model version to use |
| `DIFFSVS_API_URL` | Optional | Custom DiffSVS server URL |
| `DIFFSVS_API_KEY` | Optional | Custom server API key |
| `MAX_AUDIO_DURATION` | Optional | Max audio length in ms (default: 30000) |
| `AUDIO_SAMPLE_RATE` | Optional | Audio sample rate (default: 44100) |

## Troubleshooting

### "No AI service configured" Warning

This means you're in mock mode. To enable real AI:

1. Configure at least one service (Replicate or custom server)
2. Restart your development server
3. Check the console for "Using [Service] for conversion"

### Audio Quality Issues

- Ensure input audio is clear and high quality
- Adjust pitch shift carefully (±3 semitones usually works best)
- Provide accurate lyrics for better phoneme alignment
- Try different voice types and styles

### Timeout Errors

For long audio files:

1. Increase `MAX_AUDIO_DURATION` in `.env.local`
2. Use a more powerful model
3. Split audio into smaller chunks

### API Rate Limits

Replicate and other services have rate limits:

- Free tier: Usually 100-500 requests/month
- Consider caching results
- Implement request queuing for high traffic

## Performance Tips

1. **Audio Preprocessing**: Normalize and denoise input audio
2. **Batch Processing**: Process multiple files in parallel
3. **Caching**: Store converted audio to avoid re-processing
4. **CDN**: Use a CDN for serving converted audio files
5. **Webhooks**: Use async processing for long conversions

## Resources

- [DiffSinger GitHub](https://github.com/MoonInTheRiver/DiffSinger)
- [So-VITS-SVC](https://github.com/svc-develop-team/so-vits-svc)
- [Replicate Documentation](https://replicate.com/docs)
- [RVC Documentation](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI)

## Support

For issues or questions:

1. Check the console logs for detailed error messages
2. Verify your API keys and configuration
3. Test with mock mode first
4. Review the API documentation for your chosen service

## License

This integration code is part of FolseTech AI Studio. Check individual AI model licenses for commercial use restrictions.
