import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { UserDashboard } from './pages/user/UserDashboard'
import { UserSavingsPage } from './pages/user/UserSavingsPage'
import { UserLoansPage } from './pages/user/UserLoansPage'
import { UserLoanApplicationPage } from './pages/user/UserLoanApplicationPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminMembersPage } from './pages/admin/AdminMembersPage'
import { AdminMemberDetailPage } from './pages/admin/AdminMemberDetailPage'
// ── BARU: Bendahara ───────────────────────────────────────────────────────────
import { BendaharaDashboard } from './pages/bendahara/BendaharaDashboard'
import { BendaharaApplicationsPage } from './pages/bendahara/BendaharaApplicationsPage'
import { BendaharaMembersPage } from './pages/bendahara/BendaharaMembersPage'
import { BendaharaMemberDetailPage } from './pages/bendahara/BendaharaMemberDetailPage'
// ─────────────────────────────────────────────────────────────────────────────
import { SuperDashboard } from './pages/super/SuperDashboard'
import { SuperDatabasePage } from './pages/super/SuperDatabasePage'
import { LandingPage } from './pages/LandingPage'
import { StrukturPengurusPage } from './pages/StrukturPengurusPage'
import { VisiMisiPage } from './pages/VisiMisiPage'
import { SimulasiPinjamanPage } from './pages/SimulasiPinjamanPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/visi-misi" element={<VisiMisiPage />} />
      <Route path="/struktur-pengurus" element={<StrukturPengurusPage />} />
      <Route path="/simulasi-pinjaman" element={<SimulasiPinjamanPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ── User ── */}
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

      {/* ── Admin ── */}
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

      {/* ── Bendahara (BARU) ── */}
      <Route
        path="/bendahara"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bendahara/pengajuan"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bendahara/anggota"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaMembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bendahara/anggota/:id"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaMemberDetailPage />
          </ProtectedRoute>
        }
      />
      {/* Route halaman berikutnya akan ditambahkan di sini:
      <Route path="/bendahara/simpanan"   element={...} />
      <Route path="/bendahara/pinjaman"   element={...} />
      <Route path="/bendahara/laporan"    element={...} />
      */}

      {/* ── Super Admin ── */}
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