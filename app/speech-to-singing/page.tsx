'use client'
import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import Waveform from '@/components/audio/Waveform'

export default function SpeechToSingingPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [hasConverted, setHasConverted] = useState(false)

  const handleRecord = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      setHasRecording(true)
    }, 3000)
  }

  const handleConvert = () => {
    setIsConverting(true)
    setTimeout(() => {
      setIsConverting(false)
      setHasConverted(true)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Speech to Singing
          </h1>
          <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Voice Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Voice Type</label>
                  <select className="input-field text-sm">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Child</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Pitch Shift</label>
                  <input type="range" min="-12" max="12" defaultValue="0" className="w-full accent-purple-600" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-12</span>
                    <span>0</span>
                    <span>+12</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Musical Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Key</label>
                  <select className="input-field text-sm">
                    <option>C Major</option>
                    <option>G Major</option>
                    <option>D Major</option>
                    <option>A Minor</option>
                    <option>E Minor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Style</label>
                  <select className="input-field text-sm">
                    <option>Pop</option>
                    <option>R&B</option>
                    <option>Rock</option>
                    <option>Jazz</option>
                    <option>Opera</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Auto-Tune Amount</label>
                  <input type="range" defaultValue="50" className="w-full accent-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Record & Convert</h2>
              
              <div className="space-y-6">
                {/* Recording Section */}
                <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">🎤</div>
                  {!hasRecording ? (
                    <div>
                      <p className="text-lg mb-4">Speak or record your voice</p>
                      <button 
                        onClick={handleRecord}
                        disabled={isRecording}
                        className={`btn-primary ${
                          isRecording ? 'animate-pulse bg-red-600' : ''
                        } disabled:opacity-100`}
                      >
                        {isRecording ? '🔴 Recording...' : '🎙️ Start Recording'}
                      </button>
                      <p className="text-sm text-gray-500 mt-4">Or upload an audio file</p>
                      <input type="file" accept="audio/*" className="hidden" id="speech-upload" />
                      <label htmlFor="speech-upload" className="btn-secondary inline-block mt-2 cursor-pointer">
                        📁 Upload File
                      </label>
                    </div>
                  ) : (
                    <div>
                      <p className="text-green-400 mb-4">✓ Recording captured</p>
                      <Waveform />
                      <div className="mt-4">
                        <AudioPlayer />
                      </div>
                    </div>
                  )}
                </div>

                {/* Convert Button */}
                {hasRecording && !hasConverted && (
                  <button 
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isConverting ? '✨ Converting to singing...' : '🎵 Convert to Singing'}
                  </button>
                )}

                {/* Result */}
                {hasConverted && (
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-600/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">Singing Output</h3>
                        <p className="text-sm text-green-400 mt-1">✓ Successfully converted</p>
                      </div>
                      <button className="btn-secondary">Download</button>
                    </div>
                    <Waveform />
                    <div className="mt-4">
                      <AudioPlayer />
                    </div>
                  </div>
                )}

                {/* Comparison */}
                {hasConverted && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2 text-center">Original Speech</h4>
                      <div className="flex items-center justify-center h-32">
                        <div className="text-4xl">💬</div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2 text-center">Singing Voice</h4>
                      <div className="flex items-center justify-center h-32">
                        <div className="text-4xl">🎵</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {hasConverted && (
                  <div className="flex gap-4">
                    <button className="btn-primary flex-1">Save to Library</button>
                    <button onClick={() => { setHasRecording(false); setHasConverted(false); }} className="btn-secondary flex-1">
                      New Recording
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}