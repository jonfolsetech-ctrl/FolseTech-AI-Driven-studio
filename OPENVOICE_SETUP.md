# OpenVoice Integration Guide

## 🎤 What is OpenVoice?

**OpenVoice** by MyShell.ai is an instant voice cloning model that:
- ✅ Clones any voice from a short audio sample
- ✅ Provides granular tone control
- ✅ Supports multiple languages
- ✅ Produces natural-sounding singing voices
- ✅ Fast processing (usually < 30 seconds)

Perfect for converting speech to singing while preserving your unique voice characteristics!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Replicate API Token

1. Go to https://replicate.com
2. Sign up (free tier available)
3. Navigate to **Account → API Tokens**
4. Copy your token (starts with `r8_`)

### Step 2: Configure Your Project

Edit `.env.local` and add these lines:

```env
USE_OPENVOICE=true
REPLICATE_API_TOKEN=r8_your_actual_token_here
OPENVOICE_MODEL_VERSION=myshell-ai/openvoice
```

### Step 3: Restart Server

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

### Step 4: Test It!

1. Open http://localhost:3000/speech-to-singing
2. Record or upload your speech audio
3. Add lyrics (optional but recommended)
4. Adjust voice settings
5. Click **"Convert to Singing"**
6. Download your singing voice!

---

## ⚙️ Configuration Options

### Basic Setup (Recommended)
```env
USE_OPENVOICE=true
REPLICATE_API_TOKEN=r8_your_token_here
```

### Advanced Setup
```env
USE_OPENVOICE=true
REPLICATE_API_TOKEN=r8_your_token_here
OPENVOICE_MODEL_VERSION=myshell-ai/openvoice
MAX_AUDIO_DURATION=30000
AUDIO_SAMPLE_RATE=44100
```

---

## 🎛️ How to Use

### 1. Record Your Voice
- Speak clearly for 5-30 seconds
- Say the words you want to be sung
- Or upload an existing audio file

### 2. Add Lyrics (Recommended)
```
Paste your song lyrics here
Each line will be sung
With your cloned voice
```

### 3. Adjust Settings

**Voice Type:**
- Male/Female/Child - Target characteristics
- Custom - Keep original voice tone

**Pitch Shift:** -12 to +12 semitones
- Negative = Lower pitch
- Positive = Higher pitch

**Style:**
- Pop, R&B, Rock, Jazz, Opera
- Affects singing expression

**Auto-Tune:** 0-100%
- 0% = Natural pitch variation
- 100% = Perfect pitch (robotic)
- 50-75% = Sweet spot

### 4. Convert & Download
- Click "Convert to Singing"
- Wait ~10-30 seconds
- Download your singing voice!

---

## 💡 Tips for Best Results

### Input Audio Quality
✅ **Do:**
- Use a clear, noise-free recording
- Speak at normal conversational pace
- Use a decent microphone
- Record in a quiet room

❌ **Don't:**
- Use noisy/distorted audio
- Whisper or shout
- Include background music
- Use very long recordings (>30s)

### Lyrics Tips
✅ **Do:**
- Provide the actual words you're saying
- Match the timing of your speech
- Use clear punctuation
- Keep it concise

❌ **Don't:**
- Leave lyrics empty (if possible)
- Use unrelated text
- Include stage directions or notes

### Voice Settings
**For Natural Singing:**
- Pitch Shift: ±2 to ±4 semitones
- Auto-Tune: 50-70%
- Style: Pop or R&B

**For Character Voices:**
- Pitch Shift: ±6 to ±12 semitones
- Auto-Tune: 30-50%
- Style: Experiment!

**For Perfect Pitch:**
- Pitch Shift: 0
- Auto-Tune: 80-100%
- Style: Pop

---

## 🎵 Workflow Examples

### Example 1: Cover Song
```
1. Record yourself speaking the lyrics
2. Paste the full lyrics in the text box
3. Set pitch to match original song key
4. Auto-tune: 60-70%
5. Convert and download
6. Mix with instrumental track
```

### Example 2: Original Song
```
1. Write your lyrics
2. Record yourself reading them naturally
3. Paste lyrics in the app
4. Choose style (Pop, R&B, etc.)
5. Adjust pitch to your preference
6. Convert and use in your DAW
```

### Example 3: Quick Demo
```
1. Upload any speech audio
2. Set to "Auto" voice type
3. Skip lyrics (optional)
4. Convert to hear your voice singing
5. Experiment with different settings
```

---

## 📊 OpenVoice vs Other Models

| Feature | OpenVoice | So-VITS-SVC | RVC | DiffSinger |
|---------|-----------|-------------|-----|------------|
| **Speed** | ⚡⚡⚡ Fast | ⚡⚡ Medium | ⚡⚡ Medium | ⚡ Slow |
| **Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Ease of Use** | ✅ Easy | ⚠️ Medium | ⚠️ Medium | ⚠️ Hard |
| **Voice Clone** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Tone Control** | ✅ Advanced | ⚠️ Basic | ⚠️ Basic | ❌ No |
| **Lyrics Support** | ✅ Yes | ⚠️ Limited | ⚠️ Limited | ✅ Yes |

**Recommendation:** Use **OpenVoice** for quick, high-quality voice cloning with great tone control!

---

## 🔧 Troubleshooting

### "No AI service configured"
**Solution:** Make sure you have:
1. `USE_OPENVOICE=true` in `.env.local`
2. `REPLICATE_API_TOKEN=r8_...` with valid token
3. Restarted the dev server

### "API Token Invalid"
**Solution:** 
1. Check token format (should start with `r8_`)
2. Verify token is active at https://replicate.com/account
3. Regenerate if needed

### "Conversion Timeout"
**Solution:**
1. Reduce audio length (<30 seconds)
2. Check internet connection
3. Try again (API might be busy)

### "Poor Audio Quality"
**Solution:**
1. Use cleaner input audio
2. Reduce background noise
3. Adjust auto-tune to 50-70%
4. Try different pitch shift values

### Console Shows "Using mock conversion"
**Solution:**
1. Check `.env.local` file exists (not `.env.local.example`)
2. Verify `USE_OPENVOICE=true` is uncommented
3. Confirm `REPLICATE_API_TOKEN` is set
4. Restart server: `Ctrl+C` then `npm run dev`

---

## 💰 Costs

**Replicate Pricing:**
- Free tier: ~100-500 predictions/month
- Pay-as-you-go: ~$0.00002-0.002 per second
- Average conversion: $0.01-0.05 per audio

**Example:**
- 10-second audio = ~$0.02
- 30-second audio = ~$0.06
- 100 conversions = ~$2-5

Very affordable for most use cases!

---

## 🔗 Resources

- **OpenVoice Model**: https://replicate.com/myshell-ai/openvoice
- **Replicate Docs**: https://replicate.com/docs
- **MyShell.ai**: https://myshell.ai/
- **GitHub**: https://github.com/myshell-ai/OpenVoice

---

## 🎯 Next Steps

Now that OpenVoice is integrated:

1. ✅ Test with your voice
2. ✅ Experiment with settings
3. ✅ Try different styles
4. ✅ Create full songs!

For other AI models and options, see [DIFFSVS_SETUP.md](./DIFFSVS_SETUP.md)

---

**Happy Singing! 🎤🎵**
