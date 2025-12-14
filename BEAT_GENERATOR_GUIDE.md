# Beat Generator Plugin System - Setup Guide

## Overview

The FolseTech AI-Driven Studio now includes a powerful beat generator plugin system that integrates with multiple AI music generation services.

## Supported Services

### 1. **MusicGen (Meta)** ✅ Recommended
- **Provider:** Meta AI via Replicate
- **Pricing:** Free tier available
- **Quality:** High-quality instrumental beats
- **Speed:** ~30-60 seconds generation time
- **Models:** stereo-large, melody, large
- **Best For:** Hip-hop, EDM, Pop beats

### 2. **Stable Audio**
- **Provider:** Stability AI via Replicate
- **Quality:** Professional-grade audio
- **Speed:** ~20-40 seconds
- **Best For:** Commercial music production

### 3. **Suno AI**
- **Quality:** State-of-the-art music generation
- **Features:** Advanced style control
- **Best For:** Complex compositions

## Quick Start

### 1. Configure API Token

Add your Replicate API token to `.env.local`:

```bash
REPLICATE_API_TOKEN=your_token_here
```

Get your token from: https://replicate.com/account/api-tokens

### 2. Choose Service (Optional)

Select your preferred service in `.env.local`:

```bash
# Options: 'musicgen', 'stable-audio', 'suno'
BEAT_GENERATOR_SERVICE=musicgen
```

Default is **MusicGen** (recommended for best free results).

### 3. Generate Your First Beat

1. Navigate to `/beat-generator`
2. Select:
   - **Genre:** Hip Hop, Trap, EDM, Pop, Rock, Jazz
   - **BPM:** 60-200 (tempo)
   - **Mood:** Energetic, Chill, Dark, Uplifting, Aggressive
3. Add **Style Description** (optional) for custom beats
4. Click **Generate Beat**

## Features

### Smart Prompt Building

The plugin automatically builds optimized prompts from your parameters:

```typescript
// Example: User inputs
genre: "trap"
bpm: 140
mood: "dark"
stylePrompt: "heavy 808s with ethereal synths"

// Generated prompt:
"dark trap instrumental beat, at 140 BPM, heavy 808s with ethereal synths"
```

### Automatic Fallback

If the AI service fails, the system gracefully falls back to mock mode:

```
1. Try selected service (MusicGen, etc.)
2. If error → fallback to mock generation
3. Display helpful error messages
4. Continue working without interruption
```

### Parameter Validation

The system validates all inputs before generation:

- ✅ Genre selection required
- ✅ BPM range: 60-200
- ✅ Duration: 5-180 seconds
- ✅ Style prompt: Optional

## API Usage

### Generate Beat Programmatically

```typescript
import { generateBeat } from '@/lib/beat-generator'

const result = await generateBeat({
  genre: 'hip-hop',
  bpm: 120,
  mood: 'chill',
  stylePrompt: 'lofi with jazzy piano',
  duration: 30,
  key: 'C minor',
  instruments: ['piano', 'drums', 'bass']
})

console.log(result.audioUrl) // Download URL
console.log(result.metadata) // Beat info
```

### API Endpoint

**POST** `/api/beats`

Request body:
```json
{
  "genre": "trap",
  "bpm": 140,
  "mood": "dark",
  "stylePrompt": "heavy 808s",
  "duration": 30
}
```

Response:
```json
{
  "success": true,
  "audioUrl": "https://...",
  "metadata": {
    "title": "Beat_1234567890",
    "genre": "trap",
    "bpm": 140,
    "duration": 30
  }
}
```

## Advanced Configuration

### Custom Instruments

Specify instruments in your API call:

```typescript
const result = await generateBeat({
  genre: 'jazz',
  bpm: 95,
  mood: 'chill',
  instruments: ['saxophone', 'piano', 'upright bass', 'brush drums']
})
```

### Musical Key

Set the key for better music theory compatibility:

```typescript
const result = await generateBeat({
  genre: 'pop',
  bpm: 128,
  mood: 'uplifting',
  key: 'E major'
})
```

### Service-Specific Settings

Configure per-service options in the library:

```typescript
// In lib/beat-generator.ts
const response = await fetch('https://api.replicate.com/v1/predictions', {
  body: JSON.stringify({
    version: 'meta/musicgen:latest',
    input: {
      prompt: prompt,
      duration: 30,
      model_version: 'stereo-large', // ← Customize
      output_format: 'wav'
    }
  })
})
```

## Troubleshooting

