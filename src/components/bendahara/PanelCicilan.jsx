// components/bendahara/PanelCicilan.jsx
import { useState } from 'react'
import { Card } from '../ui/Card'
import { ModalKonfirmasi } from './ModalKonfirmasi'
import { formatCurrency, formatDate } from '../../utils/format'

export function PanelCicilan({ loans, onManualProcess, onSchedulerChange, scheduler }) {
    const [showModal, setShowModal] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [lastResult, setLastResult] = useState(null)

    const totalCicilanBulanIni = loans
        .filter((l) => l.status === 'active')
        .reduce((sum, l) => sum + l.monthlyPayment, 0)

    const activeLoans = loans.filter((l) => l.status === 'active')

    async function handleConfirm() {
        setProcessing(true)
        await new Promise((r) => setTimeout(r, 600))
        const results = onManualProcess()
        setProcessing(false)
        setShowModal(false)
        setLastResult({ count: results.length, total: results.reduce((s, r) => s + r.amount, 0) })
    }

    return (
        <>
            <ModalKonfirmasi
                open={showModal}
                title="Proses Cicilan Bulanan"
                description={`Tindakan ini akan mengurangi sisa pinjaman ${activeLoans.length} anggota aktif sesuai cicilan per bulan masing-masing (total ${formatCurrency(totalCicilanBulanIni)}). Tindakan tidak dapat dibatalkan.`}
                onConfirm={handleConfirm}
                onCancel={() => setShowModal(false)}
                loading={processing}
            />

            <Card className="mt-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="font-medium text-text-primary">Proses Cicilan Bulanan</h3>
                        <p className="mt-0.5 text-xs text-text-muted">
                            {activeLoans.length} pinjaman aktif · Total cicilan{' '}
                            <span className="font-medium text-text-primary">{formatCurrency(totalCicilanBulanIni)}</span>
                        </p>
                    </div>

                    {/* Tombol Manual */}
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={activeLoans.length === 0}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light disabled:opacity-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Proses Manual Sekarang
                    </button>
                </div>

                {/* Notif hasil proses */}
                {lastResult && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-success/8 border border-success/20 px-4 py-3">
                        <svg className="h-4 w-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-success">
                            Berhasil memproses <span className="font-medium">{lastResult.count} pinjaman</span> ·{' '}
                            total dikurangi <span className="font-medium">{formatCurrency(lastResult.total)}</span>
                        </p>
                        <button onClick={() => setLastResult(null)} className="ml-auto text-success/60 hover:text-success">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Divider */}
                <div className="my-4 border-t border-gray-100" />

                {/* Pengaturan Otomatis */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Toggle switch */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={scheduler.enabled}
                            onClick={() => onSchedulerChange({ ...scheduler, enabled: !scheduler.enabled })}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${scheduler.enabled ? 'bg-primary' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${scheduler.enabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                        <div>
                            <p className="text-sm font-medium text-text-primary">Proses Otomatis</p>
                            <p className="text-xs text-text-muted">
                                {scheduler.enabled
                                    ? `Aktif · berjalan setiap tanggal ${scheduler.dayOfMonth}`
                                    : 'Nonaktif · proses hanya dilakukan manual'}
                            </p>
                        </div>
                    </div>

                    {/* Pilih tanggal otomatis */}
                    {scheduler.enabled && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-text-muted whitespace-nowrap">Tanggal proses:</label>
                            <select
                                value={scheduler.dayOfMonth}
                                onChange={(e) =>
                                    onSchedulerChange({ ...scheduler, dayOfMonth: Number(e.target.value) })
                                }
                                className="ds-input w-20 py-1.5"
                            >
                                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                            <span className="text-sm text-text-muted">setiap bulan</span>
                        </div>
                    )}
                </div>

                {/* Info terakhir dijalankan */}
                {scheduler.lastRun && (
                    <p className="mt-3 text-xs text-text-muted">
                        Terakhir diproses otomatis:{' '}
                        <span className="text-text-primary">{formatDate(scheduler.lastRun)}</span>
                    </p>
                )}
            </Card>
        </>
    )
}