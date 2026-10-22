import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Nav */}
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
              DS
            </div>
            <span className="font-semibold text-white">DreamStreet</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
          <span>✨</span>
          <span>AI-Powered Creator Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Create Smarter.
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Grow Faster.
          </span>
        </h1>

        <p className="text-lg text-gray-400 mb-4 max-w-2xl mx-auto">
          Your AI-powered workspace to create content, write captions, plan posts, and grow
          your audience — all in one place.
        </p>
        <p className="text-sm text-purple-300/90 mb-10">
          For creators, influencers, brands, and businesses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white font-medium transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* Features */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl mb-4">
              ✨
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Content Generation</h3>
            <p className="text-gray-400 text-sm">
              Generate hooks, captions, and scripts tailored to your industry, audience, and
              brand voice.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-2xl mb-4">
              📅
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Planning</h3>
            <p className="text-gray-400 text-sm">
              Plan 7, 14, or 30 days of content in minutes. Stay consistent without the stress.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl mb-4">
              📲
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">One-Tap Posting</h3>
            <p className="text-gray-400 text-sm">
              Copy your caption and open Instagram or Facebook instantly. No complicated APIs.
            </p>
          </div>
        </div>

        {/* Who it's for */}
        <div className="mt-20 text-left max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-white text-center mb-6">
            Built for every kind of creator
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-400">
            <li className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              Influencers &amp; UGC creators — sponsored and brand deliverables
            </li>
            <li className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              Video creators, YouTubers &amp; photographers — clips and portfolios
            </li>
            <li className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              Podcasters &amp; educators — episodes and instructional posts
            </li>
            <li className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              Musicians, brands &amp; businesses — releases, offers, and community
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} DreamStreet. For creators, influencers, brands, and
          businesses.
        </div>
      </footer>
    </div>
  )
}
