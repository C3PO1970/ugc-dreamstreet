'use client'

import type { ReactNode } from 'react'

interface SelectionGridProps {
  label: string
  description?: string
  children: ReactNode
  columns?: 1 | 2 | 3
  /** For multi-select groups */
  multiSelect?: boolean
}

export function SelectionGrid({
  label,
  description,
  children,
  columns = 2,
  multiSelect = false,
}: SelectionGridProps) {
  const colClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-medium text-gray-200">{label}</h2>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div
        role="listbox"
        aria-label={label}
        aria-multiselectable={multiSelect || undefined}
        className={`grid ${colClass} gap-3`}
      >
        {children}
      </div>
    </div>
  )
}
