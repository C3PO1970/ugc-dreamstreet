import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UGC DreamStreet - Content Planning for Music Creators',
  description: 'Generate and organize UGC content for your music. Plan posts, get AI-generated captions, and grow your audience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
