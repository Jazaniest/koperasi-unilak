import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(() => {
    setUser(authService.getCurrentUser())
  }, [])

  useEffect(() => {
    //eslint-disable-next-line
    refresh()
  }, [refresh])

  const login = async (email, password) => {
    setLoading(true)

    const result = await authService.login(
      email,
      password
    )

    setLoading(false)

    if (result.success) {
      setUser(result.user)
    }

    return result
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
//eslint-disable-next-line
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
