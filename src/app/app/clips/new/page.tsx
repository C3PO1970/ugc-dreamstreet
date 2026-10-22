'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube_shorts', label: 'YouTube Shorts' },
] as const

const CATEGORIES = [
  { value: 'promo', label: 'Promo' },
  { value: 'bts', label: 'Behind the Scenes' },
  { value: 'performance', label: 'Performance' },
  { value: 'education', label: 'Education' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
] as const

export default function NewClipPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [category, setCategory] = useState('promo')
  const [audience, setAudience] = useState('')
  const [publishDate, setPublishDate] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : null)
    // File is not uploaded in this step — selection is UI-only.
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Intentionally no save/upload — enabled in a later step.
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/app/clips"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-3"
        >
          ← Back to Video Library
        </Link>
        <p className="text-xs font-medium uppercase tracking-wider text-purple-400 mb-1">
          ClipSlot Lite
        </p>
        <h1 className="text-2xl font-bold text-white">Add Video</h1>
        <p className="text-gray-400 text-sm mt-1">
          Describe your finished video and choose a file. Saving and uploading are not
          enabled yet.
        </p>
      </div>

      {/* Next-step notice */}
      <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-sm">
        <strong className="font-medium text-amber-100">Form preview only.</strong>{' '}
        Video upload, database storage, and AI content generation will be enabled in the
        next development steps. Nothing you enter here is saved.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5">
            Video title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Studio session — verse 2 teaser"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Video description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this video about? Any context for future AI captions..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors resize-none"
          />
        </div>

        {/* Platform */}
        <div>
          <label
            htmlFor="platform"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Target platform *
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Content category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Audience */}
        <div>
          <label
            htmlFor="audience"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Target audience
          </label>
          <input
            id="audience"
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., Fans who like chill late-night R&B"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          />
        </div>

        {/* Publishing date */}
        <div>
          <label
            htmlFor="publishDate"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Planned publishing date{' '}
            <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="publishDate"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
          />
        </div>

        {/* Video file — selection only */}
        <div>
          <label htmlFor="videoFile" className="block text-sm font-medium text-gray-300 mb-1.5">
            Video file
          </label>
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/50 p-6 text-center">
            <input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600/80 file:text-white hover:file:bg-purple-500 file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-3">
              {fileName
                ? `Selected (not uploaded): ${fileName}`
                : 'Choose a video file to preview selection. Upload is disabled in this step.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/app/clips"
            className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-center transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled
            className="flex-1 py-2.5 rounded-lg bg-purple-600/40 text-purple-200/70 font-medium cursor-not-allowed"
            title="Saving will be enabled in a later step"
          >
            Save Video · Coming Soon
          </button>
        </div>

        <p className="text-center text-xs text-gray-500">
          You can explore the form fields now. Persistence and file upload ship next.
        </p>
      </form>
    </div>
  )
}
