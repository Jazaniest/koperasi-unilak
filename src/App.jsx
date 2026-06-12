import { Routes, Route, Navigate } from 'react-router-dom'
// import { useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { UserDashboard } from './pages/user/UserDashboard'
import { UserSavingsPage } from './pages/user/UserSavingsPage'
import { UserLoansPage } from './pages/user/UserLoansPage'
import { UserLoanApplicationPage } from './pages/user/UserLoanApplicationPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminMembersPage } from './pages/admin/AdminMembersPage'
import { AdminMemberDetailPage } from './pages/admin/AdminMemberDetailPage'
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage'
import { SuperDashboard } from './pages/super/SuperDashboard'
import { SuperDatabasePage } from './pages/super/SuperDatabasePage'
import { LandingPage } from './pages/LandingPage'
import { StrukturPengurusPage } from './pages/StrukturPengurusPage'
import { VisiMisiPage } from './pages/VisiMisiPage'

// function HomeRedirect() {
//   const { user, isAuthenticated } = useAuth()
//   if (!isAuthenticated) return <Navigate to="/login" replace />
//   if (user.role === 'super_admin') return <Navigate to="/super" replace />
//   if (user.role === 'admin') return <Navigate to="/admin" replace />
//   return <Navigate to="/app" replace />
// }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/visi-misi" element={<VisiMisiPage />} />
      <Route path="/struktur-pengurus" element={<StrukturPengurusPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute roles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/simpanan"
        element={
          <ProtectedRoute roles={['user']}>
            <UserSavingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/pinjaman"
        element={
          <ProtectedRoute roles={['user']}>
            <UserLoansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/pengajuan"
        element={
          <ProtectedRoute roles={['user']}>
            <UserLoanApplicationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/anggota"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminMembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/anggota/:id"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminMemberDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pengajuan"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminApplicationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/super"
        element={
          <ProtectedRoute roles={['super_admin']}>
            <SuperDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super/database"
        element={
          <ProtectedRoute roles={['super_admin']}>
            <SuperDatabasePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
