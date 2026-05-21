import { getConfig, setConfig } from '../lib/storage'
import { addSystemLog } from './dbService'

export function getServerConfig() {
  return getConfig()
}

export function updateServerConfig(updates) {
  const current = getConfig()
  const next = { ...current, ...updates }
  setConfig(next)
  addSystemLog('info', `Konfigurasi server diperbarui: ${Object.keys(updates).join(', ')}`)
  return next
}

export function getMockServerMetrics() {
  const config = getConfig()
  return {
    status: config.maintenanceMode ? 'maintenance' : config.serverStatus,
    uptime: '99.97%',
    cpu: Math.floor(18 + Math.random() * 25),
    memory: Math.floor(42 + Math.random() * 20),
    requestsPerMin: Math.floor(120 + Math.random() * 80),
    dbConnections: Math.floor(4 + Math.random() * 8),
    lastChecked: new Date().toISOString(),
  }
}
