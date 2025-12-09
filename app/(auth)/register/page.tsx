'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 py-8">
      <div className="card max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-2">
            Join FolseTech
          </h1>
          <p className="text-gray-400">Create your AI music production account</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <div className="flex items-start">
            <input type="checkbox" className="accent-purple-600 mr-2 mt-1" id="terms" />
            <label htmlFor="terms" className="text-sm text-gray-400">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button type="submit" className="btn-primary w-full">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-400 flex items-center justify-center">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}