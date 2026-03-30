import { useState } from 'react'

const TAG_COLORS = {
  dev: '#1a1a2e',
  git: '#2d1b4e',
  links: '#1a2d1a',
  work: '#2d1a1a',
  default: '#1a1a1a',
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return Math.floor(diff / 86400000) + 'd ago'
}

export function SnippetCard({ snippet, onCopy, onPin, onDelete, onEdit, onTagClick, style }) {
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(snippet.text).then(() => {
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(snippet.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2000)
    }
  }

  return (
    <div
      className={`snippet-card ${snippet.pinned ? 'pinned' : ''} ${copied ? 'copying' : ''}`}
      onClick={handleCopy}
      style={style}
    >
      <div className="card-inner">
        <div className="card-top">
          <pre className="snippet-text">{snippet.text}</pre>
          <div className="card-actions" onClick={e => e.stopPropagation()}>
            <button
              className={`action-btn pin-btn ${snippet.pinned ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onPin(snippet.id) }}
              title={snippet.pinned ? 'Unpin' : 'Pin'}
            >
              <PinIcon />
            </button>
            <button
              className={`action-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
              onClick={handleDelete}
              title={confirmDelete ? 'Click again to confirm' : 'Delete'}
            >
              {confirmDelete ? <WarningIcon /> : <TrashIcon />}
            </button>
            <button className="action-btn edit-btn" onClick={(e) => {e.stopPropagation();onEdit(snippet);}}title="Edit">✏️</button>
          </div>
        </div>

        {snippet.tags?.length > 0 && (
          <div className="card-tags">
            {snippet.tags.map(tag => (
              <span
                key={tag}
                className="tag"
                onClick={e => { e.stopPropagation(); onTagClick?.(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <span className="card-time">{timeAgo(snippet.time)}</span>
          <span className={`copy-hint ${copied ? 'show' : ''}`}>
            {copied ? '✓ copied' : 'click to copy'}
          </span>
        </div>
      </div>

      {snippet.pinned && <div className="pin-indicator" />}
    </div>
  )
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9 1.5L11.5 4L8.5 5.5L7 8.5L5 6.5L2 9.5M7 8.5L5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 3.5h9M5 3.5V2.5a1 1 0 012 0v1M4.5 3.5l.5 7h3l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 2L11.5 11H1.5L6.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M6.5 5.5v2.5M6.5 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
