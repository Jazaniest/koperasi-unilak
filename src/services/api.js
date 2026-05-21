import { getConfig } from '../lib/storage'

/** Wrapper siap backend — saat ini masih mock via service lokal */
export async function apiRequest(path, options = {}) {
  const config = getConfig()
  const url = `${config.apiBaseUrl}${path}`

  if (import.meta.env.DEV) {
    console.debug('[API mock]', options.method || 'GET', url)
  }

  // Nanti: return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ... } })
  throw new Error('Backend belum terhubung. Gunakan service lokal.')
}

export function getApiBaseUrl() {
  return getConfig().apiBaseUrl
}
