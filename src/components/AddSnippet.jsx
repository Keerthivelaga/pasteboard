import { useState, useRef, useEffect, forwardRef } from 'react'

const SUGGESTED_TAGS = ['dev', 'git', 'links', 'work', 'notes', 'config']

export const AddSnippet = forwardRef(function AddSnippet({ onAdd, onToast }, ref) {
  const [text, setText] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [expanded, setExpanded] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    if (ref) ref.current = textRef.current
  }, [ref])

  useEffect(() => {
    function handleGlobalPaste(e) {
      if (document.activeElement === textRef.current) return
      if (document.activeElement?.matches('input,textarea')) return
      const pasted = e.clipboardData.getData('text')
      if (pasted.trim()) {
        setText(pasted)
        setExpanded(true)
        setTimeout(() => textRef.current?.focus(), 0)
      }
    }
    document.addEventListener('paste', handleGlobalPaste)
    return () => document.removeEventListener('paste', handleGlobalPaste)
  }, [])

  async function handleSave() {
    if (!text.trim()) return
    const result = await onAdd(text, tags)
    if (result === 'duplicate') {
      onToast('Already saved', 'warn')
    } else {
      onToast('Saved!')
      setText('')
      setTags([])
      setTagInput('')
      setExpanded(false)
    }
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setText(''); setExpanded(false); textRef.current?.blur() }
  }

  function addTag(tag) {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, '-')
    if (clean && !tags.includes(clean)) setTags(prev => [...prev, clean])
    setTagInput('')
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) }
    if (e.key === 'Backspace' && !tagInput) setTags(prev => prev.slice(0, -1))
  }

  return (
    <div className={`add-area ${expanded ? 'expanded' : ''}`}>
      <textarea
        ref={textRef}
        className="add-input"
        placeholder="Paste or type a snippet… (⌘↵ to save)"
        value={text}
        onChange={e => { setText(e.target.value); if (e.target.value) setExpanded(true) }}
        onKeyDown={handleKeyDown}
        onFocus={() => setExpanded(true)}
        rows={expanded ? 3 : 1}
      />
      {expanded && (
        <div className="add-footer">
          <div className="tag-editor">
            {tags.map(t => (
              <span key={t} className="tag removable">
                {t}
                <button onClick={() => setTags(tags.filter(x => x !== t))}>×</button>
              </span>
            ))}
            <input
              className="tag-input"
              placeholder="add tag…"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>
          <div className="tag-suggestions">
            {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map(t => (
              <button key={t} className="tag-suggest" onClick={() => addTag(t)}>{t}</button>
            ))}
          </div>
          <div className="add-actions">
            <span className="hint">⌘↵ save · esc cancel</span>
            <button className="save-btn" onClick={handleSave} disabled={!text.trim()}>Save snippet</button>
          </div>
        </div>
      )}
    </div>
  )
})
