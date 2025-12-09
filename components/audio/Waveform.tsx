'use client'

export default function Waveform() {
  const bars = 60
  const heights = Array.from({ length: bars }, () => Math.random() * 80 + 20)

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-32 flex items-center gap-0.5">
      {heights.map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t transition-all duration-200 hover:from-purple-500 hover:to-blue-400"
          style={{ height: `${height}%` }}
        ></div>
      ))}
    </div>
  )
}