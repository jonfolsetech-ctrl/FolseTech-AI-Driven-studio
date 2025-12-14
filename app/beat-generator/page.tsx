'use client'
import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import Waveform from '@/components/audio/Waveform'

export default function BeatGeneratorPage() {
  const [genre, setGenre] = useState('hip-hop')
  const [bpm, setBpm] = useState(120)
  const [mood, setMood] = useState('energetic')
  const [stylePrompt, setStylePrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [generatedBeat, setGeneratedBeat] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!genre || !bpm || !mood) {
      alert('Please fill in all required fields')
      return
    }

    setIsGenerating(true)
    setGeneratedBeat(null)
    setError(null)

    try {
      console.log('Generating beat with params:', { genre, bpm, mood, stylePrompt })
      
      const response = await fetch('/api/beats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre,
          bpm,
          mood,
          stylePrompt,
          duration: 30,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Beat generation failed')
      }

      if (data.audioUrl) {
        setGeneratedBeat(data.audioUrl)
        setHasGenerated(true)
        console.log('Beat generated successfully:', data.metadata)
      } else {
        console.log('Mock generation mode (no audio URL)')
        const mockUrl = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQAAAAA='
        setGeneratedBeat(mockUrl)
        setHasGenerated(true)
      }
      
    } catch (error) {
      console.error('Beat generation failed:', error)
      const errorMsg = error instanceof Error ? error.message : String(error)
      setError(errorMsg)
      alert(`Failed to generate beat: ${errorMsg}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            AI Beat Generator
          </h1>
          <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Genre</label>
                  <select 
                    value={genre} 
                    onChange={(e) => setGenre(e.target.value)}
                    className="input-field"
                  >
                    <option value="hip-hop">Hip Hop</option>
                    <option value="trap">Trap</option>
                    <option value="edm">EDM</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="jazz">Jazz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    BPM: <span className="text-purple-400">{bpm}</span>
                  </label>
                  <input 
                    type="range" 
                    min="60" 
                    max="200" 
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Mood</label>
                  <select 
                    value={mood} 
                    onChange={(e) => setMood(e.target.value)}
                    className="input-field"
                  >
                    <option value="energetic">Energetic</option>
                    <option value="chill">Chill</option>
                    <option value="dark">Dark</option>
                    <option value="uplifting">Uplifting</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Style Description
                    <span className="text-xs text-gray-500 ml-2">(optional)</span>
                  </label>
                  <textarea
                    value={stylePrompt}
                    onChange={(e) => setStylePrompt(e.target.value)}
                    placeholder="Paste or describe your desired style... e.g., 'dark trap with heavy 808s and ethereal synths'"
                    className="input-field min-h-[100px] resize-y"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add specific style instructions for more customized beats
                  </p>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? '🎵 Generating...' : '✨ Generate Beat'}
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Generated Beat</h2>
              
              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
                  <p className="text-red-400">⚠️ {error}</p>
                </div>
              )}
              
              {!hasGenerated ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-gray-400 text-lg">Configure your settings and click Generate Beat to create your AI-powered music</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">Beat_{Date.now()}.wav</h3>
                        <p className="text-sm text-gray-400">{genre} • {bpm} BPM • {mood}</p>
                        {stylePrompt && (
                          <p className="text-xs text-purple-400 mt-1">
                            Custom style: {stylePrompt.substring(0, 60)}
                            {stylePrompt.length > 60 ? '...' : ''}
                          </p>
                        )}
                      </div>
                      {generatedBeat && (
                        <a 
                          href={generatedBeat} 
                          download={`Beat_${Date.now()}.wav`}
                          className="btn-secondary text-sm"
                        >
                          Download
                        </a>
                      )}
                    </div>
                    {generatedBeat && (
                      <>
                        <Waveform />
                        <div className="mt-4">
                          <AudioPlayer src={generatedBeat} />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button className="btn-primary flex-1">Save to Library</button>
                    <button onClick={handleGenerate} className="btn-secondary flex-1">Generate Another</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}