import { IconClose } from '../ui/Icons';

export function ModalSetStatus({ open, onClose, onSubmit, memberName, newStatus, loading }) {
  if (!open) return null;

  const actionText = newStatus === 'active' ? 'Mengaktifkan' : 'Menonaktifkan';
  const newStatusText = newStatus === 'active' ? 'Aktif' : 'Nonaktif';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-surface-card p-6 shadow-xl animate-fade-in">
        <h3 className="font-medium text-text-primary">Konfirmasi Ubah Status</h3>
        <p className="mt-2 text-sm text-text-muted leading-relaxed">
          Anda yakin ingin <span className="font-semibold text-text-primary">{actionText.toLowerCase()}</span> anggota bernama{' '}
          <span className="font-semibold text-text-primary">{memberName}</span>? Status akan diubah menjadi{' '}
          <span className="font-semibold text-text-primary">{newStatusText}</span>.
        </p>
        <div className="mt-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted transition hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light disabled:opacity-60"
          >
            {loading ? 'Memproses...' : `Ya, ${actionText}`}
          </button>
        </div>
      </div>
    </div>
  );
}
