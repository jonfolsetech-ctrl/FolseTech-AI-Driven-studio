'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function DashboardPage() {
  const [projects] = useState([
    { id: 1, name: 'My Beat Project', type: 'Beat', date: '2025-12-08', status: 'In Progress' },
    { id: 2, name: 'Mixed Track 01', type: 'Mixing', date: '2025-12-07', status: 'Completed' },
    { id: 3, name: 'Master Final', type: 'Mastering', date: '2025-12-06', status: 'Completed' },
  ])

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">Dashboard</h1>
          <Link href="/" className="btn-secondary">Home</Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-400 text-sm mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-purple-400">12</p>
          </div>
          <div className="card">
            <h3 className="text-gray-400 text-sm mb-2">Beats Generated</h3>
            <p className="text-3xl font-bold text-blue-400">45</p>
          </div>
          <div className="card">
            <h3 className="text-gray-400 text-sm mb-2">Tracks Mixed</h3>
            <p className="text-3xl font-bold text-green-400">28</p>
          </div>
          <div className="card">
            <h3 className="text-gray-400 text-sm mb-2">Hours Saved</h3>
            <p className="text-3xl font-bold text-pink-400">156</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/beat-generator" className="card hover:scale-105 text-center">
              <div className="text-5xl mb-3">🎵</div>
              <h3 className="font-semibold">Generate Beat</h3>
            </Link>
            <Link href="/mixing" className="card hover:scale-105 text-center">
              <div className="text-5xl mb-3">🎚️</div>
              <h3 className="font-semibold">Mix Track</h3>
            </Link>
            <Link href="/mastering" className="card hover:scale-105 text-center">
              <div className="text-5xl mb-3">🎼</div>
              <h3 className="font-semibold">Master Track</h3>
            </Link>
            <Link href="/speech-to-singing" className="card hover:scale-105 text-center">
              <div className="text-5xl mb-3">🎤</div>
              <h3 className="font-semibold">Speech to Singing</h3>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
          <div className="card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-gray-400 font-semibold">Name</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">Type</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">Date</th>
                  <th className="text-left py-3 text-gray-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-4">{project.name}</td>
                    <td className="py-4">
                      <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                        {project.type}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{project.date}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.status === 'Completed' 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}