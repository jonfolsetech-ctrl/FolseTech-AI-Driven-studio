# Quick Start: DiffSVS Integration

## 🚀 Immediate Start (No Setup Required)

Your DiffSVS integration is **already working** in mock mode!

### Test It Now:

1. Open: http://localhost:3000
2. Click "Speech to Singing" or navigate to `/speech-to-singing`
3. Record audio or upload a file
4. Adjust settings:
   - Voice Type: Male, Female, Child, Custom
   - Pitch Shift: -12 to +12 semitones
   - Key: C Major, G Major, etc.
   - Style: Pop, R&B, Rock, Jazz, Opera
   - Auto-Tune: 0-100%
   - Lyrics: Optional text for guided synthesis
5. Click "Convert to Singing"
6. Download your result!

**Note:** Mock mode returns the original audio. Add an API key for real AI conversion.

---

## 🔑 Enable Real AI (5 Minutes)

### OpenVoice API (Recommended - Best Results!)

**OpenVoice** by MyShell.ai provides instant voice cloning with excellent quality.

1. **Get API Token**
   - Go to https://replicate.com
   - Sign up (free tier available)
   - Go to Account → API Tokens
   - Copy your token

2. **Configure**
   ```bash
   # Edit .env.local and add:
   USE_OPENVOICE=true
   REPLICATE_API_TOKEN=r8_your_token_here
   OPENVOICE_MODEL_VERSION=myshell-ai/openvoice
   ```

3. **Restart**
   ```bash
   # Stop the server (Ctrl+C in terminal)
   npm run dev
   ```

4. **Test**
   - Use the app as before
   - Check console: "Using OpenVoice for voice cloning conversion"
   - Real AI singing voice with your tone!

**Full OpenVoice Guide**: [OPENVOICE_SETUP.md](./OPENVOICE_SETUP.md)

---

### Alternative: Other Replicate Models

```bash
# For So-VITS-SVC, RVC, or other models:
REPLICATE_API_TOKEN=r8_your_token_here
REPLICATE_MODEL_VERSION=your_preferred_model
```

---

## 📚 Documentation

- **🔥 OpenVoice Setup** (Recommended): [OPENVOICE_SETUP.md](./OPENVOICE_SETUP.md)
- **Full Setup Guide**: [DIFFSVS_SETUP.md](./DIFFSVS_SETUP.md)
- **Integration Details**: [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)
- **Main README**: [README.md](./README.md)

---

## 🎯 What's Working

✅ Speech-to-singing UI  
✅ Audio recording & upload  
✅ All voice controls  
✅ Lyrics input  
✅ Parameter validation  
✅ Mock conversion (dev mode)  
✅ Download functionality  
✅ Ready for API integration  

---

## 🛠️ Development

```bash
# Start dev server (already running!)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## ❓ Quick Troubleshooting

**"Using mock conversion"** in logs?  
→ Normal! No API key configured. Add `REPLICATE_API_TOKEN` to `.env.local` for real AI.

**Changes not showing?**  
→ Restart the dev server: `Ctrl+C` then `npm run dev`

**Need help?**  
→ Check console logs (browser and server) for detailed information

---

**Status**: ✅ Ready to use!  
**Server**: Running at http://localhost:3000  
**Mode**: Mock (no API keys needed for testing)
