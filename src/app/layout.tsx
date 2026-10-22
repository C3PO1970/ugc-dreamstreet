import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DreamStreet — AI-Powered Creator Platform',
  description:
    'Your AI-powered workspace to create content, write captions, plan posts, and grow your audience — for creators, influencers, brands, and businesses.',
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
