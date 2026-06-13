// components/bendahara/ModalKonfirmasi.jsx

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