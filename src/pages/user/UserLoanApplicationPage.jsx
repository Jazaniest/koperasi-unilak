import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { getMemberByUserId } from '../../services/memberService'
import { submitLoanApplication, getLoanApplications } from '../../services/loanApplicationService'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'

export function UserLoanApplicationPage() {
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [form, setForm] = useState({
    amount: '',
    purpose: '',
    tenorMonths: '12', // default awal 12 bulan
    collateral: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [applications, setApplications] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    getMemberByUserId(user.id).then(setMember)
  }, [user.id])

  useEffect(() => {
    if (member) getLoanApplications({ memberId: member.id }).then(setApplications)
  }, [member, refreshKey])

  // Fungsi pembantu untuk membuat format titik (ribuan) saat mengetik
  const formatNumberWithDots = (value) => {
    if (!value) return ''
    // Hapus semua karakter non-angka
    const cleanNumber = value.replace(/\D/g, '')
    // Tambahkan titik setiap kelipatan 3 angka dari belakang
    return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleAmountChange = (e) => {
    const formattedValue = formatNumberWithDots(e.target.value)
    setForm({ ...form, amount: formattedValue })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!member) {
      setError('Profil anggota tidak ditemukan')
      return
    }

    // Bersihkan titik dari string nominal untuk mendapatkan angka murni
    const rawAmount = Number(form.amount.replace(/\./g, ''))
    const tenor = Number(form.tenorMonths)

    // Validasi minimal nominal pinjaman
    if (rawAmount < 2500000) {
      setError('Minimal nominal pengajuan pinjaman adalah Rp 2.500.000')
      return
    }

    if (rawAmount > 50000000) {
      setError('Maksimal nominal pengajuan pinjaman adalah Rp 50.000.000')
      return
    }

    // Validasi minimal tenor bulan
    if (tenor < 12) {
      setError('Jangka waktu pinjaman minimal adalah 12 bulan')
      return
    }

    if (tenor > 60) {
      setError('Jangka waktu pinjaman maksimal adalah 60 bulan')
      return
    }

    const result = await submitLoanApplication(member.id, {
      amount: rawAmount,
      purpose: form.purpose,
      tenorMonths: tenor,
      collateral: form.collateral,
    })
    setLoading(false)

    if (result.success) {
      setSuccess('Pengajuan berhasil dikirim. Admin akan meninjau segera.')
      setForm({ amount: '', purpose: '', tenorMonths: '12', collateral: '' })
      if (fileInputRef.current) fileInputRef.current.value = ''  // ← reset input file
      setRefreshKey((k) => k + 1)
    } else {
      setError(result.error)
    }
  }

  return (
    <DashboardLayout
      title="Pengajuan Pinjaman"
      subtitle="Formulir akan diteruskan ke admin untuk persetujuan"
      navItems={UserNavbar}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-medium text-text-primary">Formulir Pengajuan</h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <Input
              label="Jumlah pinjaman (Rp)"
              type="text" // Diubah ke text agar bisa menampilkan format titik
              value={form.amount}
              onChange={handleAmountChange}
              placeholder="2.500.000"
              required
            />
            <Textarea
              label="Tujuan pinjaman"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="Jelaskan keperluan dana..."
              required
            />
            <Input
              label="Jangka waktu (Bulan)"
              type="number" // Diubah ke number kustom agar bisa diisi bebas oleh user
              value={form.tenorMonths}
              onChange={(e) => setForm({ ...form, tenorMonths: e.target.value })}
              placeholder="Minimal 12"
              required
            />
            <Input
              label="Jaminan / agunan (Upload Dokumen) *opsional"
              type="file"
              ref={fileInputRef}
              onChange={(e) => setForm({ ...form, collateral: e.target.files[0] })}
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
                  <p className="mt-1 text-xs text-text-muted font-medium">Tenor: {app.tenorMonths} Bulan</p>
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