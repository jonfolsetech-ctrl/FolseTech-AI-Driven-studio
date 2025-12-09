'use client'
import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'

export default function Home() {
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  useEffect(() => {
    // Show announcement on first visit
    const hasSeenAnnouncement = sessionStorage.getItem('hasSeenAnnouncement')
    if (!hasSeenAnnouncement) {
      setShowAnnouncement(true)
    }
  }, [])

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false)
    sessionStorage.setItem('hasSeenAnnouncement', 'true')
  }

  return (
    <main>
      {/* Announcement Modal */}
      {showAnnouncement && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseAnnouncement}
        >
          <div 
            className="bg-gradient-to-br from-purple-900/90 to-black border-2 border-purple-500 rounded-2xl max-w-2xl w-full p-8 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseAnnouncement}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>

            {/* Announcement Content */}
            <div className="text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
                Welcome to FolseTech Pro AI Studio!
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Your AI-Powered Music Production Studio
              </p>
              
              <div className="text-left space-y-4 mb-8">
                <div className="bg-black/50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-400 mb-2">🎤 Speech to Singing</h3>
                  <p className="text-sm text-gray-300">Convert your voice into singing with AI. Record or upload audio, paste your lyrics, and let AI transform your voice!</p>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-400 mb-2">🎵 Beat Generator</h3>
                  <p className="text-sm text-gray-300">Create custom beats with AI. Add style descriptions to generate unique instrumentals.</p>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-400 mb-2">🎚️ Mixing Studio</h3>
                  <p className="text-sm text-gray-300">Combine vocals and instrumentals to create full songs. Upload your tracks and mix them together!</p>
                </div>
              </div>

              <button
                onClick={handleCloseAnnouncement}
                className="btn-primary w-full"
              >
                Get Started 🚀
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                This is a beta platform. AI integration coming soon!
              </p>
            </div>
          </div>
        </div>
      )}

      <Hero />
    </main>
  )
}