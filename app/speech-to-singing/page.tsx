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
  const [instrumentalBlob, setInstrumentalBlob] = useState<Blob | null>(null)
  const [instrumentalUrl, setInstrumentalUrl] = useState<string | null>(null)
  const [isMixing, setIsMixing] = useState(false)
  const [mixedAudioUrl, setMixedAudioUrl] = useState<string | null>(null)
  const [vocalVolume, setVocalVolume] = useState(100)
  const [instrumentalVolume, setInstrumentalVolume] = useState(80)
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

  const handleInstrumentalUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setInstrumentalBlob(file)
      setInstrumentalUrl(url)
      setError(null)
    }
  }

  const handleMixTracks = async () => {
    if (!resultAudioUrl || !instrumentalBlob) {
      setError('Need both singing voice and instrumental track')
      return
    }

    setIsMixing(true)
    setError(null)

    try {
      // Get the singing voice as a blob
      let vocalBlob: Blob
      if (resultAudioUrl.startsWith('blob:')) {
        const response = await fetch(resultAudioUrl)
        vocalBlob = await response.blob()
      } else {
        const response = await fetch(resultAudioUrl)
        vocalBlob = await response.blob()
      }

      console.log('Starting audio mixing...', {
        vocalSize: vocalBlob.size,
        vocalType: vocalBlob.type,
        instrumentalSize: instrumentalBlob.size,
        instrumentalType: instrumentalBlob.type,
        vocalVolume,
        instrumentalVolume
      })

      // Check if audio context is supported
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        throw new Error('Web Audio API is not supported in this browser')
      }

      // Create audio context for mixing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Load both audio files
      console.log('Loading audio files...')
      const [vocalArrayBuffer, instrumentalArrayBuffer] = await Promise.all([
        vocalBlob.arrayBuffer(),
        instrumentalBlob.arrayBuffer()
      ])

      // Decode audio data with error handling
      console.log('Decoding audio data...')
      let vocalAudioBuffer: AudioBuffer
      let instrumentalAudioBuffer: AudioBuffer
      
      try {
        vocalAudioBuffer = await audioContext.decodeAudioData(vocalArrayBuffer.slice(0))
      } catch (decodeError) {
        console.error('Vocal decode error:', decodeError)
        throw new Error('Failed to decode vocal track. Make sure it\'s a valid audio file.')
      }

      try {
        instrumentalAudioBuffer = await audioContext.decodeAudioData(instrumentalArrayBuffer.slice(0))
      } catch (decodeError) {
        console.error('Instrumental decode error:', decodeError)
        throw new Error('Failed to decode instrumental track. Make sure it\'s a valid audio file.')
      }

      console.log('Audio decoded successfully:', {
        vocalDuration: vocalAudioBuffer.duration.toFixed(2) + 's',
        instrumentalDuration: instrumentalAudioBuffer.duration.toFixed(2) + 's',
        vocalChannels: vocalAudioBuffer.numberOfChannels,
        instrumentalChannels: instrumentalAudioBuffer.numberOfChannels,
        sampleRate: audioContext.sampleRate
      })

      // Determine the length of the mixed audio (use the longer duration)
      const duration = Math.max(vocalAudioBuffer.duration, instrumentalAudioBuffer.duration)
      const length = Math.ceil(duration * audioContext.sampleRate)
      const numberOfChannels = 2 // Stereo output

      console.log('Creating offline context for mixing...')

      // Create offline audio context for mixing
      const offlineContext = new OfflineAudioContext(
        numberOfChannels,
        length,
        audioContext.sampleRate
      )

      // Create sources for both tracks
      const vocalSource = offlineContext.createBufferSource()
      const instrumentalSource = offlineContext.createBufferSource()
      
      vocalSource.buffer = vocalAudioBuffer
      instrumentalSource.buffer = instrumentalAudioBuffer

      // Create gain nodes for volume control
      const vocalGain = offlineContext.createGain()
      const instrumentalGain = offlineContext.createGain()
      
      vocalGain.gain.value = vocalVolume / 100
      instrumentalGain.gain.value = instrumentalVolume / 100

      console.log('Volume settings:', {
        vocal: vocalGain.gain.value,
        instrumental: instrumentalGain.gain.value
      })

      // Connect the audio graph
      vocalSource.connect(vocalGain)
      instrumentalSource.connect(instrumentalGain)
      vocalGain.connect(offlineContext.destination)
      instrumentalGain.connect(offlineContext.destination)

      // Start playback
      vocalSource.start(0)
      instrumentalSource.start(0)

      console.log('Rendering mixed audio...')
      // Render the mixed audio
      const mixedBuffer = await offlineContext.startRendering()
      
      console.log('Mixing complete! Converting to WAV...')

      // Convert to WAV blob
      const wavBlob = audioBufferToWav(mixedBuffer)
      const mixedUrl = URL.createObjectURL(wavBlob)
      
      setMixedAudioUrl(mixedUrl)
      console.log('✓ Mixed audio ready! Size:', (wavBlob.size / 1024 / 1024).toFixed(2), 'MB')
      
      // Close audio context to free resources
      await audioContext.close()
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Mixing failed: ${errorMessage}`)
      console.error('Mixing error:', err)
    } finally {
      setIsMixing(false)
    }
  }

  // Helper function to convert AudioBuffer to WAV blob
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44
    const arrayBuffer = new ArrayBuffer(length)
    const view = new DataView(arrayBuffer)
    const channels = []
    let offset = 0
    let pos = 0

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true)
      pos += 2
    }

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true)
      pos += 4
    }

    // RIFF identifier
    setUint32(0x46464952)
    // file length
    setUint32(length - 8)
    // RIFF type
    setUint32(0x45564157)
    // format chunk identifier
    setUint32(0x20746d66)
    // format chunk length
    setUint32(16)
    // sample format (raw)
    setUint16(1)
    // channel count
    setUint16(buffer.numberOfChannels)
    // sample rate
    setUint32(buffer.sampleRate)
    // byte rate (sample rate * block align)
    setUint32(buffer.sampleRate * buffer.numberOfChannels * 2)
    // block align (channel count * bytes per sample)
    setUint16(buffer.numberOfChannels * 2)
    // bits per sample
    setUint16(16)
    // data chunk identifier
    setUint32(0x61746164)
    // data chunk length
    setUint32(length - pos - 4)

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = channels[i][offset]
        sample = Math.max(-1, Math.min(1, sample))
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
        pos += 2
      }
      offset++
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  const handleDownloadMixed = async () => {
    if (!mixedAudioUrl) return

    try {
      const link = document.createElement('a')
      link.href = mixedAudioUrl
      link.download = `mixed-song-${Date.now()}.wav`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError('Failed to download mixed audio')
      console.error('Download error:', err)
    }
  }

  const handleDownloadLyrics = () => {
    if (!lyrics) return

    try {
      const blob = new Blob([lyrics], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `lyrics-${Date.now()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to download lyrics')
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

                {/* Mix with Instrumental */}
                {hasConverted && (
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-600/50 rounded-lg p-6 mt-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      🎹 Mix with Instrumental
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Upload an MP3 backing track to create your full song
                    </p>

                    {/* Lyrics Display/Edit for Mixing */}
                    {lyrics && (
                      <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          📝 Song Lyrics
                        </h4>
                        <div className="bg-black/30 rounded p-3 max-h-40 overflow-y-auto">
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{lyrics}</pre>
                        </div>
                        <button 
                          onClick={() => {
                            const newLyrics = prompt('Edit your lyrics:', lyrics)
                            if (newLyrics !== null) setLyrics(newLyrics)
                          }}
                          className="btn-secondary text-xs mt-2"
                        >
                          ✏️ Edit Lyrics
                        </button>
                      </div>
                    )}

                    {!lyrics && (
                      <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-yellow-400 flex items-center gap-2">
                          💡 <span>No lyrics added. Add lyrics to show them with your mixed song!</span>
                        </p>
                        <button 
                          onClick={() => {
                            const newLyrics = prompt('Add your song lyrics:')
                            if (newLyrics) setLyrics(newLyrics)
                          }}
                          className="btn-secondary text-xs mt-2"
                        >
                          ➕ Add Lyrics
                        </button>
                      </div>
                    )}

                    {/* Upload Instrumental */}
                    {!instrumentalUrl ? (
                      <div className="text-center py-6">
                        <input 
                          type="file" 
                          accept="audio/*" 
                          onChange={handleInstrumentalUpload}
                          className="hidden" 
                          id="instrumental-upload" 
                        />
                        <label htmlFor="instrumental-upload" className="btn-primary inline-block cursor-pointer">
                          📁 Upload Instrumental/Backing Track
                        </label>
                        <p className="text-xs text-gray-500 mt-2">MP3, WAV, or any audio format</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Instrumental Preview */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold mb-2">Instrumental Track</h4>
                          <AudioPlayer src={instrumentalUrl} />
                        </div>

                        {/* Volume Controls */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-2">Vocal Volume: {vocalVolume}%</label>
                            <input 
                              type="range" 
                              min="0" 
                              max="150" 
                              value={vocalVolume}
                              onChange={(e) => setVocalVolume(parseInt(e.target.value))}
                              className="w-full accent-purple-600" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-2">Instrumental Volume: {instrumentalVolume}%</label>
                            <input 
                              type="range" 
                              min="0" 
                              max="150" 
                              value={instrumentalVolume}
                              onChange={(e) => setInstrumentalVolume(parseInt(e.target.value))}
                              className="w-full accent-blue-600" 
                            />
                          </div>
                        </div>

                        {/* Mix Button */}
                        <button 
                          onClick={handleMixTracks}
                          disabled={isMixing}
                          className="btn-primary w-full disabled:opacity-50"
                        >
                          {isMixing ? '🎚️ Mixing Tracks (This may take a few seconds)...' : '🎵 Mix Tracks Together'}
                        </button>

                        {isMixing && (
                          <div className="text-center text-sm text-gray-400">
                            <p>Processing audio... This may take 10-30 seconds depending on track length.</p>
                            <p className="text-xs mt-1">Using Web Audio API for real-time mixing</p>
                          </div>
                        )}

                        {/* Mixed Result */}
                        {mixedAudioUrl && (
                          <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold text-green-400">✓ Mixed Song Ready!</h4>
                              <div className="flex gap-2">
                                <button onClick={handleDownloadMixed} className="btn-primary text-sm">
                                  📥 Download Song
                                </button>
                                {lyrics && (
                                  <button onClick={handleDownloadLyrics} className="btn-secondary text-sm">
                                    📄 Download Lyrics
                                  </button>
                                )}
                              </div>
                            </div>
                            <AudioPlayer src={mixedAudioUrl} />
                            {lyrics && (
                              <div className="mt-3 text-xs text-gray-400">
                                💡 Tip: Download both the song and lyrics to keep them together
                              </div>
                            )}
                          </div>
                        )}

                        {/* Change Instrumental */}
                        <button 
                          onClick={() => {
                            setInstrumentalBlob(null)
                            setInstrumentalUrl(null)
                            setMixedAudioUrl(null)
                          }}
                          className="btn-secondary w-full text-sm"
                        >
                          Change Instrumental
                        </button>
                      </div>
                    )}
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