### "REPLICATE_API_TOKEN not configured"

**Solution:** Add your token to `.env.local`:
```bash
REPLICATE_API_TOKEN=r8_your_token_here
```

### Generation Timeout

**Cause:** Network issues or service overload

**Solution:** 
- Check internet connection
- Try again in a few minutes
- Switch to different service in `.env.local`

### "Generation failed" Error

**Solution:**
- Verify API token is valid
- Check Replicate account credits
- Review prompt complexity
- Try simpler parameters first

### Mock Mode Active

If you see "Mock generation mode":
- Real AI is not configured
- Add valid `REPLICATE_API_TOKEN` to `.env.local`
- Restart dev server: `npm run dev`

## Best Practices

### Prompt Engineering

For best results:

✅ **Good Prompts:**
- "trap beat with heavy 808s and hi-hat rolls"
- "lofi hip-hop with vinyl crackle and jazz chords"
- "aggressive EDM drop with sawtooth synths"

❌ **Avoid:**
- Too generic: "make a beat"
- Conflicting styles: "classical trap"
- Over-complex: 10+ descriptors

### BPM Guidelines

- **Hip-Hop:** 80-100 BPM
- **Trap:** 130-150 BPM
- **House/EDM:** 120-130 BPM
- **Drum & Bass:** 160-180 BPM
- **Dubstep:** 140 BPM (half-time feel)

### Performance Tips

1. **Start Simple:** Test with basic parameters first
2. **Cache Results:** Save generated beats to avoid re-generation
3. **Batch Generation:** Generate multiple variations at once
4. **Monitor Credits:** Check Replicate usage limits

## Integration with Other Features

### Mix with Vocals

Generate a beat, then use it as instrumental in Speech-to-Singing:

1. Generate beat → Download
2. Go to `/speech-to-singing`
3. Upload audio + generated beat
4. Mix together with volume controls

### Save to Library

Generated beats can be saved to your library (coming soon):

```typescript
<button onClick={handleSaveToLibrary}>
  Save to Library
</button>
```

## Cost & Limits

### Replicate Pricing (MusicGen)

- **Free Tier:** Limited runs per month
- **Pay-as-you-go:** $0.00025 per second of audio
- **Example:** 30-second beat ≈ $0.0075

### Rate Limits

- **Concurrent requests:** 1 at a time (free tier)
- **Generation time:** 30-120 seconds
- **Max duration:** 180 seconds per beat

## Architecture

### Plugin Structure

```
lib/
  beat-generator.ts         # Core plugin logic
    ├── generateBeat()      # Main entry point
    ├── generateWithMusicGen()
    ├── generateWithStableAudio()
    ├── generateWithSuno()
    ├── mockGeneration()    # Fallback
    └── buildMusicPrompt()  # Prompt builder

app/
  api/beats/route.ts        # API endpoint
  beat-generator/page.tsx   # UI interface
```

### Data Flow

```
User Input
   ↓
UI Component (page.tsx)
   ↓
API Route (/api/beats)
   ↓
Beat Generator Library (lib/beat-generator.ts)
   ↓
Replicate API
   ↓
Poll for Results
   ↓
Return Audio URL
   ↓
Display in UI
```

## Future Enhancements

- [ ] Stem separation (drums, bass, melody)
- [ ] Real-time preview during generation
- [ ] Beat library with tags/search
- [ ] Remix/variation generation
- [ ] MIDI export
- [ ] Multi-track export
- [ ] Collaboration features
- [ ] Genre learning from uploads

## Support

For issues or questions:
1. Check this guide
2. Review console logs
3. Check Replicate API status
4. Verify environment variables
5. Test with mock mode first

## Example Use Cases

### 1. Quick Demo Beat
```typescript
await generateBeat({
  genre: 'hip-hop',
  bpm: 90,
  mood: 'chill'
})
```

### 2. Custom Style Beat
```typescript
await generateBeat({
  genre: 'trap',
  bpm: 140,
  mood: 'dark',
  stylePrompt: 'Travis Scott type beat with heavy 808s, hi-hat rolls, and ambient pads'
})
```

### 3. Genre-Specific Production
```typescript
await generateBeat({
  genre: 'edm',
  bpm: 128,
  mood: 'energetic',
  key: 'A minor',
  instruments: ['saw synth', 'sub bass', 'drums'],
  duration: 60
})
```

---

**Plugin Version:** 1.0.0  
**Last Updated:** 2024  
**Tested With:** MusicGen (Meta), Replicate API
