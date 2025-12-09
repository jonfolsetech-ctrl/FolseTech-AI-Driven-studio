# FolseTech Pro AI Studio

AI-powered music production studio with beat generation, mixing, mastering, and speech-to-singing capabilities.

## Features

- 🎵 **Beat Generator** - Create AI-generated beats and instrumentals
- 🎚️ **AI Mixing** - Mix vocals with instrumentals to create full songs
- 🎼 **Mastering** - Professional audio mastering
- 🎤 **Speech to Singing** - Convert spoken words into singing voice

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

Create a `.env.local` file for API keys (when integrating AI services):

```
REPLICATE_API_TOKEN=your_token_here
ELEVENLABS_API_KEY=your_key_here
```

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
│   ├── beat-generator/    # Beat generation page
│   ├── mixing/            # Audio mixing page
│   ├── mastering/         # Mastering page
│   ├── speech-to-singing/ # Voice conversion page
│   └── dashboard/         # Main dashboard
├── components/            # React components
│   └── audio/            # Audio player components
├── styles/               # Global styles
└── public/              # Static assets
```

## Features in Development

- AI model integration for real voice conversion
- Cloud audio processing
- User authentication
- Project saving and library management
- Advanced mixing controls

## License

Private - All rights reserved

## Contact

For questions or support, contact: [Your Contact Info]
