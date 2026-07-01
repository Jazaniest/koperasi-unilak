import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconLogo } from '../components/ui/Icons'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const roleRedirect = {
  super_admin: '/super',
  admin: '/admin',
  bendahara: '/bendahara',
  user: '/app',
}

export function LoginPage() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    navigate(roleRedirect[user.role], { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate(roleRedirect[result.user.role], { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="relative min-h-screen bg-primary">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-2xl bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-2xl bg-primary-light/30 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10 sm:px-8">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-surface-card/10 backdrop-blur-sm">
            <IconLogo className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-medium text-white sm:text-3xl">Koperasi Unilak</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
            Platform manajemen simpanan dan pinjaman anggota koperasi
          </p>
        </div>

        <Card className="w-full max-w-md border-gray-100 shadow-sm">
          <h2 className="text-lg font-medium text-text-primary">Masuk ke akun Anda</h2>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">
            Gunakan akun demo di bawah untuk mencoba sistem
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              autoComplete="email"
            />
            <Input
              label="Kata sandi"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            {error && (
              <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Masuk
            </Button>
            <p className="mt-4 text-center text-sm text-text-muted">
              Belum punya akun?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Daftar sebagai anggota
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
