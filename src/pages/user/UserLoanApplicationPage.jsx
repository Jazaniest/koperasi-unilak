import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { getMemberByUserId } from '../../services/memberService'
import { submitLoanApplication, getLoanApplications } from '../../services/loanApplicationService'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'
import { useNavigate } from 'react-router-dom'
import { getMemberLoans } from '../../services/loanService'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { BankAccountField } from '../../components/user/BankAccountField'

export function UserLoanApplicationPage() {
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [form, setForm] = useState({
    amount: '',
    purpose: '',
    tenorMonths: '12',
    collateral: '',
    paymentMethod: 'transfer', // ← tambahan
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [applications, setApplications] = useState([])
  const fileInputRef = useRef(null)

  const navigate = useNavigate()
  const [activeLoan, setActiveLoan] = useState(null)
  const [checkingLoan, setCheckingLoan] = useState(true)

  useEffect(() => {
    getMemberByUserId(user.id).then(async (m) => {
      setMember(m)
      if (m) {
        const loans = await getMemberLoans(m.id)
        const active = loans.find((l) => l.status === 'active') ?? null
        setActiveLoan(active)
      }
      setCheckingLoan(false)
    })
  }, [user.id])

  useEffect(() => {
    if (member) getLoanApplications({ memberId: member.id }).then(setApplications)
  }, [member, refreshKey])

  const formatDecimal = (value) => {
    if (!value) return ''
    // Hanya izinkan angka dan satu koma
    let cleanValue = value.replace(/[^0-9,]/g, '')
    const parts = cleanValue.split(',')
    if (parts.length > 2) {
      cleanValue = parts[0] + ',' + parts.slice(1).join('')
    }

    const [integerPart, decimalPart] = cleanValue.split(',')

    // Format bagian integer dengan titik
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    if (decimalPart !== undefined) {
      // Batasi 2 digit desimal
      return `${formattedInteger},${decimalPart.substring(0, 2)}`
    }

    return formattedInteger
  }

  const handleAmountChange = (e) => {
    const formattedValue = formatDecimal(e.target.value)
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

    // Hapus titik ribuan, lalu ganti koma desimal dengan titik
    const parsableAmount = form.amount.replace(/\./g, '').replace(',', '.')
    const rawAmount = Number(parsableAmount)
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

    if (form.paymentMethod === 'transfer' && (!member.bankName || !member.bankAccountNumber)) {
      setError('Lengkapi rekening bank Anda terlebih dahulu untuk pembayaran via transfer')
      return
    }

    setLoading(true)

    const result = await submitLoanApplication(member.id, {
      amount: rawAmount,
      purpose: form.purpose,
      tenorMonths: tenor,
      collateral: form.collateral,
      paymentMethod: form.paymentMethod, // ← tambahan
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

  // Redirect ke halaman top up jika ada pinjaman aktif
  if (!checkingLoan && activeLoan) {
    return (
      <DashboardLayout
        title="Pengajuan Pinjaman"
        subtitle="Formulir akan diteruskan ke admin untuk persetujuan"
        navItems={UserNavbar}
      >
        <Card className="max-w-lg mx-auto text-center py-8 sm:py-10">
          <ArrowPathIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="font-semibold text-text-primary text-lg mb-2">Anda Memiliki Pinjaman Aktif</h3>
          <p className="text-sm text-text-muted mb-1">
            Sisa pinjaman: <span className="font-semibold text-primary">{formatCurrency(activeLoan.remaining)}</span>
          </p>
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            Tidak bisa mengajukan pinjaman baru selama masih ada pinjaman berjalan.
            Gunakan fitur <strong>Top Up</strong> untuk menambah pinjaman.
          </p>
          <Button onClick={() => navigate('/app/topup')} className="w-full sm:w-auto sm:mx-auto">
            Ajukan Top Up Pinjaman →
          </Button>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Pengajuan Pinjaman"
      subtitle="Formulir akan diteruskan ke admin untuk persetujuan"
      navItems={UserNavbar}
    >
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-medium text-text-primary">Formulir Pengajuan</h3>

          <div className="mt-5">
            <BankAccountField member={member} onUpdated={(updated) => setMember((m) => ({ ...m, ...updated }))} />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:space-y-5">
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
            <Select
              label="Metode Pembayaran"
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              options={[
                { value: 'transfer', label: 'Transfer Bank' },
                { value: 'tunai', label: 'Tunai' },
              ]}
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
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="font-medium text-text-primary">{formatCurrency(app.amount)}</span>
                    <Badge status={app.status} className="shrink-0" />
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{app.purpose}</p>
                  <p className="mt-1 text-xs text-text-muted font-medium">Tenor: {app.tenorMonths} Bulan</p>
                  <p className="mt-2 text-xs text-text-muted">{formatDateTime(app.createdAt)}</p>
                  {app.adminNotes && (
                    <p className="mt-3 rounded-lg border border-gray-100 bg-surface-card p-3 text-xs leading-relaxed text-text-muted">
                      <span className="block font-medium text-text-primary">Catatan admin:</span>
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