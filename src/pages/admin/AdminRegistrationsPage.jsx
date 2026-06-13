import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { AdminNavbar } from '../../components/admin/AdminNavbar'
import {
    getAllRegistrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest,
} from '../../services/registrationService'
import { createMember } from '../../services/memberService'
import { formatCurrency } from '../../utils/format'

// ── Status badge helper ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        pending: { label: 'Menunggu', className: 'bg-warning/10 text-warning' },
        approved: { label: 'Disetujui', className: 'bg-success/10 text-success' },
        rejected: { label: 'Ditolak', className: 'bg-danger/10 text-danger' },
    }
    const { label, className } = map[status] ?? map.pending
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
            {label}
        </span>
    )
}

// ── Modal Review ──────────────────────────────────────────────────────────────
function ReviewModal({ request, onClose, onDone }) {
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handle = async (action) => {
        setError('')
        setLoading(true)
        const fn = action === 'approve' ? approveRegistrationRequest : rejectRegistrationRequest
        const result = await fn(request.id, note)
        setLoading(false)
        if (!result.success) { setError(result.error); return }
        onDone(action)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-xl">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-text-primary">Tinjau Pendaftaran</h3>
                        <p className="mt-0.5 text-sm text-text-muted">{request.name}</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
                        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Data ringkasan */}
                <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-surface p-4 text-sm">
                    <div>
                        <p className="text-xs text-text-muted">Email</p>
                        <p className="mt-0.5 break-all font-medium text-text-primary">{request.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-text-muted">Telepon</p>
                        <p className="mt-0.5 font-medium text-text-primary">{request.phone || '-'}</p>
                    </div>
                    {request.nik && (
                        <div>
                            <p className="text-xs text-text-muted">NIK</p>
                            <p className="mt-0.5 font-medium text-text-primary">{request.nik}</p>
                        </div>
                    )}
                    {request.birthPlaceAndDate && (
                        <div>
                            <p className="text-xs text-text-muted">Tempat/Tgl Lahir</p>
                            <p className="mt-0.5 font-medium text-text-primary">{request.birthPlaceAndDate}</p>
                        </div>
                    )}
                    {request.occupation && (
                        <div>
                            <p className="text-xs text-text-muted">Pekerjaan</p>
                            <p className="mt-0.5 font-medium text-text-primary">{request.occupation}</p>
                        </div>
                    )}
                    {request.monthlyIncome && (
                        <div>
                            <p className="text-xs text-text-muted">Penghasilan</p>
                            <p className="mt-0.5 font-medium text-text-primary">{formatCurrency(request.monthlyIncome)}</p>
                        </div>
                    )}
                    {request.address && (
                        <div className="col-span-2">
                            <p className="text-xs text-text-muted">Alamat</p>
                            <p className="mt-0.5 font-medium text-text-primary">{request.address}</p>
                        </div>
                    )}
                </div>

                <Textarea
                    label="Catatan (opsional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tambahkan catatan untuk pendaftar..."
                    rows={3}
                />

                {error && (
                    <p className="mt-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                        {error}
                    </p>
                )}

                <div className="mt-5 flex gap-3">
                    <Button variant="danger" className="flex-1" loading={loading} onClick={() => handle('reject')}>
                        Tolak
                    </Button>
                    <Button variant="primary" className="flex-1" loading={loading} onClick={() => handle('approve')}>
                        Setujui
                    </Button>
                </div>
            </Card>
        </div>
    )
}

// ── Modal Tambah Anggota Langsung (oleh Admin) ────────────────────────────────
function AddMemberModal({ onClose, onDone }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '',
        nik: '', birthPlaceAndDate: '', address: '',
        occupation: '', monthlyIncome: '',
    })

    const set = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        setError('')
    }

    const handleSubmit = async () => {
        if (!form.name.trim()) { setError('Nama wajib diisi'); return }
        if (!form.email.trim()) { setError('Email wajib diisi'); return }
        if (!form.password) { setError('Kata sandi wajib diisi'); return }
        if (form.password.length < 6) { setError('Kata sandi minimal 6 karakter'); return }

        setLoading(true)
        const payload = {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            phone: form.phone || undefined,
            nik: form.nik || undefined,
            birthPlaceAndDate: form.birthPlaceAndDate || undefined,
            address: form.address || undefined,
            occupation: form.occupation || undefined,
            monthlyIncome: form.monthlyIncome ? Number(form.monthlyIncome) : undefined,
        }
        const result = await createMember(payload)
        setLoading(false)
        if (!result.success) { setError(result.error); return }
        onDone()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-text-primary">Tambah Anggota Baru</h3>
                        <p className="mt-0.5 text-sm text-text-muted">Admin menambahkan anggota langsung tanpa proses persetujuan</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
                        <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="Nama Lengkap *" value={form.name} onChange={set('name')} placeholder="Sesuai KTP" />
                        <Input label="Email *" type="email" value={form.email} onChange={set('email')} placeholder="nama@email.com" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="Kata Sandi *" type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 karakter" />
                        <Input label="No. Telepon" type="tel" value={form.phone} onChange={set('phone')} placeholder="08xxxxxxxxxx" />
                    </div>

                    <hr className="border-gray-100" />
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Data Keanggotaan (opsional)</p>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="NIK" value={form.nik} onChange={set('nik')} placeholder="16 digit" maxLength={16} />
                        <Input label="Tempat & Tgl Lahir" value={form.birthPlaceAndDate} onChange={set('birthPlaceAndDate')} placeholder="Kota, DD MMM YYYY" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="Pekerjaan" value={form.occupation} onChange={set('occupation')} placeholder="Dosen, Staf..." />
                        <Input label="Penghasilan/Bulan (Rp)" type="number" value={form.monthlyIncome} onChange={set('monthlyIncome')} placeholder="5000000" />
                    </div>
                    <Textarea label="Alamat" value={form.address} onChange={set('address')} placeholder="Alamat lengkap" rows={3} />
                </div>

                {error && (
                    <p className="mt-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                        {error}
                    </p>
                )}

                <div className="mt-5 flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={onClose}>Batal</Button>
                    <Button className="flex-1" loading={loading} onClick={handleSubmit}>Tambah Anggota</Button>
                </div>
            </Card>
        </div>
    )
}

