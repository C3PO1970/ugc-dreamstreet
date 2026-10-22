'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const navItems: {
  href: string
  label: string
  icon: string
  matchPrefix?: boolean
  /** Extra paths that should highlight this nav item (e.g. legacy routes). */
  alsoActiveFor?: string[]
}[] = [
  { href: '/app/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/app/plan', label: 'Content Plan', icon: '📅' },
  { href: '/app/library', label: 'Library', icon: '📚' },
  { href: '/app/clips', label: 'ClipSlot Lite', icon: '🎬', matchPrefix: true },
  {
    href: '/app/profile',
    label: 'Creator Profile',
    icon: '✨',
    alsoActiveFor: ['/app/artist'],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
              DS
            </div>
            <span className="font-semibold text-white hidden sm:block">DreamStreet</span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.matchPrefix
                ? pathname.startsWith(item.href)
                : pathname === item.href ||
                  (item.alsoActiveFor?.some(
                    (p) => pathname === p || pathname.startsWith(p + '/')
                  ) ?? false)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <button
            onClick={handleSignOut}
            className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
