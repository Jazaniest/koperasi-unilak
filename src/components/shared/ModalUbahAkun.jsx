import { useState } from 'react';
import { IconClose } from '../ui/Icons';
import { changePassword, changeEmail } from '../../services/authService';

function FieldInput({ label, id, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>
  );
}

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

const EMPTY_PASS = { old: '', new: '', confirm: '' };
const EMPTY_EMAIL = { new: '', password: '' };

export function ModalUbahAkun({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('password');
  const [passForm, setPassForm] = useState(EMPTY_PASS);
  const [emailForm, setEmailForm] = useState(EMPTY_EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const setPass = (key) => (val) => setPassForm((p) => ({ ...p, [key]: val }));
  const setEmail = (key) => (val) => setEmailForm((p) => ({ ...p, [key]: val }));

  const handleClose = () => {
    setPassForm(EMPTY_PASS);
    setEmailForm(EMPTY_EMAIL);
    setError('');
    setSuccess('');
    setActiveTab('password');
    onClose();
  };

  const handleSubmitPassword = async () => {
    setError('');
    setSuccess('');

    if (!passForm.old || !passForm.new || !passForm.confirm) {
      return setError('Semua kolom password wajib diisi.');
    }
    if (passForm.new.length < 6) {
      return setError('Password baru minimal 6 karakter.');
    }
    if (passForm.new !== passForm.confirm) {
      return setError('Konfirmasi password baru tidak cocok.');
    }
    if (passForm.old === passForm.new) {
      return setError('Password baru tidak boleh sama dengan yang lama.');
    }

    setLoading(true);
    const result = await changePassword(null, passForm.old, passForm.new);
    setLoading(false);

    if (!result.success) {
      return setError(result.error ?? 'Gagal mengubah password.');
    }

    setSuccess('Password berhasil diubah. Gunakan password baru untuk login berikutnya.');
    setPassForm(EMPTY_PASS);
  };

  const handleSubmitEmail = async () => {
    setError('');
    setSuccess('');

    if (!emailForm.new || !emailForm.password) {
      return setError('Semua kolom email wajib diisi.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.new)) {
        return setError('Format email tidak valid');
    }

    setLoading(true);
    const result = await changeEmail(emailForm.new, emailForm.password);
    setLoading(false);

    if (!result.success) {
      return setError(result.error ?? 'Gagal mengubah email.');
    }

    setSuccess('Email berhasil diubah. Silakan login ulang dengan email baru.');
    setEmailForm(EMPTY_EMAIL);
  };

  if (!open) return null;

  const renderContent = () => {
    if (success) {
      return (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-primary">Sukses</p>
          <p className="text-xs text-text-muted">{success}</p>
        </div>
      );
    }
    if (activeTab === 'password') {
      return (
        <div className="space-y-4">
          <FieldPassword label="Password Lama" id="old-password" value={passForm.old} onChange={setPass('old')} placeholder="Masukkan password saat ini" />
          <FieldPassword label="Password Baru" id="new-password" value={passForm.new} onChange={setPass('new')} placeholder="Minimal 6 karakter" />
          <FieldPassword label="Konfirmasi Password Baru" id="confirm-password" value={passForm.confirm} onChange={setPass('confirm')} placeholder="Ulangi password baru" />
        </div>
      );
    }
    if (activeTab === 'email') {
      return (
        <div className="space-y-4">
          <FieldInput label="Email Baru" id="new-email" type="email" value={emailForm.new} onChange={setEmail('new')} placeholder="Masukkan email baru" />
          <FieldPassword label="Password Saat Ini (untuk konfirmasi)" id="current-password" value={emailForm.password} onChange={setEmail('password')} placeholder="Masukkan password Anda" />
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-surface-card shadow-xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-medium text-text-primary">Pengaturan Akun</h3>
            <p className="text-xs text-text-muted mt-0.5">Ubah password atau email Anda</p>
          </div>
          <button type="button" onClick={handleClose} className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 transition" aria-label="Tutup">
            <IconClose />
          </button>
        </div>

        {!success && (
            <div className="border-b border-gray-100 px-6 pt-4">
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('password')} className={`text-sm pb-2 border-b-2 transition ${activeTab === 'password' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}>Ubah Password</button>
                    <button onClick={() => setActiveTab('email')} className={`text-sm pb-2 border-b-2 transition ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}>Ubah Email</button>
                </div>
            </div>
        )}

        <div className="px-6 py-5">
            {renderContent()}
            {error && !success && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 mt-4">{error}</p>
            )}
        </div>

        <div className="flex gap-3 justify-end border-t border-gray-100 px-6 py-4">
          <button type="button" onClick={handleClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted transition hover:bg-gray-50">
            {success ? 'Tutup' : 'Batal'}
          </button>
          {!success && (
            <button
              type="button"
              onClick={activeTab === 'password' ? handleSubmitPassword : handleSubmitEmail}
              disabled={loading}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
