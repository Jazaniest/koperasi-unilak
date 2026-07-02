import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconLogo } from '../components/ui/Icons'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { submitRegistration } from '../services/registrationService'

const STEPS = [
    { id: 1, label: 'Akun', desc: 'Data login' },
    { id: 2, label: 'Pribadi', desc: 'Data diri' },
]

export function RegisterPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        // Step 1
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        // Step 2
        birthPlaceAndDate: '',
        address: '',
        occupation: '',
        monthlyIncome: '',
    })

    const set = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        setError('')
    }

    const validateStep1 = () => {
        if (!form.name.trim()) return 'Nama lengkap wajib diisi'
        if (!form.email.trim()) return 'Email wajib diisi'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Format email tidak valid'
        if (!form.password) return 'Kata sandi wajib diisi'
        if (form.password.length < 6) return 'Kata sandi minimal 6 karakter'
        if (form.password !== form.confirmPassword) return 'Konfirmasi kata sandi tidak cocok'
        return null
    }

    const handleNext = () => {
        const err = validateStep1()
        if (err) { setError(err); return }
        setStep(2)
    }

    const handleSubmit = async () => {
        setError('')
        setLoading(true)

        const payload = {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            phone: form.phone.trim() || undefined,
            birthPlaceAndDate: form.birthPlaceAndDate.trim() || undefined,
            address: form.address.trim() || undefined,
            occupation: form.occupation.trim() || undefined,
            monthlyIncome: form.monthlyIncome ? Number(form.monthlyIncome) : undefined,
        }

        const result = await submitRegistration(payload)
        setLoading(false)

        if (!result.success) {
            setError(result.error)
            return
        }

        setSubmitted(true)
    }

    // ── Sukses ───────────────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="relative min-h-screen bg-primary">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-24 top-0 h-96 w-96 rounded-2xl bg-accent/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-2xl bg-primary-light/30 blur-3xl" />
                </div>
                <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
                    <Card className="w-full max-w-md text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
                            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Pendaftaran Terkirim!</h2>
                        <p className="mt-3 text-sm leading-relaxed text-text-muted">
                            Permintaan pendaftaran Anda telah diterima dan sedang menunggu persetujuan admin.
                            Anda akan dihubungi melalui email setelah diproses.
                        </p>
                        <div className="mt-6 rounded-xl border border-gray-100 bg-surface px-4 py-3 text-left">
                            <p className="text-xs text-text-muted">Email yang didaftarkan</p>
                            <p className="mt-0.5 text-sm font-medium text-text-primary">{form.email}</p>
                        </div>
                        <Button
                            className="mt-6 w-full"
                            onClick={() => navigate('/login')}
                        >
                            Kembali ke Halaman Login
                        </Button>
                    </Card>
                </div>
            </div>
        )
    }

    // ── Form ─────────────────────────────────────────────────────────────────────
    return (
        <div className="relative min-h-screen bg-primary">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-24 top-0 h-96 w-96 rounded-2xl bg-accent/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-2xl bg-primary-light/30 blur-3xl" />
            </div>

            <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10 sm:px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-surface-card/10 backdrop-blur-sm">
                        <IconLogo className="h-9 w-9" />
                    </div>
                    <h1 className="text-2xl font-medium text-white sm:text-3xl">Daftar Anggota</h1>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                        Koperasi Unilak — isi data di bawah, admin akan memverifikasi pendaftaran Anda
                    </p>
                </div>

                <Card className="w-full max-w-lg border-gray-100 shadow-sm">
                    {/* Step indicator */}
                    <div className="mb-6 flex items-center gap-3">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${step >= s.id
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-text-muted'
                                            }`}
                                    >
                                        {step > s.id ? (
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : s.id}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-medium ${step >= s.id ? 'text-text-primary' : 'text-text-muted'}`}>
                                            {s.label}
                                        </p>
                                        <p className="text-[11px] text-text-muted">{s.desc}</p>
                                    </div>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-px flex-1 transition-colors ${step > s.id ? 'bg-primary/30' : 'bg-gray-100'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step 1 — Data Akun */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <Input
                                label="Nama Lengkap"
                                type="text"
                                value={form.name}
                                onChange={set('name')}
                                placeholder="Sesuai KTP"
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={set('email')}
                                placeholder="nama@email.com"
                                required
                                autoComplete="email"
                            />
                            <Input
                                label="No. Telepon"
                                type="tel"
                                value={form.phone}
                                onChange={set('phone')}
                                placeholder="08xxxxxxxxxx"
                            />
                            <Input
                                label="Kata Sandi"
                                type="password"
                                value={form.password}
                                onChange={set('password')}
                                placeholder="Minimal 6 karakter"
                                required
                                autoComplete="new-password"
                            />
                            <Input
                                label="Konfirmasi Kata Sandi"
                                type="password"
                                value={form.confirmPassword}
                                onChange={set('confirmPassword')}
                                placeholder="Ulangi kata sandi"
                                required
                                autoComplete="new-password"
                            />

                            {error && (
                                <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                                    {error}
                                </p>
                            )}

                            <Button className="w-full" size="lg" onClick={handleNext}>
                                Lanjut →
                            </Button>
                        </div>
                    )}

                    {/* Step 2 — Data Pribadi */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-xs leading-relaxed text-text-muted">
                                Data di bawah bersifat opsional, namun membantu proses verifikasi lebih cepat.
                            </p>
                            <Input
                                label="Tempat & Tanggal Lahir"
                                type="text"
                                value={form.birthPlaceAndDate}
                                onChange={set('birthPlaceAndDate')}
                                placeholder="Pekanbaru, 01 Januari 1990"
                            />
                            <Textarea
                                label="Alamat"
                                value={form.address}
                                onChange={set('address')}
                                placeholder="Alamat lengkap sesuai KTP"
                                rows={3}
                            />
                            <Input
                                label="Pekerjaan"
                                type="text"
                                value={form.occupation}
                                onChange={set('occupation')}
                                placeholder="Dosen, Staf, dll."
                            />
                            <Input
                                label="Penghasilan Bulanan (Rp)"
                                type="number"
                                value={form.monthlyIncome}
                                onChange={set('monthlyIncome')}
                                placeholder="5000000"
                                min={0}
                            />

                            {error && (
                                <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-3">
                                <Button variant="secondary" className="flex-1" onClick={() => { setStep(1); setError('') }}>
                                    ← Kembali
                                </Button>
                                <Button className="flex-1" size="lg" loading={loading} onClick={handleSubmit}>
                                    Kirim Pendaftaran
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="mt-6 text-center text-sm text-text-muted">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    )
}