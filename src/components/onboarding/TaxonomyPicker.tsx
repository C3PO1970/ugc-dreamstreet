'use client'

import { useMemo, useState } from 'react'
import type { IndustryOption, NicheNode, NicheSelection } from '@/lib/identity/types'
import { MAX_NICHE_SELECTIONS } from '@/lib/identity/catalogs'

interface TaxonomyPickerProps {
  industries: IndustryOption[]
  selections: NicheSelection[]
  customNiches: string[]
  onChangeSelections: (next: NicheSelection[]) => void
  onChangeCustomNiches: (next: string[]) => void
  maxSelections?: number
}

function flattenMatches(
  industries: IndustryOption[],
  query: string
): { industry: IndustryOption; path: NicheNode[]; labels: string[] }[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: { industry: IndustryOption; path: NicheNode[]; labels: string[] }[] = []

  function walk(
    industry: IndustryOption,
    nodes: NicheNode[],
    ancestors: NicheNode[],
    ancestorLabels: string[]
  ) {
    for (const node of nodes) {
      const labels = [...ancestorLabels, node.label]
      const path = [...ancestors, node]
      const haystack = [industry.label, ...labels].join(' ').toLowerCase()
      if (haystack.includes(q)) {
        results.push({ industry, path, labels })
      }
      if (node.children?.length) {
        walk(industry, node.children, path, labels)
      }
    }
  }

  for (const industry of industries) {
    if (industry.label.toLowerCase().includes(q)) {
      results.push({ industry, path: [], labels: [] })
    }
    walk(industry, industry.niches, [], [])
  }

  return results.slice(0, 24)
}

function buildSelection(
  industry: IndustryOption,
  path: NicheNode[]
): NicheSelection {
  const pathIds = path.map((n) => n.id)
  const pathLabels = path.map((n) => n.label)
  const slug = [industry.id, ...pathIds].join('/')
  return {
    industryId: industry.id,
    industryLabel: industry.label,
    pathIds,
    pathLabels,
    slug,
  }
}

function selectionKey(s: NicheSelection) {
  return s.slug
}

