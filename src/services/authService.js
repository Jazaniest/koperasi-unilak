// src/services/authService.js

import { apiRequest } from './api'
import { getSession, setSession } from '../lib/storage'

/**
 * POST /api/auth/login
 * Response: { data: { token, user } }
 */
export async function login(email, password) {
  try {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Simpan token + user ke session storage
    setSession({ token: res.data.token, user: res.data.user })
    return { success: true, user: res.data.user }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * POST /api/auth/logout
 * Backend stateless — cukup hapus session lokal
 */
export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } catch {
    // Tetap hapus session meski request gagal
  } finally {
    setSession(null)
  }
}

/**
 * GET /api/auth/me
 * Ambil data user aktif dari server (validasi token)
 */
export async function fetchCurrentUser() {
  const res = await apiRequest('/auth/me')
  return res.data // { id, email, role, name }
}

export function getCurrentUser() {
  return getSession()?.user ?? null
}

export function isAuthenticated() {
  return !!getSession()?.token
}

/**
 * POST /api/auth/change-password
 * Body: { oldPassword, newPassword }
 */
export async function changePassword(userId, oldPassword, newPassword) {
  try {
    await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Update sebagian data user di session storage.
 * Dipakai setelah update profil agar nama/phone terupdate tanpa re-login.
 */
export function updateSession(updatedUser) {
    const session = getSession()
    if (!session) return
    setSession({ ...session, user: { ...session.user, ...updatedUser } })
}