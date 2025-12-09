import Link from 'next/link'

export default function Hero() {
  return (
    <div className='min-h-[90vh] flex items-center justify-center relative overflow-hidden'>
      {/* Animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20'></div>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.1),transparent_50%)]'></div>
      
      <div className='relative z-10 text-center max-w-5xl mx-auto px-4'>
        <h1 className='text-6xl md:text-8xl font-bold mb-6 text-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:0_0_30px_rgba(147,51,234,0.8),0_0_60px_rgba(147,51,234,0.6),0_0_90px_rgba(147,51,234,0.4)]'>
          FolseTech Pro AI Studio
        </h1>
        <p className='text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto'>
          Create professional music with AI-powered tools for beat generation, mixing, mastering, and more
        </p>
        
        <div className='flex flex-wrap gap-4 justify-center'>
          <Link href='/beat-generator' className='btn-primary'>
            Generate Beats
          </Link>
          <Link href='/dashboard' className='btn-secondary'>
            Go to Dashboard
          </Link>
        </div>
        
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto'>
          <Link href='/beat-generator' className='card hover:scale-105'>
            <div className='text-4xl mb-2'>🎵</div>
            <h3 className='font-semibold'>Beat Generator</h3>
          </Link>
          <Link href='/mixing' className='card hover:scale-105'>
            <div className='text-4xl mb-2'>🎚️</div>
            <h3 className='font-semibold'>AI Mixing</h3>
          </Link>
          <Link href='/mastering' className='card hover:scale-105'>
            <div className='text-4xl mb-2'>🎼</div>
            <h3 className='font-semibold'>Mastering</h3>
          </Link>
          <Link href='/speech-to-singing' className='card hover:scale-105'>
            <div className='text-4xl mb-2'>🎤</div>
            <h3 className='font-semibold'>Speech to Singing</h3>
          </Link>
        </div>
      </div>
    </div>
  )
}