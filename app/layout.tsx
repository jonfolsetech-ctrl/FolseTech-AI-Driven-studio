import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FolseTech Pro AI Studio',
  description: 'Professional AI-powered music production studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-black text-white antialiased'>
        {children}
      </body>
    </html>
  )
}