import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { getTopUpApplications, reviewTopUpApplication } from '../../services/loanApplicationService'
import { getLoanDetail } from '../../services/loanService'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'

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

export function BendaharaTopUpPage() {
    //eslint-disable-next-line
    const { user } = useAuth()
    const [filter, setFilter] = useState('pending')
    const [apps, setApps] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [prevLoan, setPrevLoan] = useState(null)
    const [notes, setNotes] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)

    const [modalConfig, setModalConfig] = useState({
        open: false, title: '', description: '', decision: null, loading: false,
    })

    useEffect(() => {
        getTopUpApplications(filter === 'all' ? {} : { status: filter }).then(setApps)
    }, [filter, refreshKey])

    const selected = apps.find((a) => a.id === selectedId) ?? apps[0]

    // Fetch pinjaman lama saat selected berubah
    useEffect(() => {
        if (!selected?.previousLoanId) {
            const timer = setTimeout(() => setPrevLoan(null), 0)
            return () => clearTimeout(timer)
        }

        let cancelled = false

        getLoanDetail(selected.previousLoanId)
            .then((data) => {
                if (!cancelled) setPrevLoan(data)
            })
            .catch(() => {
                if (!cancelled) setPrevLoan(null)
            })

        return () => {
            cancelled = true
        }
    }, [selected?.previousLoanId])

    const openConfirmation = (decision) => {
        if (!selected) return
        const isApprove = decision === 'approved'
        setModalConfig({
            open: true,
            title: isApprove ? 'Setujui Top Up' : 'Tolak Top Up',
            description: isApprove
                ? `Setujui top up ${formatCurrency(selected.amount)} dari ${selected.memberName}? Pinjaman lama (sisa ${prevLoan ? formatCurrency(prevLoan.remaining) : '—'}) akan dilunasi otomatis dan digantikan pinjaman baru.`
                : `Tolak pengajuan top up dari ${selected.memberName} sebesar ${formatCurrency(selected.amount)}?`,
            decision,
            loading: false,
        })
    }

    const handleReview = async () => {
        if (!selected || !modalConfig.decision) return
        setModalConfig((prev) => ({ ...prev, loading: true }))
        try {
            const defaultNote = modalConfig.decision === 'approved' ? 'Top up disetujui' : 'Top up ditolak'
            const result = await reviewTopUpApplication(
                selected.id,
                modalConfig.decision,
                notes.trim() || defaultNote,
            )
            if (result.success) {
                setNotes('')
                setSelectedId(null)
                setRefreshKey((k) => k + 1)
            }
        } catch (err) {
            console.error('Gagal review top up:', err)
        } finally {
            setModalConfig({ open: false, title: '', description: '', decision: null, loading: false })
        }
    }

    const filterLabels = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak', all: 'Semua' }
    const danaSegar = selected && prevLoan ? Number(selected.amount) - Number(prevLoan.remaining) : null

    return (
        <DashboardLayout
            title="Top Up Pinjaman"
            subtitle="Tinjau dan proses pengajuan top up anggota"
            navItems={BendaharaNavbar}
        >
            {/* Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                {['pending', 'approved', 'rejected', 'all'].map((f) => (
                    <button key={f} type="button" onClick={() => setFilter(f)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === f
                            ? 'bg-primary text-white shadow-sm'
                            : 'border border-gray-200 bg-surface-card text-text-muted hover:bg-surface'}`}>
                        {filterLabels[f]}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Daftar pengajuan */}
                <div className="space-y-4">
                    {apps.length === 0 ? (
                        <Card className="py-12 text-center text-text-muted">Tidak ada data</Card>
                    ) : (
                        apps.map((app) => (
                            <button key={app.id} type="button" onClick={() => setSelectedId(app.id)}
                                className={`w-full text-left transition ${selected?.id === app.id ? 'rounded-2xl ring-2 ring-primary/25' : ''}`}>
                                <Card>
                                    <div className="flex justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-text-primary">{app.memberName}</p>
                                            <p className="text-sm text-text-muted">{app.memberNumber}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge status={app.status} />
                                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">TOP UP</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 font-medium text-text-primary">{formatCurrency(app.amount)}</p>
                                    <p className="text-sm text-text-muted line-clamp-2">{app.purpose}</p>
                                    <p className="mt-1 text-xs text-text-muted">{formatDateTime(app.createdAt)}</p>
                                </Card>
                            </button>
                        ))
                    )}
                </div>

                {/* Detail pengajuan */}
                {selected && (
                    <Card className="sticky top-24 h-fit">
                        <h3 className="text-lg font-medium text-text-primary">Detail Top Up</h3>

                        {/* Pinjaman lama */}
                        {prevLoan && (
                            <div className="mt-4 rounded-xl border border-warning/20 bg-warning/5 p-4">
                                <p className="text-xs font-semibold text-warning uppercase tracking-wide mb-2">Pinjaman Lama (akan dilunasi)</p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Jumlah awal</span>
                                        <span className="font-medium">{formatCurrency(prevLoan.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Sisa pinjaman</span>
                                        <span className="font-semibold text-danger">{formatCurrency(prevLoan.remaining)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">ID Pinjaman</span>
                                        <span className="text-xs text-text-muted font-mono">{prevLoan.id}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pinjaman baru */}
                        <div className="mt-4 rounded-xl border border-success/20 bg-success/5 p-4">
                            <p className="text-xs font-semibold text-success uppercase tracking-wide mb-2">Pinjaman Baru (jika disetujui)</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Jumlah</span>
                                    <span className="font-semibold text-primary">{formatCurrency(selected.amount)}</span>
                                </div>
                                {danaSegar !== null && (
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Dana segar ke anggota</span>
                                        <span className="font-semibold text-success">{formatCurrency(danaSegar > 0 ? danaSegar : 0)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Tenor baru</span>
                                    <span>{selected.tenorMonths} bulan</span>
                                </div>
                            </div>
                        </div>

                        {/* Detail lain */}
                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="text-text-muted">Anggota</dt>
                                <dd className="font-medium text-text-primary">{selected.memberName} ({selected.memberNumber})</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Tujuan</dt>
                                <dd className="leading-relaxed text-text-primary">{selected.purpose}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Jaminan</dt>
                                <dd>
                                    {selected.collateral ? (
                                        <a href={`${import.meta.env.VITE_API_URL}/uploads/collateral/${selected.collateral}`}
                                            target="_blank" rel="noopener noreferrer" className="ds-link">
                                            Lihat Dokumen →
                                        </a>
                                    ) : <span className="text-text-muted">Tidak ada jaminan</span>}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Metode Pembayaran</dt>
                                <dd className="font-medium text-text-primary">
                                    {selected.paymentMethod === 'tunai' ? 'Tunai' : 'Transfer Bank'}
                                </dd>
                            </div>
                            {selected.paymentMethod !== 'tunai' && (
                                <div>
                                    <dt className="text-text-muted">Rekening Tujuan</dt>
                                    <dd className="text-text-primary">
                                        {selected.memberBankName && selected.memberBankAccountNumber ? (
                                            <>
                                                {selected.memberBankName} — {selected.memberBankAccountNumber}
                                            </>
                                        ) : (
                                            <span className="text-text-muted">Belum diisi anggota</span>
                                        )}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-text-muted">Diajukan</dt>
                                <dd className="text-text-primary">{formatDateTime(selected.createdAt)}</dd>
                            </div>
                        </dl>

                        {selected.status === 'pending' && (
                            <div className="mt-6 space-y-4">
                                <Textarea label="Catatan" value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Alasan persetujuan atau penolakan..." />
                                <div className="flex gap-3">
                                    <Button className="flex-1" onClick={() => openConfirmation('approved')}>Setujui</Button>
                                    <Button variant="danger" className="flex-1" onClick={() => openConfirmation('rejected')}>Tolak</Button>
                                </div>
                            </div>
                        )}

                        {selected.adminNotes && (
                            <p className="mt-5 rounded-xl border border-gray-100 bg-surface p-4 text-sm leading-relaxed text-text-muted">
                                <span className="font-medium text-text-primary">Catatan:</span> {selected.adminNotes}
                            </p>
                        )}
                    </Card>
                )}
            </div>

            <ModalKonfirmasi
                open={modalConfig.open}
                title={modalConfig.title}
                description={modalConfig.description}
                loading={modalConfig.loading}
                onConfirm={handleReview}
                onCancel={() => setModalConfig((prev) => ({ ...prev, open: false }))}
            />
        </DashboardLayout>
    )
}