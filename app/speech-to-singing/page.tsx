'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import Waveform from '@/components/audio/Waveform'

export default function SpeechToSingingPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [hasConverted, setHasConverted] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)
  const [resultAudioUrl, setResultAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [voiceType, setVoiceType] = useState('Male')
  const [pitchShift, setPitchShift] = useState(0)
  const [key, setKey] = useState('C Major')
  const [style, setStyle] = useState('Pop')
  const [autoTune, setAutoTune] = useState(50)
  const [lyrics, setLyrics] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const handleRecord = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setRecordedAudioUrl(url)
        setHasRecording(true)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }, 30000)
    } catch (err) {
      setError('Failed to access microphone. Please grant permission.')
      console.error('Recording error:', err)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAudioBlob(file)
      setRecordedAudioUrl(url)
      setHasRecording(true)
      setError(null)
    }
  }

  const handleConvert = async () => {
    if (!audioBlob) return

    setIsConverting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('voiceType', voiceType)
      formData.append('pitchShift', pitchShift.toString())
      formData.append('key', key)
      formData.append('style', style)
      formData.append('autoTune', autoTune.toString())
      formData.append('lyrics', lyrics)

      console.log('Sending conversion request...')

      const response = await fetch('/api/speech-to-singing', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`Conversion failed with status ${response.status}`)
      }

      // Get the audio blob from the response
      const resultBlob = await response.blob()
      console.log('Received audio blob:', resultBlob.size, 'bytes, type:', resultBlob.type)
      const audioUrl = URL.createObjectURL(resultBlob)
      console.log('Created audio URL:', audioUrl)
      
      setResultAudioUrl(audioUrl)
      setHasConverted(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Conversion failed: ${errorMessage}`)
      console.error('Conversion error:', err)
    } finally {
      setIsConverting(false)
    }
  }

  const handleReset = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl)
    }
    if (resultAudioUrl && resultAudioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(resultAudioUrl)
    }
    setHasRecording(false)
    setHasConverted(false)
    setAudioBlob(null)
    setRecordedAudioUrl(null)
    setResultAudioUrl(null)
    setError(null)
  }

  const handleDownload = async () => {
    if (!resultAudioUrl) return

    try {
      // If it's a blob URL, download directly
      if (resultAudioUrl.startsWith('blob:')) {
        const link = document.createElement('a')
        link.href = resultAudioUrl
        link.download = `singing-${Date.now()}.webm`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // If it's a remote URL, fetch and download
        const response = await fetch(resultAudioUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `singing-${Date.now()}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError('Failed to download audio')
      console.error('Download error:', err)
    }
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
                  <select className="input-field text-sm" value={voiceType} onChange={(e) => setVoiceType(e.target.value)}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Child</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Pitch Shift: {pitchShift}</label>
                  <input 
                    type="range" 
                    min="-12" 
                    max="12" 
                    value={pitchShift}
                    onChange={(e) => setPitchShift(parseInt(e.target.value))}
                    className="w-full accent-purple-600" 
                  />
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
                  <select className="input-field text-sm" value={key} onChange={(e) => setKey(e.target.value)}>
                    <option>C Major</option>
                    <option>G Major</option>
                    <option>D Major</option>
                    <option>A Minor</option>
                    <option>E Minor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Style</label>
                  <select className="input-field text-sm" value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option>Pop</option>
                    <option>R&B</option>
                    <option>Rock</option>
                    <option>Jazz</option>
                    <option>Opera</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Auto-Tune Amount: {autoTune}%</label>
                  <input 
                    type="range" 
                    value={autoTune}
                    onChange={(e) => setAutoTune(parseInt(e.target.value))}
                    className="w-full accent-purple-600" 
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Lyrics</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-300">
                    Paste Your Lyrics
                    <span className="text-xs text-gray-500 ml-2">(optional)</span>
                  </label>
                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Paste or type your lyrics here...&#10;&#10;This helps guide the singing conversion"
                    className="input-field min-h-[150px] resize-y font-mono text-sm"
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {lyrics.length} characters • {lyrics.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Record & Convert</h2>
              
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
                    {error}
                  </div>
                )}

                {/* Recording Section */}
                <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">🎤</div>
                  {!hasRecording ? (
                    <div>
                      <p className="text-lg mb-4">Speak or record your voice</p>
                      <div className="flex gap-4 justify-center">
                        <button 
                          onClick={isRecording ? handleStopRecording : handleRecord}
                          className={`btn-primary ${
                            isRecording ? 'animate-pulse bg-red-600' : ''
                          }`}
                        >
                          {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">Or upload an audio file</p>
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleFileUpload}
                        className="hidden" 
                        id="speech-upload" 
                      />
                      <label htmlFor="speech-upload" className="btn-secondary inline-block mt-2 cursor-pointer">
                        📁 Upload File
                      </label>
                    </div>
                  ) : (
                    <div>
                      <p className="text-green-400 mb-4">✓ Recording captured</p>
                      <Waveform />
                      <div className="mt-4">
                        <AudioPlayer src={recordedAudioUrl || undefined} />
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
                      <button onClick={handleDownload} className="btn-secondary">📥 Download</button>
                    </div>
                    <Waveform />
                    <div className="mt-4">
                      <AudioPlayer src={resultAudioUrl || undefined} />
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
                    <button onClick={handleReset} className="btn-secondary flex-1">
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