import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { getAllLoans, getLoanDetail, recordLoanPayment, settleLoan } from '../../services/loanService'
import { formatCurrency, formatDate } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'
import { LoanProgressBar } from '../../components/bendahara/LoanProgressBar'

// ── Modal Konfirmasi ──────────────────────────────────────────────────────────
function ModalKonfirmasi({ open, title, description, onConfirm, onCancel, loading }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-surface-card p-6 shadow-xl">
                <h3 className="font-medium text-text-primary">{title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
                <div className="mt-5 flex gap-3 justify-end">
                    <button onClick={onCancel} disabled={loading}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted hover:bg-gray-50 disabled:opacity-50">
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-60">
                        {loading ? 'Memproses...' : 'Ya, Proses Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Halaman Utama ─────────────────────────────────────────────────────────────
export function BendaharaLoansPage() {
    //eslint-disable-next-line
    const { user } = useAuth()
    const [filter, setFilter] = useState('active')
    const [loans, setLoans] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [detail, setDetail] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    // Form catat cicilan
    const [payAmount, setPayAmount] = useState('')
    const [payDesc, setPayDesc] = useState('')
    const [payError, setPayError] = useState('')
    const [paySuccess, setPaySuccess] = useState('')
    // eslint-disable-next-line
    const [payLoading, setPayLoading] = useState(false)

    const currentYear = new Date().getFullYear()

    const [filterYear, setFilterYear] = useState('')
    const [filterMonth, setFilterMonth] = useState('')

    // Modal
    const [modalConfig, setModalConfig] = useState({
        open: false, title: '', description: '', action: null, loading: false,
    })

    // Fetch daftar pinjaman
    useEffect(() => {
        getAllLoans(filter === 'all' ? {} : { status: filter }).then(setLoans)
    }, [filter, refreshKey])

    const filteredLoans = loans.filter((loan) => {
        if (!filterYear && !filterMonth) return true
        const start = new Date(loan.startDate)
        const y = start.getFullYear()
        const m = start.getMonth() + 1
        if (filterYear && Number(filterYear) !== y) return false
        if (filterMonth && Number(filterMonth) !== m) return false
        return true
    })

    const selectedLoan = filteredLoans.find((l) => l.id === selectedId) ?? filteredLoans[0]

    // Fetch detail + riwayat saat selected berubah
    useEffect(() => {
        if (!selectedLoan) {
            const timer = setTimeout(() => setDetail(null), 0)
            return () => clearTimeout(timer)
        }

        let cancelled = false
        const timer = setTimeout(() => {
            setLoadingDetail(true)
            setPayError('')
            setPaySuccess('')
            setPayAmount('')
            setPayDesc('')
        }, 0)

        getLoanDetail(selectedLoan.id)
            .then((data) => { if (!cancelled) setDetail(data) })
            .finally(() => { if (!cancelled) setLoadingDetail(false) })

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [selectedLoan])

    // Format angka dengan titik ribuan
    const formatNumberWithDots = (value) => {
        if (!value) return ''
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    // Buka modal cicilan
    const openPayConfirm = () => {
        const raw = Number(payAmount.replace(/\./g, ''))
        if (!raw || raw <= 0) { setPayError('Masukkan jumlah pembayaran yang valid'); return }
        if (raw > Number(detail.remaining)) {
            setPayError(`Jumlah melebihi sisa pinjaman (${formatCurrency(detail.remaining)})`)
            return
        }
        setPayError('')
        setModalConfig({
            open: true,
            title: 'Catat Pembayaran Cicilan',
            description: `Catat pembayaran sebesar ${formatCurrency(raw)} untuk pinjaman ${detail.memberName}? Sisa pinjaman akan berkurang menjadi ${formatCurrency(Number(detail.remaining) - raw)}.`,
            action: 'pay',
            loading: false,
        })
    }

    // Buka modal pelunasan
    const openSettleConfirm = () => {
        setModalConfig({
            open: true,
            title: 'Pelunasan Sekaligus',
            description: `Lunaskan seluruh sisa pinjaman ${formatCurrency(detail.remaining)} milik ${detail.memberName}? Tindakan ini tidak dapat dibatalkan.`,
            action: 'settle',
            loading: false,
        })
    }

    // Eksekusi aksi dari modal
    const handleModalConfirm = async () => {
        setModalConfig((prev) => ({ ...prev, loading: true }))
        try {
            if (modalConfig.action === 'pay') {
                const raw = Number(payAmount.replace(/\./g, ''))
                const result = await recordLoanPayment({
                    loanId: detail.id,
                    amount: raw,
                    description: payDesc.trim() || 'Pembayaran cicilan',
                })
                if (result.success) {
                    setPaySuccess('Pembayaran berhasil dicatat.')
                    setPayAmount('')
                    setPayDesc('')
                    setRefreshKey((k) => k + 1)
                } else {
                    setPayError(result.error)
                }
            } else if (modalConfig.action === 'settle') {
                const result = await settleLoan(detail.id)
                if (result.success) {
                    setPaySuccess('Pinjaman berhasil dilunaskan.')
                    setRefreshKey((k) => k + 1)
                } else {
                    setPayError(result.error ?? 'Pelunasan gagal')
                }
            }
        } catch (err) {
            setPayError('Terjadi kesalahan, coba lagi.' + err.message)
        } finally {
            setModalConfig({ open: false, title: '', description: '', action: null, loading: false })
        }
    }

    const filterLabels = { active: 'Aktif', lunas: 'Lunas', all: 'Semua' }

    const paidAmount = detail ? Number(detail.amount) - Number(detail.remaining) : 0
    const progressPct = detail && detail.amount > 0
        ? Math.round((paidAmount / Number(detail.amount)) * 100)
        : 0

    return (
        <DashboardLayout
            title="Kelola Pinjaman"
            subtitle="Catat cicilan dan kelola status pinjaman anggota"
            navItems={BendaharaNavbar}
        >
            {/* Filter */}
            <div className="mb-6 space-y-3">
                {/* Baris 1: Status */}
                <div className="flex flex-wrap gap-2">
                    {['active', 'lunas', 'all'].map((f) => (
                        <button key={f} type="button"
                            onClick={() => { setFilter(f); setSelectedId(null) }}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === f
                                ? 'bg-primary text-white shadow-sm'
                                : 'border border-gray-200 bg-surface-card text-text-muted hover:bg-surface'}`}>
                            {filterLabels[f]}
                        </button>
                    ))}
                </div>

                {/* Baris 2: Tahun & Bulan */}
                <div className="flex flex-wrap gap-2 items-center">
                    <select
                        value={filterYear}
                        onChange={(e) => { setFilterYear(e.target.value); setFilterMonth(''); setSelectedId(null) }}
                        className="rounded-xl border border-gray-200 bg-surface-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <option value="">Semua Tahun</option>
                        {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    <select
                        value={filterMonth}
                        onChange={(e) => { setFilterMonth(e.target.value); setSelectedId(null) }}
                        disabled={!filterYear}
                        className="rounded-xl border border-gray-200 bg-surface-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <option value="">Semua Bulan</option>
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
                            .map((nama, i) => (
                                <option key={i + 1} value={i + 1}>{nama}</option>
                            ))}
                    </select>

                    {(filterYear || filterMonth) && (
                        <button
                            type="button"
                            onClick={() => { setFilterYear(''); setFilterMonth(''); setSelectedId(null) }}
                            className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-text-muted hover:bg-surface transition"
                        >
                            Reset
                        </button>
                    )}

                    <span className="ml-auto self-center text-xs text-text-muted">
                        {filteredLoans.length} pinjaman
                    </span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {/* ── Kiri: Daftar Pinjaman ── */}
                <div className="space-y-3">
                    {filteredLoans.length === 0 ? (
                        <Card className="py-12 text-center text-text-muted">Tidak ada data</Card>
                    ) : (
                        filteredLoans.map((loan) => (
                            <button key={loan.id} type="button"
                                onClick={() => setSelectedId(loan.id)}
                                className={`w-full text-left transition ${selectedLoan?.id === loan.id ? 'rounded-2xl ring-2 ring-primary/25' : ''}`}>
                                <Card>
                                    <div className="flex justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium text-text-primary truncate">{loan.memberName}</p>
                                            <p className="text-xs text-text-muted">{loan.memberNumber}</p>
                                        </div>
                                        <Badge status={loan.status} />
                                    </div>

                                    {/* Progress bar mini */}
                                    <div className="mt-3">
                                        <LoanProgressBar amount={loan.amount} remaining={loan.remaining} />
                                    </div>

                                    <div className="mt-2 flex justify-between text-xs text-text-muted">
                                        <span>Sisa: <span className="font-semibold text-danger">{formatCurrency(loan.remaining)}</span></span>
                                        <span>dari {formatCurrency(loan.amount)}</span>
                                    </div>

                                    <div className="mt-1 flex justify-between text-xs text-text-muted">
                                        <span>Cicilan/bln: {formatCurrency(loan.monthlyPayment)}</span>
                                        <span>
                                            {Math.round((Number(loan.amount) - Number(loan.remaining)) / Number(loan.monthlyPayment))}/{loan.tenorMonths} bulan
                                        </span>
                                    </div>

                                    {loan.purpose && (
                                        <p className="mt-1.5 text-xs text-text-muted line-clamp-1">{loan.purpose}</p>
                                    )}
                                </Card>
                            </button>
                        ))
                    )}
                </div>

                {/* ── Kanan: Panel Detail ── */}
                {selectedLoan && filteredLoans.length > 0 && (
                    <div className="sticky top-24 space-y-4 h-fit">

                        {loadingDetail ? (
                            <Card className="py-12 text-center text-text-muted text-sm">Memuat detail...</Card>
                        ) : detail ? (
                            <>
                                {/* Info Pinjaman */}
                                <Card>
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-lg font-medium text-text-primary">Detail Pinjaman</h3>
                                        <Badge status={detail.status} />
                                    </div>

                                    {/* Progress besar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-text-muted mb-1.5">
                                            <span>Terbayar {progressPct}%</span>
                                            <span>{formatCurrency(paidAmount)} / {formatCurrency(detail.amount)}</span>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all duration-700"
                                                style={{ width: `${progressPct}%` }}
                                            />
                                        </div>
                                    </div>

                                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-xl bg-surface px-3 py-2.5">
                                            <dt className="text-xs text-text-muted">Anggota</dt>
                                            <dd className="font-medium text-text-primary mt-0.5">{detail.memberName}</dd>
                                            <dd className="text-xs text-text-muted">{detail.memberNumber}</dd>
                                        </div>
                                        <div className="rounded-xl bg-surface px-3 py-2.5">
                                            <dt className="text-xs text-text-muted">Sisa Pinjaman</dt>
                                            <dd className="font-semibold text-danger mt-0.5">{formatCurrency(detail.remaining)}</dd>
                                        </div>
                                        <div className="rounded-xl bg-surface px-3 py-2.5">
                                            <dt className="text-xs text-text-muted">Cicilan/Bulan</dt>
                                            <dd className="font-medium text-text-primary mt-0.5">{formatCurrency(detail.monthlyPayment)}</dd>
                                        </div>
                                        <div className="rounded-xl bg-surface px-3 py-2.5">
                                            <dt className="text-xs text-text-muted">Tenor</dt>
                                            <dd className="font-medium text-text-primary mt-0.5">{detail.tenorMonths} bulan</dd>
                                        </div>
                                        <div className="rounded-xl bg-surface px-3 py-2.5">
                                            <dt className="text-xs text-text-muted">Mulai</dt>
                                            <dd className="font-medium text-text-primary mt-0.5">{formatDate(detail.startDate)}</dd>
                                        </div>
                                        <div className="rounded-xl bg-surface px-3 py-2.5">
                                            <dt className="text-xs text-text-muted">Bunga</dt>
                                            <dd className="font-medium text-text-primary mt-0.5">{detail.interestRate}% / tahun</dd>
                                        </div>
                                    </dl>

                                    {detail.purpose && (
                                        <p className="mt-3 text-xs text-text-muted leading-relaxed">
                                            <span className="font-medium text-text-primary">Tujuan: </span>
                                            {detail.purpose}
                                        </p>
                                    )}
                                </Card>

                                {/* Form Catat Cicilan — hanya saat aktif */}
                                {detail.status === 'active' && (
                                    <Card>
                                        <h3 className="font-medium text-text-primary">Catat Pembayaran</h3>
                                        <div className="mt-4 space-y-4">
                                            <Input
                                                label={`Jumlah (Rp) — cicilan normal: ${formatCurrency(detail.monthlyPayment)}`}
                                                type="text"
                                                value={payAmount}
                                                onChange={(e) => {
                                                    setPayError('')
                                                    setPaySuccess('')
                                                    setPayAmount(formatNumberWithDots(e.target.value))
                                                }}
                                                placeholder={String(detail.monthlyPayment).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            />
                                            <Textarea
                                                label="Keterangan (opsional)"
                                                value={payDesc}
                                                onChange={(e) => setPayDesc(e.target.value)}
                                                placeholder="cth: Cicilan bulan Juni 2025"
                                            />

                                            {payError && (
                                                <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                                                    {payError}
                                                </p>
                                            )}
                                            {paySuccess && (
                                                <p className="rounded-xl border border-success/20 bg-success/5 px-4 py-2.5 text-sm text-success">
                                                    {paySuccess}
                                                </p>
                                            )}

                                            <div className="flex gap-3">
                                                <Button className="flex-1" onClick={openPayConfirm} loading={payLoading}>
                                                    Catat Cicilan
                                                </Button>
                                                <Button variant="danger" onClick={openSettleConfirm}>
                                                    Lunaskan
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Riwayat Pembayaran */}
                                <Card>
                                    <h3 className="font-medium text-text-primary">Riwayat Pembayaran</h3>
                                    {(!detail.payments || detail.payments.length === 0) ? (
                                        <p className="mt-4 text-sm text-text-muted">Belum ada pembayaran</p>
                                    ) : (
                                        <ul className="mt-4 divide-y divide-gray-100">
                                            {detail.payments.map((p) => (
                                                <li key={p.id} className="py-3 flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-text-primary">{p.description || 'Pembayaran'}</p>
                                                        <p className="text-xs text-text-muted mt-0.5">{formatDate(p.date)}</p>
                                                        <p className="text-xs text-text-muted">
                                                            Sisa setelah: <span className="font-medium">{formatCurrency(p.remainingAfter)}</span>
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-success shrink-0">
                                                        +{formatCurrency(p.amount)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Card>
                            </>
                        ) : null}
                    </div>
                )}
            </div>

            <ModalKonfirmasi
                open={modalConfig.open}
                title={modalConfig.title}
                description={modalConfig.description}
                loading={modalConfig.loading}
                onConfirm={handleModalConfirm}
                onCancel={() => setModalConfig((prev) => ({ ...prev, open: false }))}
            />
        </DashboardLayout>
    )
}