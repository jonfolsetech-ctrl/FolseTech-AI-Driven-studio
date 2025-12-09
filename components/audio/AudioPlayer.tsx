'use client'
import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  src?: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [src])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current || !src) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {src && <audio ref={audioRef} src={src} preload="metadata" />}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button 
          onClick={togglePlay}
          disabled={!src}
          className="w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <span className="text-xl">⏸️</span>
          ) : (
            <span className="text-xl">▶️</span>
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <input 
            type="range" 
            min="0" 
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={!src}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🔊</span>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>
    </div>
  )
}