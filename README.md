# FolseTech Pro AI Studio

AI-powered music production studio with beat generation, mixing, mastering, and speech-to-singing capabilities.

## Features

- 🎵 **Beat Generator** - AI-powered beat creation with MusicGen, Stable Audio, and Suno AI
  - Multiple genres (Hip Hop, Trap, EDM, Pop, Rock, Jazz)
  - BPM control (60-200)
  - Mood selection (Energetic, Chill, Dark, Uplifting, Aggressive)
  - Custom style prompts for unique beats
  - Auto-generation with Replicate API integration
- 🎚️ **AI Mixing** - Mix vocals with instrumentals to create full songs
  - Volume control for vocals and instrumentals
  - Real-time audio mixing with Web Audio API
  - Lyrics display and editing
  - Download mixed songs
- 🎼 **Mastering** - Professional audio mastering
- 🎤 **Speech to Singing** - Convert spoken words into singing voice with DiffSVS integration
  - Multiple voice types (Male, Female, Child, Custom)
  - Pitch shifting and auto-tune
  - Musical key and style selection
  - Lyrics-guided singing synthesis
  - Integrate with mixing for complete song production

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Web Audio API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/jonfolsetech-ctrl/FolseTech-AI-Driven-studio.git

# Navigate to project directory
cd FolseTech-AI-Driven-studio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file for AI service configuration:

```env
# Replicate API (Required for all AI features)
REPLICATE_API_TOKEN=your_replicate_token_here

# Beat Generator
# Options: 'musicgen', 'stable-audio', 'suno'
BEAT_GENERATOR_SERVICE=musicgen

# OpenVoice - Instant voice cloning (Recommended)
USE_OPENVOICE=true
OPENVOICE_MODEL_VERSION=myshell-ai/openvoice

# Or use other DiffSVS models
# DIFFSVS_API_URL=http://localhost:8000  # For self-hosted

# Audio Processing
MAX_AUDIO_DURATION=30000
AUDIO_SAMPLE_RATE=44100
```

**Quick Start:**
1. Get token from https://replicate.com
2. Add to `.env.local`: `REPLICATE_API_TOKEN=your_token_here`
3. (Optional) Enable OpenVoice: `USE_OPENVOICE=true`
4. Restart: `npm run dev`

**Documentation:**
- [Beat Generator Setup](./BEAT_GENERATOR_GUIDE.md) - Complete beat generation guide
- [Beat Generator Quick Start](./BEAT_GENERATOR_QUICKSTART.md) - Get started in 3 steps
- [OpenVoice Setup](./OPENVOICE_SETUP.md) - Voice cloning setup
- [DiffSVS Setup](./DIFFSVS_SETUP.md) - Speech-to-singing options

**Note:** Works in mock mode without API keys for development.

## Deployment

This project is optimized for AWS Amplify deployment with automatic builds configured via `amplify.yml`.

### Deploy to Amplify

1. Connect your GitHub repository to AWS Amplify
2. Amplify will automatically detect the `amplify.yml` configuration
3. Set environment variables in Amplify Console if needed
4. Deploy!

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   │   ├── beats/         # Beat generation API
│   │   ├── mixing/        # Audio mixing API
│   │   └── speech-to-singing/  # DiffSVS integration
│   ├── beat-generator/    # Beat generation page
│   ├── mixing/            # Audio mixing page
│   ├── mastering/         # Mastering page
│   ├── speech-to-singing/ # Voice conversion page
│   └── dashboard/         # Main dashboard
├── components/            # React components
│   └── audio/            # Audio player components
├── lib/                  # Utilities and integrations
│   ├── beat-generator.ts # Beat generation plugin system
│   ├── diffsvs.ts       # DiffSVS integration library
│   └── audio-utils.ts   # Audio processing utilities
├── styles/               # Global styles
└── public/              # Static assets
```

## Features in Development

- ✅ Beat Generator with MusicGen, Stable Audio, Suno AI
- ✅ DiffSVS integration for speech-to-singing (Mock mode ready, API integration supported)
- ✅ Client-side audio mixing with Web Audio API
- ✅ Lyrics display and editing
- 🔄 Cloud audio processing with Replicate API (configured, model version pending)
- 🔄 User authentication
- 🔄 Project saving and library management
- 🔄 Advanced mixing controls
- 🔄 Real-time collaboration

## Beat Generator Plugin System

The Beat Generator includes a powerful plugin system supporting multiple AI music generation services:

- **MusicGen (Meta)** ✅ Recommended - Free tier, high quality
- **Stable Audio** - Professional-grade audio
- **Suno AI** - State-of-the-art music generation

### Features:
- Smart prompt building from parameters (genre, BPM, mood, style)
- Automatic service fallback
- Parameter validation
- Mock mode for development
- Download generated beats
- Integration with mixing feature

See [BEAT_GENERATOR_GUIDE.md](./BEAT_GENERATOR_GUIDE.md) for complete documentation.

## DiffSVS Integration

This project includes a complete DiffSVS (Singing Voice Synthesis) integration. The system supports:

- **OpenVoice (Recommended)**: Instant voice cloning with tone control - [Setup Guide](./OPENVOICE_SETUP.md)
- **Multiple Backends**: Replicate API, self-hosted DiffSVS, or mock mode
- **Voice Control**: Pitch shifting, auto-tune, voice type selection
- **Musical Parameters**: Key, style, and lyrics-guided synthesis
- **Development Ready**: Works out-of-the-box in mock mode

### Available Models:
- 🔥 **OpenVoice** - Best for instant voice cloning
- **So-VITS-SVC** - High-quality voice conversion
- **RVC** - Retrieval-based voice conversion
- **DiffSinger** - Lyrics-based singing synthesis

See [OPENVOICE_SETUP.md](./OPENVOICE_SETUP.md) (recommended) or [DIFFSVS_SETUP.md](./DIFFSVS_SETUP.md) for complete setup instructions.

## License

Private - All rights reserved

## Contact

For questions or support, contact: [Your Contact Info]
