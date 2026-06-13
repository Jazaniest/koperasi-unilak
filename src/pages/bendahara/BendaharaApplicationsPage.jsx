import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { getLoanApplications, reviewLoanApplication } from '../../services/loanService'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'

export function BendaharaApplicationsPage() {
    const { user } = useAuth()
    const [filter, setFilter] = useState('pending')
    const [selectedId, setSelectedId] = useState(null)
    const [notes, setNotes] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)

    const apps = getLoanApplications(filter === 'all' ? {} : { status: filter })
    void refreshKey
    const selected = apps.find((a) => a.id === selectedId) ?? apps[0]

    const handleReview = (decision) => {
        if (!selected) return
        const result = reviewLoanApplication(
            selected.id,
            user.id,
            decision,
            notes || (decision === 'approved' ? 'Disetujui' : 'Ditolak'),
        )
        if (result.success) {
            setNotes('')
            setSelectedId(null)
            setRefreshKey((k) => k + 1)
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
                                <dd className="leading-relaxed text-text-primary">{selected.collateral}</dd>
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
                                    <Button className="flex-1" onClick={() => handleReview('approved')}>
                                        Setujui
                                    </Button>
                                    <Button variant="danger" className="flex-1" onClick={() => handleReview('rejected')}>
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
        </DashboardLayout>
    )
}
