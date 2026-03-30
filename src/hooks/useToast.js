import { useState, useCallback } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const show = useCallback((message, type = 'default') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 2000)
  }, [])

  return { toast, show }
}
