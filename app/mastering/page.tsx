'use client'
import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import Waveform from '@/components/audio/Waveform'

export default function MasteringPage() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isMastering, setIsMastering] = useState(false)
  const [hasMastered, setHasMastered] = useState(false)
  const [targetLoudness, setTargetLoudness] = useState(-14)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  const handleMaster = async () => {
    setIsMastering(true)
    setTimeout(() => {
      setIsMastering(false)
      setHasMastered(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            AI Mastering Studio
          </h1>
          <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Upload Track</h2>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-600 transition-colors">
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="master-file-upload"
                />
                <label htmlFor="master-file-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm text-gray-400">Click to upload</p>
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm truncate">✓ {uploadedFile}</p>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Mastering Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Reference Style</label>
                  <select className="input-field text-sm">
                    <option>Streaming (Spotify)</option>
                    <option>Radio</option>
                    <option>Club/DJ</option>
                    <option>YouTube</option>
                    <option>Audiophile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    Target Loudness: <span className="text-purple-400">{targetLoudness} LUFS</span>
                  </label>
                  <input 
                    type="range" 
                    min="-20" 
                    max="-8" 
                    value={targetLoudness}
                    onChange={(e) => setTargetLoudness(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Stereo Width</label>
                  <input type="range" className="w-full accent-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="limiter" className="accent-purple-600" />
                  <label htmlFor="limiter" className="text-sm">True Peak Limiting</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="enhance" className="accent-purple-600" defaultChecked />
                  <label htmlFor="enhance" className="text-sm">AI Enhancement</label>
                </div>
              </div>
            </div>
          </div>

          {/* Mastering Interface */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Mastering Suite</h2>
              
              {!uploadedFile ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-6xl mb-4">🎼</div>
                  <p className="text-gray-400 text-lg">Upload your mixed track to begin mastering</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Metering */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400 mb-1">Integrated</p>
                      <p className="text-2xl font-bold text-green-400">-12.3 LUFS</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400 mb-1">True Peak</p>
                      <p className="text-2xl font-bold text-blue-400">-0.8 dB</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400 mb-1">Dynamic Range</p>
                      <p className="text-2xl font-bold text-purple-400">8.2 dB</p>
                    </div>
                  </div>

                  {/* Original */}
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Original Mix</h3>
                      <span className="text-sm text-gray-400">Unmastered</span>
                    </div>
                    <Waveform />
                    <div className="mt-4">
                      <AudioPlayer />
                    </div>
                  </div>

                  {/* Mastered Result */}
                  {hasMastered && (
                    <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">Mastered Track</h3>
                          <p className="text-xs text-green-400 mt-1">✓ Optimized for streaming</p>
                        </div>
                        <button className="btn-secondary text-sm">Download</button>
                      </div>
                      <Waveform />
                      <div className="mt-4">
                        <AudioPlayer />
                      </div>
                    </div>
                  )}

                  {/* Analysis */}
                  {hasMastered && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2">Frequency Balance</h4>
                        <div className="h-24 flex items-end gap-1">
                          {[40, 60, 80, 70, 50, 45, 55, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t" style={{height: `${h}%`}}></div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2">Stereo Field</h4>
                        <div className="h-24 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full border-4 border-purple-600 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600/20 to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button 
                      onClick={handleMaster}
                      disabled={isMastering}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {isMastering ? '🎼 Mastering...' : '✨ Master Track'}
                    </button>
                    {hasMastered && (
                      <button className="btn-secondary flex-1">Compare A/B</button>
                    )}
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