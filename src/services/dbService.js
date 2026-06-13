import { createSeedDatabase } from '../data/seed'
import { getDb, setDb, clearAll } from '../lib/storage'

let cache = null

function load() {
  if (cache) return cache
  let db = getDb()
  const fresh = createSeedDatabase()          // ← baca versi terbaru
  if (!db || db.version !== fresh.version) {  // ← bandingkan versi
    db = fresh
    setDb(db)
  }
  cache = db
  return db
}

function save(db) {
  db.updatedAt = new Date().toISOString()
  cache = db
  setDb(db)
  return db
}

export function invalidateCache() {
  cache = null
}

export function getDatabase() {
  return structuredClone(load())
}

export function updateDatabase(updater) {
  const db = load()
  const next = typeof updater === 'function' ? updater(structuredClone(db)) : updater
  return save(next)
}

export function resetDatabase() {
  clearAll()
  cache = null
  const db = createSeedDatabase()
  return save(db)
}

export function exportDatabase() {
  return JSON.stringify(getDatabase(), null, 2)
}

export function importDatabase(jsonString) {
  const parsed = JSON.parse(jsonString)
  if (!parsed.users || !parsed.members) {
    throw new Error('Format database tidak valid')
  }
  invalidateCache()
  return save(parsed)
}

export function addSystemLog(level, message) {
  return updateDatabase((db) => {
    db.systemLogs = db.systemLogs || []
    db.systemLogs.unshift({
      id: `log-${Date.now()}`,
      level,
      message,
      createdAt: new Date().toISOString(),
    })
    db.systemLogs = db.systemLogs.slice(0, 100)
    return db
  })
}

export function getTableNames() {
  const db = load()
  return Object.keys(db).filter((k) => Array.isArray(db[k]) || k === 'version')
}

export function getTableData(tableName) {
  const db = load()
  return db[tableName] ?? null
}

export function setTableData(tableName, data) {
  return updateDatabase((db) => {
    db[tableName] = data
    return db
  })
}

export function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
