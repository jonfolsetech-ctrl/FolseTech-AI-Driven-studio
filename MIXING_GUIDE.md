# How to Mix Singing Voice with MP3

## 🎵 Quick Guide

Your app now supports **automatic mixing** of singing voice with MP3 backing tracks!

---

## Method 1: Speech-to-Singing Page (All-in-One)

This is the easiest way - everything in one place!

### Steps:

1. **Go to Speech-to-Singing**: http://localhost:3001/speech-to-singing

2. **Create Your Singing Voice**:
   - Record or upload your speech
   - Add lyrics
   - Adjust voice settings
   - Click "Convert to Singing"
   - Download result

3. **Mix with Instrumental** (New Feature!):
   - After conversion, scroll down to "Mix with Instrumental" section
   - Click "Upload Instrumental/Backing Track"
   - Select your MP3 file
   - Adjust volume levels:
     - **Vocal Volume**: 100% (your singing)
     - **Instrumental Volume**: 80% (backing track)
   - Click "Mix Tracks Together"
   - Download your complete song!

### Volume Tips:
- **Balanced Mix**: Vocal 100%, Instrumental 80%
- **Vocal Focus**: Vocal 120%, Instrumental 60%
- **Karaoke Style**: Vocal 150%, Instrumental 50%
- **Background Vocal**: Vocal 60%, Instrumental 100%

---

## Method 2: Mixing Page (Separate)

Use the dedicated mixing page for more control:

1. **Go to Mixing**: http://localhost:3001/mixing

2. **Upload Files**:
   - Upload your singing voice (from speech-to-singing)
   - Upload your instrumental MP3

3. **Adjust & Mix**:
   - Set volume levels
   - Click "Mix Tracks"
   - Download result

---

## Method 3: Manual (Using External Tools)

If you prefer offline editing:

### Free Tools:
- **Audacity** (Desktop, Windows/Mac/Linux)
- **GarageBand** (Mac/iOS)
- **Ocenaudio** (Desktop, simple)
- **WavePad** (Desktop)

### Online Tools:
- **AudioMass** - https://audiomass.co/
- **TwistedWave** - https://twistedwave.com/online
- **Audio Trimmer** - https://audiotrimmer.com/

### Steps:
1. Download your singing voice
2. Import both files into the tool
3. Align them on separate tracks
4. Adjust volumes
5. Export as MP3

---

## 🎯 Workflow Example

### Creating a Cover Song:

```
1. Find instrumental MP3 of the song
   ↓
2. Record yourself speaking the lyrics
   ↓
3. Convert to singing voice (Speech-to-Singing page)
   ↓
4. Upload instrumental in "Mix with Instrumental" section
   ↓
5. Adjust vocal: 100%, instrumental: 80%
   ↓
6. Click "Mix Tracks Together"
   ↓
7. Download your full cover song!
```

### Creating an Original Song:

```
1. Create/download instrumental beat
   ↓
2. Write your lyrics
   ↓
3. Record yourself reading the lyrics
   ↓
4. Convert to singing voice
   ↓
5. Mix with instrumental
   ↓
6. Download and share!
```

---

## 💡 Pro Tips

### For Best Results:

**Audio Quality:**
- Use high-quality MP3 instrumental (256kbps or higher)
- Keep singing voice and instrumental at similar quality
- Avoid distorted or low-quality backing tracks

**Volume Balance:**
- Start with vocals at 100%, instrumental at 80%
- Adjust based on the song style
- Listen to the preview before downloading
- Re-mix if needed (it's instant!)

**Timing:**
- Your speech timing should match the instrumental tempo
- Practice speaking at the right pace before recording
- Use a metronome if needed

**Key Matching:**
- Set the singing key to match your instrumental
- If they don't match, adjust pitch shift
- Test small adjustments (+/- 2 semitones)

---

## 🔧 Technical Details

### How Mixing Works:

1. **Client Side**:
   - Singing voice (from conversion)
   - Instrumental MP3 (uploaded)
   - Volume levels (adjustable)

2. **Server Side** (`/api/mixing`):
   - Receives both audio files
   - Applies volume adjustments
   - Mixes tracks together
   - Returns combined audio

3. **Output**:
   - Single MP3 file
   - Contains both vocal and instrumental
   - Ready to download and share

### Supported Formats:

**Input:**
- MP3, WAV, OGG, FLAC, AAC
- Any format your browser supports

**Output:**
- Mixed MP3 file
- High quality
- Optimized for streaming/sharing

---

## ❓ Troubleshooting

### "Mixing failed"
**Solution:** Check that both files are valid audio and try again

### Vocals too quiet
**Solution:** Increase vocal volume to 120-150%

### Instrumental too loud
**Solution:** Decrease instrumental volume to 60-70%

### Timing is off
**Solution:** Use external editor for precise alignment (Audacity)

### Quality loss
**Solution:** Use higher quality source files (instrumental and recording)

---

## 🎵 Quick Reference

| Use Case | Vocal Vol | Inst Vol |
|----------|-----------|----------|
| Balanced mix | 100% | 80% |
| Vocal emphasis | 120% | 60% |
| Background vocal | 60% | 100% |
| A cappella focus | 150% | 40% |
| Karaoke style | 140% | 50% |

---

**Now you can create complete songs in one place!** 🎤🎹🎵

Try it now: http://localhost:3001/speech-to-singing
