'use client'

import type { KeyboardEvent, ReactNode } from 'react'

interface SelectionCardProps {
  title: string
  description?: string
  selected?: boolean
  disabled?: boolean
  onSelect: () => void
  /** Visual badge, e.g. "Primary" */
  badge?: string
  children?: ReactNode
  className?: string
}

export function SelectionCard({
  title,
  description,
  selected = false,
  disabled = false,
  onSelect,
  badge,
  children,
  className = '',
}: SelectionCardProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`group relative w-full text-left p-4 rounded-xl border transition-all outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 ${
        selected
          ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_0_1px_rgba(139,92,246,0.4)]'
          : 'bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-900/80'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold ${
                selected ? 'text-white' : 'text-gray-100'
              }`}
            >
              {title}
            </span>
            {badge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide bg-purple-500/30 text-purple-200">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-400 leading-relaxed">{description}</p>
          )}
          {children}
        </div>
        <span
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected
              ? 'border-purple-400 bg-purple-500'
              : 'border-gray-600 group-hover:border-gray-500'
          }`}
          aria-hidden
        >
          {selected && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6.5L5 9L9.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>
    </button>
  )
}
