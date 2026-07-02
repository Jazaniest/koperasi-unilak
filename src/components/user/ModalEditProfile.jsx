// components/member/ModalEditProfil.jsx

import { useState, useEffect } from 'react'
import { IconClose } from '../ui/Icons'
import { apiRequest } from '../../services/api'

const FIELD_CONFIG = [
    { key: 'name', label: 'Nama Lengkap', type: 'text', source: 'user', placeholder: 'Nama lengkap Anda' },
    { key: 'phone', label: 'Nomor HP', type: 'tel', source: 'user', placeholder: 'contoh: 081234567890' },
    { key: 'birth_place_and_date', label: 'Tempat & Tanggal Lahir', type: 'text', source: 'member', placeholder: 'contoh: Pekanbaru, 01-01-1990' },
    { key: 'address', label: 'Alamat', type: 'textarea', source: 'member', placeholder: 'Alamat lengkap' },
    { key: 'occupation', label: 'Pekerjaan', type: 'text', source: 'member', placeholder: 'contoh: Dosen' },
]

export function ModalEditProfil({ open, user, onClose, onSuccess }) {
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState('')

    // Ambil data member saat modal dibuka
    useEffect(() => {
        if (!open || !user) return

        async function fetchMember() {
            setFetching(true)
            setError('')
            try {
                const res = await apiRequest('/auth/me/member')
                const member = res.data ?? {}
                setForm({
                    // dari tabel users
                    name: user.name ?? '',
                    phone: user.phone ?? '',
                    // dari tabel members
                    birth_place_and_date: member.birth_place_and_date ?? '',
                    address: member.address ?? '',
                    occupation: member.occupation ?? '',
                })
            } catch {
                setError('Gagal memuat data profil.')
            } finally {
                setFetching(false)
            }
        }

        fetchMember()
    }, [open, user])

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const res = await apiRequest('/auth/me/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    birth_place_and_date: form.birth_place_and_date,
                    address: form.address,
                    occupation: form.occupation,
                }),
            })
            onSuccess?.(res.data)  // ← teruskan data terbaru ke parent
            onClose()
        } catch (err) {
            setError(err.message ?? 'Gagal menyimpan perubahan.')
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-surface-card shadow-xl animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h3 className="font-medium text-text-primary">Edit Informasi Pribadi</h3>
                        <p className="text-xs text-text-muted mt-0.5">Perubahan akan langsung tersimpan</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 transition"
                        aria-label="Tutup"
                    >
                        <IconClose />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
                    {fetching ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="text-sm text-text-muted">Memuat data...</span>
                        </div>
                    ) : (
                        FIELD_CONFIG.map(({ key, label, type, placeholder }) => (
                            <div key={key}>
                                <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                    {label}
                                </label>
                                {type === 'textarea' ? (
                                    <textarea
                                        rows={3}
                                        value={form[key] ?? ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition"
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        value={form[key] ?? ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                    />
                                )}
                            </div>
                        ))
                    )}

                    {error && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || fetching}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light disabled:opacity-60"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </div>
        </div>
    )
}