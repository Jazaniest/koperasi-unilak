const DB_KEY = 'koperasi_db'
const SESSION_KEY = 'koperasi_session'
const CONFIG_KEY = 'koperasi_config'

export function getDb() {
  const raw = localStorage.getItem(DB_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setDb(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data))
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function getConfig() {
  const raw = localStorage.getItem(CONFIG_KEY)
  if (!raw) {
    return {
      apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      serverStatus: 'online',
      maintenanceMode: false,
      lastBackup: null,
    }
  }
  try {
    return JSON.parse(raw)
  } catch {
    return { apiBaseUrl: 'http://localhost:3000/api', serverStatus: 'online', maintenanceMode: false }
  }
}

export function setConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function clearAll() {
  localStorage.removeItem(DB_KEY)
  localStorage.removeItem(SESSION_KEY)
}