export function TaxonomyPicker({
  industries,
  selections,
  customNiches,
  onChangeSelections,
  onChangeCustomNiches,
  maxSelections = MAX_NICHE_SELECTIONS,
}: TaxonomyPickerProps) {
  const [search, setSearch] = useState('')
  const [activeIndustryId, setActiveIndustryId] = useState<string | null>(
    industries[0]?.id ?? null
  )
  const [pathStack, setPathStack] = useState<NicheNode[]>([])
  const [customInput, setCustomInput] = useState('')

  const activeIndustry = industries.find((i) => i.id === activeIndustryId) ?? null

  const currentNodes: NicheNode[] = useMemo(() => {
    if (!activeIndustry) return []
    if (pathStack.length === 0) return activeIndustry.niches
    const last = pathStack[pathStack.length - 1]
    return last.children ?? []
  }, [activeIndustry, pathStack])

  const searchResults = useMemo(
    () => flattenMatches(industries, search),
    [industries, search]
  )

  const atLimit = selections.length + customNiches.length >= maxSelections

  function toggleSelection(next: NicheSelection) {
    const key = selectionKey(next)
    const exists = selections.some((s) => selectionKey(s) === key)
    if (exists) {
      onChangeSelections(selections.filter((s) => selectionKey(s) !== key))
      return
    }
    if (atLimit) return
    onChangeSelections([...selections, next])
  }

  function isSelected(slug: string) {
    return selections.some((s) => s.slug === slug)
  }

  function addCustom() {
    const label = customInput.trim()
    if (!label) return
    if (customNiches.some((c) => c.toLowerCase() === label.toLowerCase())) {
      setCustomInput('')
      return
    }
    if (atLimit) return
    onChangeCustomNiches([...customNiches, label])
    setCustomInput('')
  }

  function removeCustom(label: string) {
    onChangeCustomNiches(customNiches.filter((c) => c !== label))
  }

  function selectIndustryOnly(industry: IndustryOption) {
    toggleSelection(buildSelection(industry, []))
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label htmlFor="niche-search" className="block text-sm font-medium text-gray-300 mb-1.5">
          Search industries & niches
        </label>
        <input
          id="niche-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g., Tech House, Skincare, Artificial Intelligence"
          className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
        />
      </div>

      {search.trim() ? (
        <div
          role="listbox"
          aria-label="Search results"
          className="rounded-xl border border-gray-800 bg-gray-900/60 divide-y divide-gray-800 max-h-72 overflow-y-auto"
        >
          {searchResults.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No matches. Try another term or add a custom niche below.</p>
          ) : (
            searchResults.map((result) => {
              const sel = buildSelection(result.industry, result.path)
              const selected = isSelected(sel.slug)
              const label =
                result.labels.length > 0
                  ? `${result.industry.label} → ${result.labels.join(' → ')}`
                  : result.industry.label
              return (
                <button
                  key={sel.slug}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => toggleSelection(sel)}
                  disabled={!selected && atLimit}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:bg-purple-500/10 ${
                    selected
                      ? 'bg-purple-600/20 text-purple-100'
                      : 'text-gray-300 hover:bg-gray-800/80'
                  } disabled:opacity-40`}
                >
                  {label}
                </button>
              )
            })
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,11rem)_1fr] gap-4">
          {/* Industry list */}
          <div
            role="listbox"
            aria-label="Industries"
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1"
          >
            {industries.map((industry) => {
              const active = industry.id === activeIndustryId
              return (
                <button
                  key={industry.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setActiveIndustryId(industry.id)
                    setPathStack([])
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none ${
                    active
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {industry.label}
                </button>
              )
            })}
          </div>

          {/* Niche drill-down */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 min-h-[220px]">
            {activeIndustry && (
              <>
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-400">
                  <button
                    type="button"
                    onClick={() => setPathStack([])}
                    className="hover:text-purple-300 transition-colors focus-visible:outline-none focus-visible:text-purple-300"
                  >
                    {activeIndustry.label}
                  </button>
                  {pathStack.map((node, idx) => (
                    <span key={node.id} className="flex items-center gap-2">
                      <span aria-hidden>→</span>
                      <button
                        type="button"
                        onClick={() => setPathStack(pathStack.slice(0, idx + 1))}
                        className="hover:text-purple-300 transition-colors focus-visible:outline-none focus-visible:text-purple-300"
                      >
                        {node.label}
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => selectIndustryOnly(activeIndustry)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none ${
                      isSelected(activeIndustry.id)
                        ? 'bg-purple-600/30 border-purple-500 text-purple-100'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    Select “{activeIndustry.label}” broadly
                  </button>
                  {pathStack.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        toggleSelection(buildSelection(activeIndustry, pathStack))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none ${
                        isSelected(
                          buildSelection(activeIndustry, pathStack).slug
                        )
                          ? 'bg-purple-600/30 border-purple-500 text-purple-100'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      Select this path
                    </button>
                  )}
                </div>

                <div
                  role="listbox"
                  aria-label="Niches"
                  className="grid sm:grid-cols-2 gap-2"
                >
                  {currentNodes.map((node) => {
                    const nextPath = [...pathStack, node]
                    const sel = buildSelection(activeIndustry, nextPath)
                    const selected = isSelected(sel.slug)
                    const hasChildren = Boolean(node.children?.length)

                    return (
                      <div key={node.id} className="flex gap-1">
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => toggleSelection(sel)}
                          disabled={!selected && atLimit}
                          className={`flex-1 text-left px-3 py-2.5 rounded-lg text-sm border transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none disabled:opacity-40 ${
                            selected
                              ? 'bg-purple-600/25 border-purple-500 text-white'
                              : 'bg-gray-950/50 border-gray-800 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {node.label}
                        </button>
                        {hasChildren && (
                          <button
                            type="button"
                            aria-label={`Browse ${node.label} sub-niches`}
                            onClick={() => setPathStack(nextPath)}
                            className="px-2.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
                          >
                            →
                          </button>
                        )}
                      </div>
                    )
                  })}
                  {currentNodes.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-full">
                      No further sub-niches. Use “Select this path” above.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Selected chips */}
      {(selections.length > 0 || customNiches.length > 0) && (
        <div>
          <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Selected ({selections.length + customNiches.length}/{maxSelections})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selections.map((s) => {
              const label =
                s.pathLabels.length > 0
                  ? `${s.industryLabel} → ${s.pathLabels.join(' → ')}`
                  : s.industryLabel
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() =>
                    onChangeSelections(selections.filter((x) => x.slug !== s.slug))
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-purple-600/25 text-purple-100 border border-purple-500/40 hover:bg-purple-600/40 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
                  aria-label={`Remove ${label}`}
                >
                  {label}
                  <span aria-hidden>×</span>
                </button>
              )
            })}
            {customNiches.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => removeCustom(label)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-gray-800 text-gray-200 border border-gray-700 hover:border-gray-500 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
                aria-label={`Remove custom niche ${label}`}
              >
                {label}
                <span aria-hidden>×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom niche */}
      <div>
        <label htmlFor="custom-niche" className="block text-sm font-medium text-gray-300 mb-1.5">
          Custom niche
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="custom-niche"
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustom()
              }
            }}
            placeholder="Add a niche that isn’t listed"
            disabled={atLimit}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={atLimit || !customInput.trim()}
            className="px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
