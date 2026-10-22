'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { ContentLibraryItem } from '@/lib/supabase'

type ItemType = ContentLibraryItem['item_type']

const ITEM_TYPES: { type: ItemType; label: string; icon: string; description: string }[] = [
  {
    type: 'lyrics',
    label: 'Key Lines',
    icon: '✏️',
    description: 'Taglines, quotes, hooks, or memorable lines (musicians can paste lyrics here)',
  },
  {
    type: 'song_meaning',
    label: 'Core Message',
    icon: '💭',
    description: 'The main story or message behind your content, offer, or episode',
  },
  {
    type: 'release_notes',
    label: 'Launch Notes',
    icon: '📢',
    description: 'Upcoming drops, launches, episodes, products, or campaigns',
  },
  {
    type: 'personal_story',
    label: 'Brand Story',
    icon: '📖',
    description: 'Your journey, brand story, inspirations, or behind-the-scenes context',
  },
  {
    type: 'audience_notes',
    label: 'Audience Notes',
    icon: '👥',
    description: 'Who your audience is and what they respond to',
  },
]

export default function LibraryPage() {
  const [items, setItems] = useState<ContentLibraryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Partial<ContentLibraryItem> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!workspace) {
      setIsLoading(false)
      return
    }

    setWorkspaceId(workspace.id)

    const { data } = await supabase
      .from('content_library_items')
      .select('*')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })

    setItems(data || [])
    setIsLoading(false)
  }

  function startNewItem(type: ItemType) {
    setEditingItem({
      item_type: type,
      title: '',
      content: '',
    })
  }

  function startEditItem(item: ContentLibraryItem) {
    setEditingItem(item)
  }

  async function saveItem() {
    if (!editingItem || !workspaceId) return
    if (!editingItem.title?.trim() || !editingItem.content?.trim()) return

    setIsSaving(true)

    const itemData = {
      workspace_id: workspaceId,
      item_type: editingItem.item_type,
      title: editingItem.title,
      content: editingItem.content,
      updated_at: new Date().toISOString(),
    }

    if (editingItem.id) {
      // Update
      await supabase
        .from('content_library_items')
        .update(itemData)
        .eq('id', editingItem.id)
    } else {
      // Create
      await supabase
        .from('content_library_items')
        .insert(itemData)
    }

    setEditingItem(null)
    setIsSaving(false)
    loadItems()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this item?')) return

    await supabase
      .from('content_library_items')
      .delete()
      .eq('id', id)

    loadItems()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Content Library</h1>
        <p className="text-gray-400 text-sm mt-1">
          Add reusable source material so AI can write posts that match your niche — influencers,
          brands, educators, podcasters, musicians, and more.
        </p>
      </div>

      <div className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-400">
        <span className="text-gray-300 font-medium">Tip: </span>
        Use <span className="text-white">Key Lines</span> for quotes and taglines. Musicians can
        use the same field for lyrics. Everyone can use Core Message, Launch Notes, Brand Story,
        and Audience Notes.
      </div>

      {/* Add New Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {ITEM_TYPES.map((type) => (
          <button
            key={type.type}
            onClick={() => startNewItem(type.type)}
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all text-left group"
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
              {type.label}
            </div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              {type.description}
            </div>
          </button>
        ))}
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-lg font-semibold text-white mb-2">Your library is empty</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Add key lines, core messages, launch notes, and audience context. The AI will use
            these to create authentic content for any creator type.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Items</h2>
          <div className="grid gap-4">
            {items.map((item) => {
              const typeInfo = ITEM_TYPES.find((t) => t.type === item.item_type)
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{typeInfo?.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{item.title}</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400">
                          {typeInfo?.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{item.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditItem(item)}
                        className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingItem.id ? 'Edit Item' : 'Add New Item'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g., Verse from 'Summer Nights'"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Content
                </label>
                <textarea
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Paste your content here..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
