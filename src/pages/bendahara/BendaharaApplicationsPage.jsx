import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { getLoanApplications, reviewLoanApplication } from '../../services/loanApplicationService'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'

// ── KOMPONEN MODAL KONFIRMASI ───────────────────────────────────────────────
export function ModalKonfirmasi({ open, title, description, onConfirm, onCancel, loading }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* backdrop */}
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-surface-card p-6 shadow-xl animate-fade-in">
                <h3 className="font-medium text-text-primary">{title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
                <div className="mt-5 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light disabled:opacity-60"
                    >
                        {loading ? 'Memproses...' : 'Ya, Proses Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── HALAMAN UTAMA ───────────────────────────────────────────────────────────
export function BendaharaApplicationsPage() {
    const { user } = useAuth()
    const [filter, setFilter] = useState('pending')
    const [selectedId, setSelectedId] = useState(null)
    const [notes, setNotes] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)
    const [apps, setApps] = useState([])

    // State untuk mengontrol Modal Konfirmasi
    const [modalConfig, setModalConfig] = useState({
        open: false,
        title: '',
        description: '',
        decision: null,
        loading: false,
    })

    useEffect(() => {
        getLoanApplications(filter === 'all' ? { type: 'regular' } : { status: filter, type: 'regular' }).then(setApps)
    }, [filter, refreshKey])

    const selected = apps.find((a) => a.id === selectedId) ?? apps[0]

    // Pemicu awal ketika tombol "Setujui" atau "Tolak" diklik
    const openConfirmation = (decision) => {
        if (!selected) return
        const isApprove = decision === 'approved'

        setModalConfig({
            open: true,
            title: isApprove ? 'Setujui Pengajuan' : 'Tolak Pengajuan',
            description: `Apakah Anda yakin ingin ${isApprove ? 'menyetujui' : 'menolak'} pengajuan pinjaman dari ${selected.memberName} sebesar ${formatCurrency(selected.amount)}?`,
            decision: decision,
            loading: false,
        })
    }

    // Eksekusi review setelah dikonfirmasi di dalam modal
    const handleReview = async () => {
        if (!selected || !modalConfig.decision) return

        // Set loading modal menjadi true
        setModalConfig((prev) => ({ ...prev, loading: true }))

        try {
            const defaultNote = modalConfig.decision === 'approved' ? 'Disetujui' : 'Ditolak'

            // Ditambahkan await karena fungsi ini melakukan hit ke API / Database
            const result = await reviewLoanApplication(
                selected.id,
                user.id,
                modalConfig.decision,
                notes.trim() || defaultNote,
            )

            if (result.success) {
                setNotes('')
                setSelectedId(null)
                // Memicu useEffect untuk menarik data terbaru (auto refresh)
                setRefreshKey((k) => k + 1)
            }
        } catch (error) {
            console.error("Gagal memperbarui status pengajuan:", error)
        } finally {
            // Tutup dan reset modal setelah selesai
            setModalConfig({
                open: false,
                title: '',
                description: '',
                decision: null,
                loading: false,
            })
        }
    }

    const filterLabels = {
        pending: 'Menunggu',
        approved: 'Disetujui',
        rejected: 'Ditolak',
        all: 'Semua',
    }

    return (
        <DashboardLayout
            title="Pengajuan Pinjaman"
            subtitle="Tinjau dan setujui atau tolak pengajuan anggota"
            navItems={BendaharaNavbar}
        >
            <div className="mb-6 flex flex-wrap gap-2">
                {['pending', 'approved', 'rejected', 'all'].map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === f
                            ? 'bg-primary text-white shadow-sm'
                            : 'border border-gray-200 bg-surface-card text-text-muted hover:bg-surface'
                            }`}
                    >
                        {filterLabels[f]}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    {apps.length === 0 ? (
                        <Card className="py-12 text-center text-text-muted">Tidak ada data</Card>
                    ) : (
                        apps.map((app) => (
                            <button
                                key={app.id}
                                type="button"
                                onClick={() => setSelectedId(app.id)}
                                className={`w-full text-left transition ${selected?.id === app.id ? 'rounded-2xl ring-2 ring-primary/25' : ''}`}
                            >
                                <Card>
                                    <div className="flex justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-text-primary">{app.memberName}</p>
                                            <p className="text-sm text-text-muted">{app.memberNumber}</p>
                                        </div>
                                        <Badge status={app.status} />
                                    </div>
                                    <p className="mt-2 font-medium text-text-primary">{formatCurrency(app.amount)}</p>
                                    <p className="text-sm text-text-muted line-clamp-2">{app.purpose}</p>
                                    <p className="mt-1 text-xs text-text-muted">{formatDateTime(app.createdAt)}</p>
                                </Card>
                            </button>
                        ))
                    )}
                </div>

                {selected && (
                    <Card className="sticky top-24 h-fit lg:col-span-1">
                        <h3 className="text-lg font-medium text-text-primary">Detail Pengajuan</h3>
                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="text-text-muted">Anggota</dt>
                                <dd className="font-medium text-text-primary">{selected.memberName}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Jumlah</dt>
                                <dd className="ds-display-value text-primary">{formatCurrency(selected.amount)}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Tujuan</dt>
                                <dd className="leading-relaxed text-text-primary">{selected.purpose}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Tenor</dt>
                                <dd className="font-medium text-text-primary">{selected.tenorMonths} bulan</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Jaminan</dt>
                                <dd className="leading-relaxed text-text-primary">
                                    {selected.collateral ? (
                                        <a
                                            href={ `${import.meta.env.VITE_API_URL}/uploads/collateral/${selected.collateral}` }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ds-link"
                                        >
                                    Lihat Dokumen →
                                </a>
                                ) : (
                                <span className="text-text-muted">Tidak ada jaminan</span>
                                )}
                            </dd>
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
                        </div>
                    </dl>

                        {selected.status === 'pending' && (
                    <div className="mt-6 space-y-4">
                        <Textarea
                            label="Catatan"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Alasan persetujuan atau penolakan..."
                        />
                        <div className="flex gap-3">
                            <Button className="flex-1" onClick={() => openConfirmation('approved')}>
                                Setujui
                            </Button>
                            <Button variant="danger" className="flex-1" onClick={() => openConfirmation('rejected')}>
                                Tolak
                            </Button>
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

            {/* Injeksi Komponen Modal Konfirmasi ke dalam DOM render */ }
    <ModalKonfirmasi
        open={modalConfig.open}
        title={modalConfig.title}
        description={modalConfig.description}
        loading={modalConfig.loading}
        onConfirm={handleReview}
        onCancel={() => setModalConfig((prev) => ({ ...prev, open: false }))}
    />
        </DashboardLayout >
    )
}