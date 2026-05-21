import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    const home = user.role === 'super_admin' ? '/super' : user.role === 'admin' ? '/admin' : '/app'
    return <Navigate to={home} replace />
  }

  return children
}
