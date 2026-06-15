import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { IconLogo, IconMenu, IconClose, IconLogout, IconChevronUp, IconKey, IconUserEdit } from '../ui/Icons'
import { ROLE_LABELS } from '../../utils/format'
import { Button } from '../ui/Button'
import { ModalEditProfil } from '../user/ModalEditProfile'
import { ModalUbahPassword } from '../user/ModalUbahPassword'
import * as authService from '../../services/authService'

export function DashboardLayout({ title, subtitle, navItems, children }) {
  const { user, logout, refresh } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropupOpen, setDropupOpen] = useState(false)
  const [modalProfilOpen, setModalProfilOpen] = useState(false)
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Setelah simpan profil → refresh user di context agar nama terupdate
  // Ganti handleProfilSuccess
  const handleProfilSuccess = (updatedUser) => {
    if (updatedUser) {
      authService.updateSession(updatedUser)  // ← update session storage
    }
    refresh()  // ← baru refresh state dari session
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const isMember = user?.role === 'user'

  return (
    <div className="min-h-screen bg-surface">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-primary/40 lg:hidden"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-100 bg-surface-card transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6">
          <IconLogo />
          <div>
            <p className="text-sm font-medium text-text-primary">Koperasi Unilak</p>
            <p className="text-xs text-text-muted">Sistem Manajemen</p>
          </div>
          <button
            type="button"
            className="ml-auto rounded-lg p-2 text-text-muted hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup"
          >
            <IconClose />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                  ? 'bg-primary/8 text-primary'
                  : 'text-text-muted hover:bg-gray-50 hover:text-text-primary'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-5">
          <div className="relative mb-4">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-surface p-3">
              <div className="ds-avatar h-10 w-10 text-xs">{initials}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-muted">{ROLE_LABELS[user?.role]}</p>
              </div>

              {isMember && (
                <button
                  type="button"
                  onClick={() => setDropupOpen((v) => !v)}
                  className={`ml-auto shrink-0 rounded-lg p-1.5 transition ${dropupOpen
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-gray-100 hover:text-primary'
                    }`}
                  aria-label="Menu akun"
                >
                  <IconChevronUp
                    className={`h-4 w-4 transition-transform duration-200 ${dropupOpen ? 'rotate-0' : 'rotate-180'}`}
                  />
                </button>
              )}
            </div>

            {/* Dropup menu */}
            {isMember && dropupOpen && (
              <>
                {/* overlay tipis untuk close saat klik luar */}
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  aria-hidden="true"
                  onClick={() => setDropupOpen(false)}
                />
                <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-xl border border-gray-100 bg-surface-card shadow-lg animate-fade-in">
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Akun Saya</p>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => { setDropupOpen(false); setModalProfilOpen(true) }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition"
                    >
                      <IconUserEdit className="h-4 w-4 shrink-0 text-text-muted" />
                      Informasi Pribadi
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDropupOpen(false); setModalPasswordOpen(true) }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition"
                    >
                      <IconKey className="h-4 w-4 shrink-0 text-text-muted" />
                      Ubah Password
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <IconLogout />
            Keluar
          </Button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-surface-card/95 backdrop-blur-sm">
          <div className="flex h-16 items-center gap-4 px-6">
            <button
              type="button"
              className="rounded-lg p-2 text-text-muted hover:bg-gray-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <IconMenu />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-medium text-text-primary sm:text-xl">{title}</h1>
              {subtitle && <p className="truncate text-sm text-text-muted">{subtitle}</p>}
            </div>
          </div>
        </header>

        <main className="animate-fade-in px-6 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>

      {/* Modal edit profil — hanya render jika user adalah member */}
      {isMember && (
        <ModalEditProfil
          open={modalProfilOpen}
          user={user}
          onClose={() => setModalProfilOpen(false)}
          onSuccess={handleProfilSuccess}
        />
      )}
      {isMember && (
        <ModalUbahPassword
          open={modalPasswordOpen}
          onClose={() => setModalPasswordOpen(false)}
        />
      )}
    </div>
  )
}