import { useState } from 'react';
import { IconClose } from '../ui/Icons';

function FieldPassword({ label, id, value, onChange, placeholder }) {
    const [show, setShow] = useState(false);
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-text-muted">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
            aria-label={show ? 'Sembunyikan' : 'Tampilkan'}
          >
            {show ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.03 0 2.02.15 2.955.43M6.1 6.1A9.97 9.97 0 003 12c0 3 4 7 9 7a9.97 9.97 0 005.9-1.9M21 21L3 3" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

export function ModalResetPassword({ open, onClose, onSubmit, memberName, loading, error, success }) {
  const [newPassword, setNewPassword] = useState('');

  const handleInternalSubmit = () => {
    if (newPassword.length < 6) {
        onSubmit(newPassword, true); // pass error flag
        return;
    }
    onSubmit(newPassword, false);
  }

  const handleClose = () => {
    setNewPassword('');
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-surface-card shadow-xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-medium text-text-primary">Reset Password</h3>
            <p className="text-xs text-text-muted mt-0.5">Untuk anggota: {memberName}</p>
          </div>
          <button type="button" onClick={handleClose} className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 transition" aria-label="Tutup">
            <IconClose />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
            {success ? (
                 <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-text-primary">Password berhasil direset</p>
                 </div>
            ) : (
                <>
                    <FieldPassword
                        label="Password Baru"
                        id="new-password"
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="Minimal 6 karakter"
                    />
                    {error && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                    )}
                </>
            )}
        </div>
        <div className="flex gap-3 justify-end border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted transition hover:bg-gray-50"
          >
            {success ? 'Tutup' : 'Batal'}
          </button>
          {!success && (
            <button
              type="button"
              onClick={handleInternalSubmit}
              disabled={loading}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
