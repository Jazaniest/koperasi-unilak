import { useState } from 'react'
// import { Button } from '../ui/Button'

export function ModalPengunduranDiri({ open, onClose, onSubmit, loading, hasActiveLoans }) {
    const [reason, setReason] = useState('')

    if (!open) return null

    const handleSubmit = () => {
        onSubmit(reason)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-surface-card p-6 shadow-xl animate-fade-in">
                <h3 className="font-medium text-text-primary">Pengajuan Pengunduran Diri</h3>

                {hasActiveLoans ? (
                    <div className="mt-4 rounded-xl border border-danger/20 bg-danger/8 px-4 py-3">
                        <p className="text-sm font-medium text-danger">Tidak Dapat Mengajukan</p>
                        <p className="mt-1 text-sm text-text-muted leading-relaxed">
                            Anda masih memiliki pinjaman aktif. Lunasi seluruh pinjaman terlebih dahulu
                            sebelum mengajukan pengunduran diri.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="mt-2 text-sm text-text-muted leading-relaxed">
                            Pengajuan akan dikirim ke bendahara untuk ditinjau. Akun Anda akan dinonaktifkan
                            setelah pengajuan disetujui.
                        </p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                Alasan Pengunduran Diri
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Tuliskan alasan pengunduran diri Anda..."
                                rows={4}
                                className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>
                    </>
                )}

                <div className="mt-5 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    {!hasActiveLoans && (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !reason.trim()}
                            className="rounded-xl bg-danger px-4 py-2 text-sm font-medium text-white transition hover:bg-danger/90 disabled:opacity-60"
                        >
                            {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}