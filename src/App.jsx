import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UserDashboard } from './pages/user/UserDashboard'
import { UserSavingsPage } from './pages/user/UserSavingsPage'
import { UserLoansPage } from './pages/user/UserLoansPage'
import { UserLoanApplicationPage } from './pages/user/UserLoanApplicationPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminMembersPage } from './pages/admin/AdminMembersPage'
import { AdminMemberDetailPage } from './pages/admin/AdminMemberDetailPage'
import { AdminRegistrationsPage } from './pages/admin/AdminRegistrationsPage'
import { AdminNewsPage } from './pages/admin/AdminNewsPage'
// ── BARU: Bendahara ───────────────────────────────────────────────────────────
import { BendaharaDashboard } from './pages/bendahara/BendaharaDashboard'
import { BendaharaApplicationsPage } from './pages/bendahara/BendaharaApplicationsPage'
import { BendaharaMembersPage } from './pages/bendahara/BendaharaMembersPage'
import { BendaharaMemberDetailPage } from './pages/bendahara/BendaharaMemberDetailPage'
import { BendaharaResignationsPage } from './pages/bendahara/BendaharaResignationsPage'
import { BendaharaLoansPage } from './pages/bendahara/BendaharaLoansPage'
import { BendaharaHistoryPage } from './pages/bendahara/BendaharaHistoryPage'
// ─────────────────────────────────────────────────────────────────────────────
// import { SuperDashboard } from './pages/super/SuperDashboard'
// import { SuperDatabasePage } from './pages/super/SuperDatabasePage'
import { LandingPage } from './pages/LandingPage'
import { SejarahPage } from './pages/SejarahPage'
import { StrukturPengurusPage } from './pages/StrukturPengurusPage'
import { VisiMisiPage } from './pages/VisiMisiPage'
import { SimulasiPinjamanPage } from './pages/SimulasiPinjamanPage'

import { UserTopUpPage } from './pages/user/UserTopUpPage'
import { BendaharaTopUpPage } from './pages/bendahara/BendaharaTopUpPage'
import { NewsDetailPage } from './pages/NewsDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/visi-misi" element={<VisiMisiPage />} />
      <Route path="/sejarah" element={<SejarahPage />} />
      <Route path="/struktur-pengurus" element={<StrukturPengurusPage />} />
      <Route path="/simulasi-pinjaman" element={<SimulasiPinjamanPage />} />
      <Route path="/berita/:slug" element={<NewsDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
      <Route
        path="/app/topup"
        element={
          <ProtectedRoute roles={['user']}>
            <UserTopUpPage />
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
      <Route
        path="/admin/pendaftaran"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminRegistrationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/berita"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminNewsPage />
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
      <Route
        path="/bendahara/pengunduran-diri"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaResignationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bendahara/topup"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaTopUpPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bendahara/pinjaman"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaLoansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bendahara/riwayat"
        element={
          <ProtectedRoute roles={['bendahara']}>
            <BendaharaHistoryPage />
          </ProtectedRoute>
        }
      />
      {/* Route halaman berikutnya akan ditambahkan di sini:
      <Route path="/bendahara/simpanan"   element={...} />
      <Route path="/bendahara/pinjaman"   element={...} />
      <Route path="/bendahara/laporan"    element={...} />
      */}

      {/* ── Super Admin ──
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
      /> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}