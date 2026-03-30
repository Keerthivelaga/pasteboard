# PasteBoard

A fast, minimal clipboard manager that lives in your browser. Save snippets, tag them, search them, and copy them back instantly.

## Features

- **Auto-capture** — paste anywhere on the page to save instantly
- **Tags & categories** — organize snippets with tags, filter by tag in the sidebar
- **Keyboard-first** — full keyboard shortcut support
- **IndexedDB storage** — handles large amounts of data, persists across sessions
- **Pin snippets** — keep important snippets pinned to the top
- **Search** — instant full-text search across all snippets

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| ⌘ + Enter | Save snippet |
| ⌘ + K | Focus search |
| ⌘ + N | Focus new snippet input |
| Escape | Clear / close |
| Paste anywhere | Auto-capture clipboard |
| Click card | Copy to clipboard |
| ? | Toggle shortcuts help |

## Tech Stack

- **React 18** + **Vite** — fast dev experience
- **IndexedDB** via `idb` — robust browser storage
- **No backend** — fully client-side, zero config

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## Project Structure

```
src/
  components/
    AddSnippet.jsx     # Input area with tag editor
    SnippetCard.jsx    # Individual snippet card
    ShortcutsModal.jsx # Keyboard shortcuts help
    Toast.jsx          # Notification toast
  hooks/
    useSnippets.js     # All snippet state + IndexedDB sync
    useToast.js        # Toast notification state
  utils/
    db.js              # IndexedDB wrapper
  App.jsx              # Main layout + keyboard shortcuts
  main.jsx             # Entry point
  index.css            # Global styles
```
