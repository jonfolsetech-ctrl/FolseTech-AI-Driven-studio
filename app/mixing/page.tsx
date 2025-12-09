'use client'
import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import Waveform from '@/components/audio/Waveform'

export default function MixingPage() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isMixing, setIsMixing] = useState(false)
  const [hasMixed, setHasMixed] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  const handleMix = async () => {
    setIsMixing(true)
    setTimeout(() => {
      setIsMixing(false)
      setHasMixed(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            AI Mixing Studio
          </h1>
          <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Upload Track</h2>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-600 transition-colors">
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm text-gray-400">Click to upload audio file</p>
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm truncate">✓ {uploadedFile}</p>
                </div>
              )}
            </div>

            <div className="card mt-6">
              <h2 className="text-xl font-bold mb-4">Mix Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">EQ Preset</label>
                  <select className="input-field text-sm">
                    <option>Balanced</option>
                    <option>Bass Boost</option>
                    <option>Vocal Focus</option>
                    <option>Bright</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Compression</label>
                  <select className="input-field text-sm">
                    <option>Light</option>
                    <option>Medium</option>
                    <option>Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Reverb</label>
                  <input type="range" className="w-full accent-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Mixing Interface */}
          <div className="lg:col-span-3">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Mixing Console</h2>
              
              {!uploadedFile ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-6xl mb-4">🎚️</div>
                  <p className="text-gray-400 text-lg">Upload an audio file to start mixing</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Original Track */}
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Original Track</h3>
                    <Waveform />
                    <div className="mt-4">
                      <AudioPlayer />
                    </div>
                  </div>

                  {/* Track Channels */}
                  <div className="grid grid-cols-4 gap-4">
                    {['Vocals', 'Drums', 'Bass', 'Keys'].map((channel) => (
                      <div key={channel} className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 text-center">{channel}</h4>
                        <div className="flex justify-center mb-2">
                          <input 
                            type="range" 
                            orient="vertical" 
                            className="h-32 accent-purple-600"
                            style={{ writingMode: 'bt-lr', appearance: 'slider-vertical' }}
                          />
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-xs py-1 rounded">M</button>
                          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-xs py-1 rounded">S</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mixed Result */}
                  {hasMixed && (
                    <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">AI Mixed Track</h3>
                        <button className="btn-secondary text-sm">Download</button>
                      </div>
                      <Waveform />
                      <div className="mt-4">
                        <AudioPlayer />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button 
                      onClick={handleMix}
                      disabled={isMixing}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {isMixing ? '🎚️ Mixing...' : '✨ AI Auto Mix'}
                    </button>
                    {hasMixed && <button className="btn-secondary flex-1">Save Project</button>}
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