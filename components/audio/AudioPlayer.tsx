'use client'
import { useState } from 'react'

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(180) // 3 minutes

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
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
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
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
            className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            defaultValue="70"
          />
        </div>
      </div>
    </div>
  )
}