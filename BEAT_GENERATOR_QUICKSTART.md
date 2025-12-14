# Beat Generator - Quick Reference

## 🎵 Generate a Beat in 3 Steps

1. **Configure** (one-time setup)
   ```bash
   # Add to .env.local
   REPLICATE_API_TOKEN=your_token_here
   ```

2. **Select Parameters**
   - Genre: Hip Hop, Trap, EDM, Pop, Rock, Jazz
   - BPM: 60-200
   - Mood: Energetic, Chill, Dark, Uplifting, Aggressive
   - Style: Optional description

3. **Generate!**
   Click "Generate Beat" and wait ~30-60 seconds

## 🔌 Available Services

| Service | Speed | Quality | Cost | Best For |
|---------|-------|---------|------|----------|
| **MusicGen** ✅ | Fast | High | Free | Hip-hop, EDM, Pop |
| Stable Audio | Medium | Professional | Paid | Commercial |
| Suno AI | Slow | Excellent | Paid | Complex music |

## 💡 Quick Tips

**Best Prompts:**
- "trap with heavy 808s and hi-hat rolls"
- "lofi hip-hop with vinyl crackle"
- "aggressive EDM drop with sawtooth synths"

**BPM Guide:**
- Hip-Hop: 80-100
- Trap: 130-150
- House: 120-130
- D&B: 160-180

**Genres Available:**
- Hip Hop, Trap, EDM, Pop, Rock, Jazz

## 🚀 API Usage

```typescript
// Generate programmatically
import { generateBeat } from '@/lib/beat-generator'

const beat = await generateBeat({
  genre: 'trap',
  bpm: 140,
  mood: 'dark',
  stylePrompt: 'heavy 808s with ethereal synths',
  duration: 30
})

console.log(beat.audioUrl) // Download URL
```

## 🔧 Configuration Options

```bash
# .env.local

# Required
REPLICATE_API_TOKEN=your_token_here

# Optional (defaults to musicgen)
BEAT_GENERATOR_SERVICE=musicgen
```

## ⚠️ Common Issues

**"Token not configured"**
→ Add `REPLICATE_API_TOKEN` to `.env.local`

**"Generation timeout"**
→ Wait a bit and try again, or simplify prompt

**Mock mode active**
→ Normal for development without API token

## 📊 Features

✅ Multiple AI services (MusicGen, Stable Audio, Suno)  
✅ Auto prompt building from parameters  
✅ Smart fallback to mock mode  
✅ Parameter validation  
✅ Download generated beats  
✅ Integrate with Speech-to-Singing mixer  

## 🎯 Example Workflows

**1. Quick Beat for Testing:**
```
Genre: Hip Hop
BPM: 90
Mood: Chill
→ Generate
```

**2. Custom Trap Beat:**
```
Genre: Trap
BPM: 140
Mood: Dark
Style: "Travis Scott type beat with heavy 808s"
→ Generate
```

**3. EDM Production:**
```
Genre: EDM
BPM: 128
Mood: Energetic
Style: "big room house drop with sawtooth synths"
→ Generate
```

## 🔗 Integration

**Use with Speech-to-Singing:**
1. Generate beat here
2. Download
3. Go to `/speech-to-singing`
4. Upload as instrumental
5. Mix with vocals

**Save to Library** (coming soon):
- Generate → Save → Access anytime

## 💰 Pricing (Replicate)

- **Free tier:** Limited runs/month
- **Paid:** ~$0.0075 per 30-second beat
- **No subscription:** Pay only for what you use

## 📖 Full Documentation

See `BEAT_GENERATOR_GUIDE.md` for complete details.

---

**Need Help?**
- Check console for errors
- Verify API token
- Try mock mode first
- Read full guide
