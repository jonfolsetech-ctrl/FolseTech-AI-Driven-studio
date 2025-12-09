'use client'
import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import Waveform from '@/components/audio/Waveform'

export default function MixingPage() {
  const [vocalFile, setVocalFile] = useState<File | null>(null)
  const [vocalUrl, setVocalUrl] = useState<string | null>(null)
  const [instrumentalFile, setInstrumentalFile] = useState<File | null>(null)
  const [instrumentalUrl, setInstrumentalUrl] = useState<string | null>(null)
  const [isMixing, setIsMixing] = useState(false)
  const [hasMixed, setHasMixed] = useState(false)
  const [mixedAudioUrl, setMixedAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVocalFile(file)
      setVocalUrl(url)
    }
  }

  const handleInstrumentalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setInstrumentalFile(file)
      setInstrumentalUrl(url)
    }
  }

  const handleMix = async () => {
    if (!vocalFile || !instrumentalFile) {
      setError('Please upload both vocal and instrumental tracks')
      return
    }

    setIsMixing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('vocals', vocalFile)
      formData.append('instrumental', instrumentalFile)

      const response = await fetch('/api/mixing', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Mixing failed')
      }

      const resultBlob = await response.blob()
      const audioUrl = URL.createObjectURL(resultBlob)
      
      setMixedAudioUrl(audioUrl)
      setHasMixed(true)
    } catch (err) {
      setError('Mixing failed. Please try again.')
      console.error('Mixing error:', err)
    } finally {
      setIsMixing(false)
    }
  }

  const handleDownload = () => {
    if (!mixedAudioUrl) return
    
    const link = document.createElement('a')
    link.href = mixedAudioUrl
    link.download = `mixed-song-${Date.now()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    if (vocalUrl) URL.revokeObjectURL(vocalUrl)
    if (instrumentalUrl) URL.revokeObjectURL(instrumentalUrl)
    if (mixedAudioUrl) URL.revokeObjectURL(mixedAudioUrl)
    
    setVocalFile(null)
    setVocalUrl(null)
    setInstrumentalFile(null)
    setInstrumentalUrl(null)
    setMixedAudioUrl(null)
    setHasMixed(false)
    setError(null)
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
            {/* Vocal Upload */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">🎤 Vocals</h2>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-purple-600 transition-colors">
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleVocalUpload}
                  className="hidden" 
                  id="vocal-upload"
                />
                <label htmlFor="vocal-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">🎙️</div>
                  <p className="text-sm text-gray-400">Upload vocals</p>
                </label>
              </div>
              {vocalFile && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm truncate">✓ {vocalFile.name}</p>
                  <div className="mt-2">
                    <AudioPlayer src={vocalUrl || undefined} />
                  </div>
                </div>
              )}
            </div>

            {/* Instrumental Upload */}
            <div className="card mt-6">
              <h2 className="text-xl font-bold mb-4">🎵 Instrumental</h2>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-purple-600 transition-colors">
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleInstrumentalUpload}
                  className="hidden" 
                  id="instrumental-upload"
                />
                <label htmlFor="instrumental-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">🎹</div>
                  <p className="text-sm text-gray-400">Upload instrumental</p>
                </label>
              </div>
              {instrumentalFile && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm truncate">✓ {instrumentalFile.name}</p>
                  <div className="mt-2">
                    <AudioPlayer src={instrumentalUrl || undefined} />
                  </div>
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
              
              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400 mb-6">
                  {error}
                </div>
              )}
              
              {!vocalFile && !instrumentalFile ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-6xl mb-4">🎚️</div>
                  <p className="text-gray-400 text-lg mb-2">Upload vocals and instrumental to start mixing</p>
                  <p className="text-gray-500 text-sm">Create a full song by combining your tracks</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Vocal Track */}
                  {vocalFile && (
                    <div className="bg-gray-800/50 rounded-lg p-6">
                      <h3 className="font-semibold mb-3">🎤 Vocal Track</h3>
                      <Waveform />
                      <div className="mt-4">
                        <AudioPlayer src={vocalUrl || undefined} />
                      </div>
                    </div>
                  )}

                  {/* Instrumental Track */}
                  {instrumentalFile && (
                    <div className="bg-gray-800/50 rounded-lg p-6">
                      <h3 className="font-semibold mb-3">🎵 Instrumental Track</h3>
                      <Waveform />
                      <div className="mt-4">
                        <AudioPlayer src={instrumentalUrl || undefined} />
                      </div>
                    </div>
                  )}

                  {/* Track Channels - Volume Controls */}
                  {vocalFile && instrumentalFile && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 text-center">Vocal Volume</h4>
                        <div className="flex justify-center mb-2">
                          <input 
                            type="range" 
                            orient="vertical" 
                            className="h-32 accent-purple-600"
                            style={{ writingMode: 'bt-lr', appearance: 'slider-vertical' }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 text-center">Instrumental Volume</h4>
                        <div className="flex justify-center mb-2">
                          <input 
                            type="range" 
                            orient="vertical" 
                            className="h-32 accent-purple-600"
                            style={{ writingMode: 'bt-lr', appearance: 'slider-vertical' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mixed Result */}
                  {hasMixed && mixedAudioUrl && (
                    <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">🎵 Full Song Mix</h3>
                          <p className="text-sm text-green-400 mt-1">✓ Successfully mixed</p>
                        </div>
                        <button onClick={handleDownload} className="btn-secondary text-sm">📥 Download</button>
                      </div>
                      <Waveform />
                      <div className="mt-4">
                        <AudioPlayer src={mixedAudioUrl} />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button 
                      onClick={handleMix}
                      disabled={isMixing || !vocalFile || !instrumentalFile}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {isMixing ? '🎚️ Mixing...' : '✨ Mix Tracks'}
                    </button>
                    {hasMixed && (
                      <button onClick={handleReset} className="btn-secondary flex-1">
                        🔄 New Mix
                      </button>
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