import { useState, useEffect, useCallback } from 'react'
import { getAllSnippets, addSnippet, updateSnippet, deleteSnippet } from '../utils/db'

const SEED = [
  { id: 1, text: 'npm install && npm run dev', tags: ['dev'], pinned: true, time: Date.now() - 7200000 },
  { id: 2, text: 'git commit -m "feat: add clipboard manager"', tags: ['git'], pinned: false, time: Date.now() - 3600000 },
  { id: 3, text: 'https://github.com/your-username/pasteboard', tags: ['links'], pinned: false, time: Date.now() - 1800000 },
  { id: 4, text: 'console.log("Hello, PasteBoard!")', tags: ['dev'], pinned: false, time: Date.now() - 600000 },
]

export function useSnippets() {
  const isExtension = typeof chrome !== "undefined" && chrome.storage;
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
  if (isExtension) {
    chrome.storage.local.get(["snippets"], (result) => {
      const data = result.snippets || [];

      if (data.length === 0) {
        setSnippets(SEED);
      } else {
        setSnippets(data);
      }

      setLoading(false);
    });
  } else {
    getAllSnippets().then(async (data) => {
      if (data.length === 0) {
        for (const s of SEED) await addSnippet(s);
        setSnippets(SEED);
      } else {
        setSnippets(data);
      }
      setLoading(false);
    });
  }
}, []);

  const add = useCallback(async (text, tags = []) => {
  const snippet = {
    id: Date.now(),
    text: text.trim(),
    tags,
    pinned: false,
    time: Date.now()
  };

  setSnippets(prev => {
    const updated = [snippet, ...prev];

    if (isExtension) {
      chrome.storage.local.set({ snippets: updated });
    } else {
      addSnippet(snippet);
    }

    return updated;
  });

  return 'added';
}, [])

 const remove = useCallback(async (id) => {
  setSnippets(prev => {
    const updated = prev.filter(s => s.id !== id);

    if (isExtension) {
      chrome.storage.local.set({ snippets: updated });
    } else {
      deleteSnippet(id);
    }

    return updated;
  });
}, [])

  const togglePin = useCallback(async (id) => {
    setSnippets(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s)
      const target = updated.find(s => s.id === id)
      updateSnippet(target)
      return updated
    })
  }, [])

  const updateTags = useCallback(async (id, tags) => {
    setSnippets(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, tags } : s)
      const target = updated.find(s => s.id === id)
      updateSnippet(target)
      return updated
    })
  }, [])

  const update = useCallback(async (updatedSnippet) => {
  setSnippets(prev => {
    const updated = prev.map(s =>
      s.id === updatedSnippet.id ? updatedSnippet : s
    );

    if (isExtension) {
      chrome.storage.local.set({ snippets: updated });
    } else {
      updateSnippet(updatedSnippet);
    }

    return updated;
  });

  await updateSnippet(updatedSnippet); // DB update
}, []);

  const allTags = [...new Set(snippets.flatMap(s => s.tags || []))].sort()

  return { snippets, loading, add, remove, togglePin, updateTags, allTags, update}
}
