export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`toast ${toast ? 'show' : ''} ${toast?.type === 'warn' ? 'warn' : ''}`} key={toast?.id}>
      {toast?.message}
    </div>
  )
}