// ── Halaman Utama ─────────────────────────────────────────────────────────────
export function AdminRegistrationsPage() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('pending')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    const load = useCallback(() => {
        setLoading(true)
        getAllRegistrationRequests(filterStatus || null)
            .then(setRequests)
            .finally(() => setLoading(false))
    }, [filterStatus])
    //eslint-disable-next-line
    useEffect(() => { load() }, [load])

    const handleReviewDone = (action) => {
        setSelectedRequest(null)
        showToast(action === 'approve' ? 'Pendaftaran berhasil disetujui' : 'Pendaftaran ditolak')
        load()
    }

    const handleAddDone = () => {
        setShowAddModal(false)
        showToast('Anggota berhasil ditambahkan')
        load()
    }

    const pendingCount = requests.filter((r) => r.status === 'pending').length

    return (
        <DashboardLayout
            title="Pendaftaran Anggota"
            subtitle="Kelola permintaan pendaftaran dan tambah anggota baru"
            navItems={AdminNavbar}
        >
            {/* Toast */}
            {toast && (
                <div className={`fixed right-5 top-5 z-100 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition-all ${toast.type === 'success' ? 'bg-success' : 'bg-danger'
                    }`}>
                    {toast.msg}
                </div>
            )}

            {/* Header actions */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                {/* Filter tabs */}
                <div className="flex gap-1 rounded-xl border border-gray-100 bg-surface p-1">
                    {[
                        { value: 'pending', label: 'Menunggu' },
                        { value: 'approved', label: 'Disetujui' },
                        { value: 'rejected', label: 'Ditolak' },
                        { value: '', label: 'Semua' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilterStatus(tab.value)}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${filterStatus === tab.value
                                    ? 'bg-white text-text-primary shadow-sm'
                                    : 'text-text-muted hover:text-text-primary'
                                }`}
                        >
                            {tab.label}
                            {tab.value === 'pending' && pendingCount > 0 && filterStatus !== 'pending' && (
                                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-white">
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <Button onClick={() => setShowAddModal(true)}>
                    + Tambah Anggota
                </Button>
            </div>

            {/* List */}
            {loading ? (
                <p className="text-sm text-text-muted">Memuat data...</p>
            ) : requests.length === 0 ? (
                <Card>
                    <p className="py-6 text-center text-sm text-text-muted">
                        {filterStatus === 'pending' ? 'Tidak ada pendaftaran yang menunggu persetujuan.' : 'Tidak ada data.'}
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {requests.map((req) => (
                        <Card key={req.id} className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="ds-avatar h-10 w-10 text-sm">
                                    {req.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                </div>
                                <StatusBadge status={req.status} />
                            </div>

                            <div>
                                <h3 className="font-medium text-text-primary">{req.name}</h3>
                                <p className="text-sm text-text-muted">{req.email}</p>
                                {req.phone && <p className="text-xs text-text-muted">{req.phone}</p>}
                            </div>

                            {(req.occupation || req.nik) && (
                                <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-100 bg-surface px-3 py-2.5 text-xs">
                                    {req.occupation && (
                                        <div>
                                            <p className="text-text-muted">Pekerjaan</p>
                                            <p className="mt-0.5 font-medium text-text-primary">{req.occupation}</p>
                                        </div>
                                    )}
                                    {req.nik && (
                                        <div>
                                            <p className="text-text-muted">NIK</p>
                                            <p className="mt-0.5 font-medium text-text-primary">{req.nik}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <p className="text-xs text-text-muted">
                                Daftar: {new Date(req.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>

                            {req.reviewNote && (
                                <p className="rounded-lg border border-gray-100 bg-surface px-3 py-2 text-xs text-text-muted">
                                    Catatan: {req.reviewNote}
                                </p>
                            )}

                            {req.status === 'pending' && (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="mt-auto w-full"
                                    onClick={() => setSelectedRequest(req)}
                                >
                                    Tinjau Pendaftaran
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Review modal */}
            {selectedRequest && (
                <ReviewModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onDone={handleReviewDone}
                />
            )}

            {/* Add member modal */}
            {showAddModal && (
                <AddMemberModal
                    onClose={() => setShowAddModal(false)}
                    onDone={handleAddDone}
                />
            )}
        </DashboardLayout>
    )
}