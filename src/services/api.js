// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL

function getToken() {
  try {
    const raw = localStorage.getItem('koperasi_session')
    if (!raw) return null
    return JSON.parse(raw)?.token ?? null
  } catch {
    return null
  }
}

/**
 * Wrapper fetch ke backend.
 * Otomatis inject Authorization header jika ada token.
 * Melempar Error jika response tidak ok.
 */
export async function apiRequest(path, options = {}) {
  const token = getToken()

  const isFormData = options.body instanceof FormData

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.message || 'Request gagal')
    err.status = res.status
    err.data = data
    throw err
  }

  return data // { success: true, data: ..., message: ... }
}

export function getApiBaseUrl() {
  return BASE_URL
}