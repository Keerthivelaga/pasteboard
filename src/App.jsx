import { useState, useEffect, useRef, useCallback } from 'react'
import { useSnippets } from './hooks/useSnippets'
import { useToast } from './hooks/useToast'
import { SnippetCard } from './components/SnippetCard'
import { AddSnippet } from './components/AddSnippet'
import { Toast } from './components/Toast'
import { ShortcutsModal } from './components/ShortcutsModal'

export default function App() {
  const isExtension = typeof chrome !== "undefined" && chrome?.runtime?.id;
  const { snippets, loading, add, remove, togglePin, allTags, update } = useSnippets()
  const { toast, show: showToast } = useToast()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [activeTag, setActiveTag] = useState(null)
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false)
  const searchRef = useRef(null)
  const addRef = useRef(null)

  // Keyboard shortcuts
  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        addRef.current?.focus()
      }
      if (e.key === '?' && !e.target.matches('input,textarea')) {
        setShowShortcuts(v => !v)
      }
      if (e.key === 'Escape') {
        setSearch('')
        setActiveTag(null)
        setShowShortcuts(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filtered = useCallback(() => {
    let list = [...snippets]
    if (activeTab === 'pinned') list = list.filter(s => s.pinned)
    if (activeTag) list = list.filter(s => s.tags?.includes(activeTag))
    if (search) list = list.filter(s =>
      s.text.toLowerCase().includes(search.toLowerCase()) ||
      s.tags?.some(t => t.includes(search.toLowerCase()))
    )
    return list.sort((a, b) => (b.pinned - a.pinned) || (b.time - a.time))
  }, [snippets, activeTab, activeTag, search])

  const results = filtered()
  const pinnedCount = snippets.filter(s => s.pinned).length

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner" />
    </div>
  )
function handleExport() {
  const data = JSON.stringify(snippets, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pasteboard-snippets.json";
  a.click();

  showToast("Exported!");
}
function copyAll() {
  if (snippets.length === 0) {
    showToast("No snippets to copy", "warn");
    return;
  }

  const text = snippets.map(s => s.text).join("\n\n");
  navigator.clipboard.writeText(text);

  showToast("Copied all snippets!");
}
  if (isExtension) {
  document.body.classList.add("extension-mode");
}
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">P</div>
          <span className="logo-text">PasteBoard</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'all' && !activeTag ? 'active' : ''}`}
            onClick={() => { setActiveTab('all'); setActiveTag(null) }}
          >
            <AllIcon /> All snippets
            <span className="nav-count">{snippets.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'pinned' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pinned'); setActiveTag(null) }}
          >
            <PinIcon /> Pinned
            <span className="nav-count">{pinnedCount}</span>
          </button>
        </nav>

        {allTags.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-label">Tags</div>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`nav-item tag-nav ${activeTag === tag ? 'active' : ''}`}
                onClick={() => { setActiveTag(activeTag === tag ? null : tag); setActiveTab('all') }}
              >
                <TagIcon /> {tag}
                <span className="nav-count">{snippets.filter(s => s.tags?.includes(tag)).length}</span>
              </button>
            ))}
          </div>
        )}

        <div className="sidebar-footer">
          <button className="sidebar-action" onClick={handleExport}>⬇️ Export</button>
          <button className="sidebar-action" onClick={copyAll}>📋 Copy All</button>
          <button className="shortcut-hint" onClick={() => setShowShortcuts(true)}>
            <KeyIcon /> Shortcuts
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="main-header">
          <div className="search-wrap">
            <SearchIcon />
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search snippets… (⌘K)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>×</button>
            )}
          </div>

          <div className="header-meta">
            {activeTag && (
              <span className="active-tag-badge">
                #{activeTag}
                <button onClick={() => setActiveTag(null)}>×</button>
              </span>
            )}
            <span className="result-count">{results.length} snippet{results.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <AddSnippet ref={addRef} onAdd={add} onToast={showToast} />

        <div className="snippet-grid">
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><EmptyIcon /></div>
              <p>No snippets found</p>
              <small>{search ? `No results for "${search}"` : 'Paste something to get started'}</small>
            </div>
          ) : (
            results.map((s, i) => (
              <SnippetCard
                key={s.id}
                snippet={s}
                onCopy={() => showToast('Copied!')}
                onPin={togglePin}
                onDelete={remove}
                onEdit={setEditingSnippet}
                onTagClick={tag => { setActiveTag(tag); setActiveTab('all') }}
                style={{ animationDelay: `${i * 30}ms` }}
              />
            ))
          )}
        </div>
        {editingSnippet && (
  <div className="modal-overlay" onClick={() => setEditingSnippet(null)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      
      <h3>Edit Snippet</h3>

      <textarea
        value={editingSnippet.text}
        onChange={(e) =>
          setEditingSnippet({
            ...editingSnippet,
            text: e.target.value,
          })
        }
      />

      <div className="modal-actions">
        <button
          className="modal-cancel"
          onClick={() => setEditingSnippet(null)}
        >
          Cancel
        </button>

        <button
          className="modal-save"
          onClick={() => {
            update(editingSnippet);
            setEditingSnippet(null);
            showToast("Updated!");
          }}
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}
      </main>

      <Toast toast={toast} />
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  )
}

function AllIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
}
function PinIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 2L12 4L9 5.5L7.5 8.5L5.5 6.5L3 9M7.5 8.5L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function TagIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 1.5h5l6 6-5 5-6-6v-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="4.5" cy="4.5" r="1" fill="currentColor"/></svg>
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
}
function KeyIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 7h6M4 7l1.5-1.5M4 7l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function EmptyIcon() {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="8" y="5" width="24" height="30" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14h12M14 20h12M14 26h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="14" y="3" width="12" height="5" rx="2" fill="currentColor" opacity="0.2"/></svg>
}
