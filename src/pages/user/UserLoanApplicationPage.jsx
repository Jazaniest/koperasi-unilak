import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { IconHome, IconWallet, IconLoan, IconFile } from '../../components/ui/Icons'
import { getMemberByUserId } from '../../services/memberService'
import { submitLoanApplication, getLoanApplications } from '../../services/loanService'
import { formatCurrency, formatDateTime } from '../../utils/format'

const nav = [
  { to: '/app', label: 'Beranda', icon: IconHome, end: true },
  { to: '/app/simpanan', label: 'Simpanan', icon: IconWallet },
  { to: '/app/pinjaman', label: 'Pinjaman', icon: IconLoan },
  { to: '/app/pengajuan', label: 'Ajukan Pinjaman', icon: IconFile },
]

export function UserLoanApplicationPage() {
  const { user } = useAuth()
  const member = getMemberByUserId(user.id)
  const [form, setForm] = useState({
    amount: '',
    purpose: '',
    tenorMonths: '12',
    collateral: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const applications = member ? getLoanApplications({ memberId: member.id }) : []
  void refreshKey

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!member) {
      setError('Profil anggota tidak ditemukan')
      return
    }
    setLoading(true)
    const result = submitLoanApplication(member.id, form)
    setLoading(false)
    if (result.success) {
      setSuccess('Pengajuan berhasil dikirim. Admin akan meninjau segera.')
      setForm({ amount: '', purpose: '', tenorMonths: '12', collateral: '' })
      setRefreshKey((k) => k + 1)
    } else {
      setError(result.error)
    }
  }

  return (
    <DashboardLayout
      title="Pengajuan Pinjaman"
      subtitle="Formulir akan diteruskan ke admin untuk persetujuan"
      navItems={nav}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-medium text-text-primary">Formulir Pengajuan</h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <Input
              label="Jumlah pinjaman (Rp)"
              type="number"
              min="500000"
              step="100000"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="5000000"
              required
            />
            <Textarea
              label="Tujuan pinjaman"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="Jelaskan keperluan dana..."
              required
            />
            <Select
              label="Jangka waktu"
              value={form.tenorMonths}
              onChange={(e) => setForm({ ...form, tenorMonths: e.target.value })}
              options={[
                { value: '6', label: '6 bulan' },
                { value: '12', label: '12 bulan' },
                { value: '18', label: '18 bulan' },
                { value: '24', label: '24 bulan' },
                { value: '36', label: '36 bulan' },
              ]}
            />
            <Input
              label="Jaminan / agunan"
              value={form.collateral}
              onChange={(e) => setForm({ ...form, collateral: e.target.value })}
              placeholder="BPKB, sertifikat, atau tidak ada"
            />
            {error && (
              <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-xl border border-success/20 bg-success/5 px-4 py-2.5 text-sm text-success">
                {success}
              </p>
            )}
            <Button type="submit" loading={loading} className="w-full sm:w-auto">
              Kirim Pengajuan
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="font-medium text-text-primary">Riwayat Pengajuan</h3>
          {applications.length === 0 ? (
            <p className="mt-5 text-sm leading-relaxed text-text-muted">Belum ada pengajuan</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {applications.map((app) => (
                <li key={app.id} className="rounded-xl border border-gray-100 bg-surface p-4">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-text-primary">{formatCurrency(app.amount)}</span>
                    <Badge status={app.status} />
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{app.purpose}</p>
                  <p className="mt-2 text-xs text-text-muted">{formatDateTime(app.createdAt)}</p>
                  {app.adminNotes && (
                    <p className="mt-3 rounded-lg border border-gray-100 bg-surface-card p-3 text-xs leading-relaxed text-text-muted">
                      <span className="font-medium text-text-primary">Catatan admin:</span>{' '}
                      {app.adminNotes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
