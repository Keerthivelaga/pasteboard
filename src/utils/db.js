import { openDB } from 'idb'

const DB_NAME = 'pasteboard-db'
const STORE = 'snippets'

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('time', 'time')
        store.createIndex('pinned', 'pinned')
      },
    })
  }
  return dbPromise
}

export async function getAllSnippets() {
  const db = await getDB()
  return db.getAll(STORE)
}

export async function addSnippet(snippet) {
  const db = await getDB()
  await db.put(STORE, snippet)
}

export async function updateSnippet(snippet) {
  const db = await getDB()
  await db.put(STORE, snippet)
}

export async function deleteSnippet(id) {
  const db = await getDB()
  await db.delete(STORE, id)
}

export async function clearAll() {
  const db = await getDB()
  await db.clear(STORE)
}
