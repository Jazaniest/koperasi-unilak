// src/services/api.js
import axios from 'axios'
import { setSession } from '../lib/storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

function getToken() {
  try {
    const raw = localStorage.getItem('koperasi_session')
    if (!raw) return null
    return JSON.parse(raw)?.token ?? null
  } catch {
    return null
  }
}

// Interceptor untuk inject token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Jika method bukan GET, set Content-Type ke application/json
    // kecuali jika body adalah FormData
    if (config.method?.toUpperCase() !== 'GET' && !(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor untuk handle response
api.interceptors.response.use(
  (response) => {
    // Backend kita selalu bungkus di `data`, jadi kita buka di sini
    return response.data
  },
  (error) => {
    // Jika token kadaluarsa (401), otomatis logout
    if (error.response?.status === 401) {
      // Hanya lakukan jika bukan dari halaman login, untuk menghindari loop
      if (window.location.pathname !== '/login') {
        setSession(null) // Hapus sesi dari storage
        window.location.href = '/login' // Arahkan ke halaman login
      }
    }

    // Buat error lebih konsisten dengan yang lama
    const err = new Error(error.response?.data?.message || error.message || 'Request gagal')
    err.status = error.response?.status
    err.data = error.response?.data
    return Promise.reject(err)
  }
)

/**
 * Wrapper Axios ke backend.
 */
export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, ...restOptions } = options

  const config = {
    method,
    url: path,
    data: body,
    ...restOptions,
  }

  return api(config)
}
