import { getDatabase, updateDatabase, addSystemLog } from './dbService'
import { getSession, setSession } from '../lib/storage'

export function login(email, password) {
  const db = getDatabase()
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )

  if (!user) {
    return { success: false, error: 'Email atau kata sandi salah' }
  }

  const { password: _, ...safeUser } = user
  const session = {
    user: safeUser,
    token: `mock-token-${user.id}-${Date.now()}`,
    loginAt: new Date().toISOString(),
  }

  setSession(session)
  addSystemLog('info', `Login: ${user.email} (${user.role})`)

  return { success: true, user: safeUser }
}

export function logout() {
  const session = getSession()
  if (session?.user) {
    addSystemLog('info', `Logout: ${session.user.email}`)
  }
  setSession(null)
}

export function getCurrentUser() {
  const session = getSession()
  return session?.user ?? null
}

export function isAuthenticated() {
  return !!getCurrentUser()
}

export function changePassword(userId, oldPassword, newPassword) {
  const db = getDatabase()
  const user = db.users.find((u) => u.id === userId)
  if (!user || user.password !== oldPassword) {
    return { success: false, error: 'Kata sandi lama tidak sesuai' }
  }
  updateDatabase((d) => {
    const u = d.users.find((x) => x.id === userId)
    if (u) u.password = newPassword
    return d
  })
  return { success: true }
}
