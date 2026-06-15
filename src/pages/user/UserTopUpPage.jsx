import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { getMemberByUserId } from '../../services/memberService'
import { getMemberLoans } from '../../services/loanService'
import { submitTopUpApplication, getTopUpApplications } from '../../services/loanApplicationService'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'

export function UserTopUpPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [member, setMember] = useState(null)
    const [activeLoan, setActiveLoan] = useState(null)
    const [applications, setApplications] = useState([])
    const [checkingLoan, setCheckingLoan] = useState(true)

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

    useEffect(() => {
        getMemberByUserId(user.id).then(async (m) => {
            setMember(m)
            if (m) {
                const loans = await getMemberLoans(m.id)
                const active = loans.find((l) => l.status === 'active') ?? null
                setActiveLoan(active)
                const apps = await getTopUpApplications({ memberId: m.id })
                setApplications(apps)
            }
            setCheckingLoan(false)
        })
    }, [user.id, refreshKey])

    // Jika tidak ada pinjaman aktif, arahkan ke pengajuan biasa
    if (!checkingLoan && !activeLoan) {
        return (
            <DashboardLayout title="Top Up Pinjaman" subtitle="Tambah pinjaman di atas pinjaman berjalan" navItems={UserNavbar}>
                <Card className="max-w-lg mx-auto text-center py-10">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="font-semibold text-text-primary text-lg mb-2">Tidak Ada Pinjaman Aktif</h3>
                    <p className="text-sm text-text-muted mb-6">
                        Anda tidak memiliki pinjaman yang sedang berjalan. Gunakan pengajuan pinjaman baru.
                    </p>
                    <Button onClick={() => navigate('/app/pengajuan')} className="mx-auto">
                        Ajukan Pinjaman Baru →
                    </Button>
                </Card>
            </DashboardLayout>
        )
    }

    const formatNumberWithDots = (value) => {
        if (!value) return ''
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    const handleAmountChange = (e) => {
        setForm({ ...form, amount: formatNumberWithDots(e.target.value) })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!member || !activeLoan) return

        const rawAmount = Number(form.amount.replace(/\./g, ''))
        const tenor = Number(form.tenorMonths)

        if (rawAmount <= Number(activeLoan.remaining)) {
            setError(`Jumlah top up harus lebih besar dari sisa pinjaman aktif (${formatCurrency(activeLoan.remaining)})`)
            return
        }

        if (rawAmount > 50000000) {
            setError('Maksimal nominal top up adalah Rp 50.000.000')
            return
        }

        if (tenor < 12) {
            setError('Jangka waktu minimal adalah 12 bulan')
            return
        }

        if (tenor > 60) {
            setError('Jangka waktu maksimal adalah 60 bulan')
            return
        }

        setLoading(true)
        const result = await submitTopUpApplication({
            amount: rawAmount,
            purpose: form.purpose,
            tenorMonths: tenor,
            collateral: form.collateral,
        })
        setLoading(false)

        if (result.success) {
            setSuccess('Pengajuan top up berhasil dikirim. Bendahara akan meninjau segera.')
            setForm({ amount: '', purpose: '', tenorMonths: '12', collateral: '' })
            if (fileInputRef.current) fileInputRef.current.value = ''
            setRefreshKey((k) => k + 1)
        } else {
            setError(result.error)
        }
    }

    const INTEREST_RATE = 12
    const rawAmount = Number(form.amount.replace(/\./g, ''))
    const tenor = Number(form.tenorMonths)
    const estimasiCicilan =
        rawAmount > 0 && tenor > 0
            ? Math.round((rawAmount * (1 + INTEREST_RATE / 100)) / tenor)
            : 0

    const danaDiterima =
        rawAmount > 0 && activeLoan
            ? rawAmount - Number(activeLoan.remaining)
            : 0

    return (
        <DashboardLayout
            title="Top Up Pinjaman"
            subtitle="Tambah pinjaman di atas pinjaman berjalan"
            navItems={UserNavbar}
        >
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Kiri: Info pinjaman aktif + form */}
                <div className="space-y-6">

                    {/* Info pinjaman aktif */}
                    {activeLoan && (
                        <Card>
                            <h3 className="font-medium text-text-primary mb-4">Pinjaman Aktif Saat Ini</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-text-muted">Jumlah awal</dt>
                                    <dd className="font-medium text-text-primary">{formatCurrency(activeLoan.amount)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-text-muted">Sisa pinjaman</dt>
                                    <dd className="font-semibold text-danger">{formatCurrency(activeLoan.remaining)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-text-muted">Tenor awal</dt>
                                    <dd className="text-text-primary">{activeLoan.tenorMonths} bulan</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-text-muted">Cicilan/bulan</dt>
                                    <dd className="text-text-primary">{formatCurrency(activeLoan.monthlyPayment)}</dd>
                                </div>
                            </dl>
                            <p className="mt-4 rounded-xl bg-warning/10 border border-warning/20 px-3 py-2.5 text-xs text-warning leading-relaxed">
                                ⚠️ Pinjaman lama akan <strong>dilunasi otomatis</strong> dan digantikan pinjaman baru setelah top up disetujui.
                            </p>
                        </Card>
                    )}

                    {/* Form top up */}
                    <Card>
                        <h3 className="font-medium text-text-primary">Formulir Top Up</h3>
                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <Input
                                label={`Jumlah top up (Rp) — min. lebih dari ${formatCurrency(activeLoan?.remaining ?? 0)}`}
                                type="text"
                                value={form.amount}
                                onChange={handleAmountChange}
                                placeholder={activeLoan ? String(Number(activeLoan.remaining) + 1000000).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0'}
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
                                label="Tenor baru (Bulan)"
                                type="number"
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
                                Kirim Pengajuan Top Up
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Kanan: Simulasi + riwayat */}
                <div className="space-y-6">

                    {/* Simulasi */}
                    <Card>
                        <h3 className="font-medium text-text-primary mb-4">Simulasi Top Up</h3>
                        {rawAmount > 0 && tenor > 0 ? (
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-text-muted">Total pinjaman baru</dt>
                                    <dd className="font-semibold text-primary">{formatCurrency(rawAmount)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-text-muted">Dana segar diterima</dt>
                                    <dd className="font-semibold text-success">{formatCurrency(danaDiterima > 0 ? danaDiterima : 0)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-text-muted">Tenor baru</dt>
                                    <dd className="text-text-primary">{tenor} bulan</dd>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-3">
                                    <dt className="text-text-muted">Estimasi cicilan/bulan</dt>
                                    <dd className="font-semibold text-text-primary">{formatCurrency(estimasiCicilan)}</dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="text-sm text-text-muted">Isi jumlah dan tenor untuk melihat simulasi.</p>
                        )}
                    </Card>

                    {/* Riwayat pengajuan top up */}
                    <Card>
                        <h3 className="font-medium text-text-primary">Riwayat Pengajuan Top Up</h3>
                        {applications.length === 0 ? (
                            <p className="mt-5 text-sm text-text-muted">Belum ada pengajuan top up</p>
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
                                                <span className="font-medium text-text-primary">Catatan:</span> {app.adminNotes}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}