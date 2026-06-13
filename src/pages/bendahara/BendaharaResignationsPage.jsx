import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'
import { getPendingResignations, reviewResignation } from '../../services/memberService'
import { ModalKonfirmasi } from '../../components/bendahara/ModalKonfirmasi'
import { formatDate } from '../../utils/format'

export function BendaharaResignationsPage() {
    const [list, setList] = useState([])
    const [selected, setSelected] = useState(null)
    const [notes, setNotes] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)
    const [modalConfig, setModalConfig] = useState({
        open: false, title: '', description: '', decision: null, loading: false,
    })
    const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', message }

    useEffect(() => {
        getPendingResignations().then(setList)
    }, [refreshKey])

    function openConfirm(decision) {
        if (!selected) return
        const isApprove = decision === 'approved'
        setModalConfig({
            open: true,
            title: isApprove ? 'Setujui Pengunduran Diri' : 'Tolak Pengunduran Diri',
            description: isApprove
                ? `Menyetujui pengunduran diri ${selected.name} (${selected.memberNumber}). Akun anggota akan dinonaktifkan. Tindakan ini tidak dapat dibatalkan.`
                : `Menolak pengajuan pengunduran diri ${selected.name}. Anggota tetap aktif.`,
            decision,
            loading: false,
        })
    }

    async function handleReview() {
        if (!selected || !modalConfig.decision) return
        setModalConfig((prev) => ({ ...prev, loading: true }))
        setFeedback(null)

        const result = await reviewResignation(selected.id, modalConfig.decision, notes.trim())

        setModalConfig({ open: false, title: '', description: '', decision: null, loading: false })

        if (result.success) {
            setSelected(null)
            setNotes('')
            setRefreshKey((k) => k + 1)
            setFeedback({
                type: 'success',
                message: modalConfig.decision === 'approved'
                    ? 'Pengunduran diri disetujui. Akun anggota dinonaktifkan.'
                    : 'Pengajuan pengunduran diri ditolak.',
            })
        } else {
            setFeedback({ type: 'error', message: result.error })
        }
    }

    return (
        <DashboardLayout
            title="Pengunduran Diri"
            subtitle="Tinjau pengajuan pengunduran diri anggota"
            navItems={BendaharaNavbar}
        >
            {feedback && (
                <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success'
                        ? 'border-success/20 bg-success/8 text-success'
                        : 'border-danger/20 bg-danger/8 text-danger'
                    }`}>
                    {feedback.message}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* ── Daftar Kiri ── */}
                <div className="space-y-4">
                    {list.length === 0 ? (
                        <Card className="py-12 text-center text-text-muted">
                            Tidak ada pengajuan pengunduran diri
                        </Card>
                    ) : (
                        list.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => { setSelected(item); setNotes(''); setFeedback(null) }}
                                className={`w-full text-left transition ${selected?.id === item.id ? 'rounded-2xl ring-2 ring-primary/25' : ''
                                    }`}
                            >
                                <Card>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-text-primary">{item.name}</p>
                                            <p className="text-sm text-text-muted">{item.memberNumber}</p>
                                        </div>
                                        <span className="shrink-0 rounded-lg border border-warning/30 bg-warning/8 px-2.5 py-1 text-xs font-medium text-warning">
                                            Menunggu
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-text-muted line-clamp-2">
                                        {item.resignationReason || 'Tidak ada alasan'}
                                    </p>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Diajukan: {formatDate(item.resignationRequestedAt)}
                                    </p>
                                </Card>
                            </button>
                        ))
                    )}
                </div>

                {/* ── Detail Kanan ── */}
                {selected && (
                    <Card className="sticky top-24 h-fit">
                        <h3 className="text-lg font-medium text-text-primary">Detail Pengajuan</h3>
                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="text-text-muted">Anggota</dt>
                                <dd className="font-medium text-text-primary">{selected.name}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">No. Anggota</dt>
                                <dd className="font-medium text-text-primary">{selected.memberNumber}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Email</dt>
                                <dd className="font-medium text-text-primary">{selected.email}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Telepon</dt>
                                <dd className="font-medium text-text-primary">{selected.phone}</dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Tanggal Pengajuan</dt>
                                <dd className="font-medium text-text-primary">
                                    {formatDate(selected.resignationRequestedAt)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-text-muted">Alasan</dt>
                                <dd className="mt-1 leading-relaxed text-text-primary rounded-xl border border-gray-100 bg-surface px-3 py-2">
                                    {selected.resignationReason || <span className="text-text-muted italic">Tidak ada alasan</span>}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Catatan untuk anggota..."
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button className="flex-1" onClick={() => openConfirm('approved')}>
                                    Setujui & Nonaktifkan
                                </Button>
                                <Button variant="danger" className="flex-1" onClick={() => openConfirm('rejected')}>
                                    Tolak
                                </Button>
                            </div>
                        </div>
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