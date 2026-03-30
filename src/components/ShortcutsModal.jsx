export function ShortcutsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Keyboard shortcuts</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="shortcuts-list">
          {[
            ['⌘ + Enter', 'Save snippet'],
            ['⌘ + K', 'Focus search'],
            ['⌘ + N', 'Focus new snippet'],
            ['Escape', 'Clear / close'],
            ['Paste anywhere', 'Auto-capture clipboard'],
            ['Click card', 'Copy to clipboard'],
          ].map(([key, desc]) => (
            <div key={key} className="shortcut-row">
              <kbd>{key}</kbd>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
