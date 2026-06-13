// pages/bendahara/BendaharaDashboard.jsx
import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { StatCard, Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { IconWallet, IconLoan } from '../../components/ui/Icons'
import {
    getTreasurerStats,
    getAllSavingsTransactions,
    getAllLoansWithMembers,
    getLast6MonthsReport,
    MONTH_NAMES,
    processMonthlyCicilan,
    getSchedulerConfig,
    saveSchedulerConfig,
    checkAndRunScheduler,
    processSimapananWajib,
    getSchedulerWajibConfig,
    saveSchedulerWajibConfig,
    checkAndRunSchedulerWajib,
} from '../../services/treasureService'
import { formatCurrency, formatDate } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'

// ─── Komponen lokal yang dipecah ─────────────────────────────────────────────
import { MiniBarChart } from '../../components/bendahara/MiniBarChart'
import { SavingsTypeBadge } from '../../components/bendahara/SavingsTypeBadge'
import { LoanProgressBar } from '../../components/bendahara/LoanProgressBar'
import { PanelCicilan } from '../../components/bendahara/PanelCicilan'
import { PanelSimpananWajib } from '../../components/bendahara/PanelSimpananWajib'

// ─── Ikon Bendahara ──────────────────────────────────────────────────────────

function IconChart({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
    )
}

function IconCash({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
    )
}

// ─── Navigasi Bendahara ──────────────────────────────────────────────────────

// const nav = [
//     { to: '/bendahara', label: 'Dashboard', icon: IconHome, end: true },
//     { to: '/bendahara/pengajuan', label: 'Pengajuan Pinjaman', icon: IconFile },
// ]

// ─── Dashboard Utama ─────────────────────────────────────────────────────────

export function BendaharaDashboard() {
    const [stats, setStats] = useState(() => getTreasurerStats())
    const savingsTx = useMemo(() => getAllSavingsTransactions().slice(0, 6), [])
    const monthlyReports = useMemo(() => getLast6MonthsReport(), [])
    const [loans, setLoans] = useState(() => getAllLoansWithMembers())
    const [scheduler, setScheduler] = useState(() => getSchedulerConfig())
    const [schedulerWajib, setSchedulerWajib] = useState(() => getSchedulerWajibConfig())

    function handleManualProcess() {
        const results = processMonthlyCicilan()
        setLoans(getAllLoansWithMembers())
        return results
    }

    function handleSchedulerChange(newConfig) {
        saveSchedulerConfig(newConfig)
        setScheduler(newConfig)
    }

    const chartData = monthlyReports.map((r) => ({
        label: MONTH_NAMES[r.month - 1],
        value: r.simpananMasuk + r.cicilanDiterima,
    }))

    useEffect(() => {
        function initScheduler() {
            const resultsCicilan = checkAndRunScheduler()
            const resultsWajib = checkAndRunSchedulerWajib()

            const needRefreshLoans = resultsCicilan?.length > 0
            const needRefreshStats = resultsWajib?.length > 0

            if (needRefreshLoans) {
                setLoans(getAllLoansWithMembers())
            }

            if (needRefreshLoans || needRefreshStats) {
                setStats(getTreasurerStats())
            }
        }

        initScheduler()
    }, [])

    function handleWajibProcess() {
        const results = processSimapananWajib()
        setStats(getTreasurerStats())
        return results
    }

    function handleSchedulerWajibChange(newConfig) {
        saveSchedulerWajibConfig(newConfig)
        setSchedulerWajib(newConfig)
    }

    const thisMonthReport = monthlyReports[monthlyReports.length - 1]

    return (
        <DashboardLayout
            title="Dashboard Bendahara"
            subtitle="Kelola keuangan dan laporan koperasi"
            navItems={BendaharaNavbar}
        >
            {/* ── Stat Cards ── */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Kas"
                    value={formatCurrency(stats.totalKas)}
                    subtitle="Saldo tersedia"
                    icon={IconCash}
                    accent="primary"
                />
                <StatCard
                    title="Total Simpanan"
                    value={formatCurrency(stats.totalSimpanan)}
                    subtitle={`${stats.totalAnggotaAktif} anggota aktif`}
                    icon={IconWallet}
                    accent="success"
                />
                <StatCard
                    title="Outstanding Pinjaman"
                    value={formatCurrency(stats.totalSisaPinjaman)}
                    subtitle={`${stats.totalPinjamanAktif} pinjaman aktif`}
                    icon={IconLoan}
                    accent="accent"
                />
                <StatCard
                    title="Est. Bunga Bulan Ini"
                    value={formatCurrency(stats.estimasiBungaBulanIni)}
                    subtitle="Pendapatan bunga"
                    icon={IconChart}
                    accent="warning"
                />
            </div>

            <PanelCicilan
                loans={loans}
                onManualProcess={handleManualProcess}
                onSchedulerChange={handleSchedulerChange}
                scheduler={scheduler}
            />

            <PanelSimpananWajib
                totalAnggotaAktif={stats.totalAnggotaAktif}
                onManualProcess={handleWajibProcess}
                onSchedulerChange={handleSchedulerWajibChange}
                scheduler={schedulerWajib}
            />

            {/* ── Baris Tengah: Ringkasan Simpanan + Chart ── */}
            <div className="mt-5 grid gap-5 lg:grid-cols-3">

                {/* Komposisi Simpanan */}
                <Card>
                    <h3 className="font-medium text-text-primary">Komposisi Simpanan</h3>
                    <p className="mt-0.5 text-xs text-text-muted">Rincian per jenis</p>
                    <div className="mt-5 space-y-4">
                        {[
                            { label: 'Simpanan Pokok', value: stats.totalSimpananPokok, color: 'bg-primary' },
                            { label: 'Simpanan Wajib', value: stats.totalSimpananWajib, color: 'bg-accent' },
                            { label: 'Simpanan Sukarela', value: stats.totalSimpananSukarela, color: 'bg-success' },
                        ].map((item) => {
                            const pct = stats.totalSimpanan > 0 ? (item.value / stats.totalSimpanan) * 100 : 0
                            return (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm text-text-muted">{item.label}</span>
                                        <span className="text-sm font-medium text-text-primary">{formatCurrency(item.value)}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.color} transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-text-muted">{pct.toFixed(1)}% dari total</p>
                                </div>
                            )
                        })}
                    </div>
                </Card>

                {/* Pemasukan 6 Bulan Terakhir */}
                <Card className="lg:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-text-primary">Pemasukan 6 Bulan Terakhir</h3>
                            <p className="mt-0.5 text-xs text-text-muted">Simpanan masuk + cicilan diterima</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-xs text-text-muted">Bulan ini</p>
                            <p className="text-base font-medium text-accent">
                                {formatCurrency(thisMonthReport.simpananMasuk + thisMonthReport.cicilanDiterima)}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <MiniBarChart data={chartData} />
                    </div>

                    {/* Rincian bulan ini */}
                    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
                        {[
                            { label: 'Simpanan Masuk', value: thisMonthReport.simpananMasuk },
                            { label: 'Cicilan Diterima', value: thisMonthReport.cicilanDiterima },
                            { label: 'Bunga Diterima', value: thisMonthReport.bungaDiterima },
                        ].map((item) => (
                            <div key={item.label} className="rounded-xl bg-surface px-3 py-2.5">
                                <p className="text-xs text-text-muted leading-snug">{item.label}</p>
                                <p className="mt-1 text-sm font-medium text-text-primary">{formatCurrency(item.value)}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ── Baris Bawah: Transaksi Simpanan + Status Pinjaman ── */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">

                {/* Transaksi Simpanan Terbaru */}
                <Card>
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="font-medium text-text-primary">Transaksi Simpanan Terbaru</h3>
                        <Link to="/bendahara/simpanan" className="ds-link">Lihat semua →</Link>
                    </div>
                    {savingsTx.length === 0 ? (
                        <p className="mt-5 text-sm text-text-muted">Belum ada transaksi</p>
                    ) : (
                        <ul className="mt-4 divide-y divide-gray-100">
                            {savingsTx.map((tx) => (
                                <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-medium text-text-primary truncate">{tx.memberName}</p>
                                            <SavingsTypeBadge type={tx.type} />
                                        </div>
                                        <p className="text-xs text-text-muted mt-0.5">{tx.description} · {formatDate(tx.date)}</p>
                                    </div>
                                    <p className="text-sm font-medium text-success shrink-0">
                                        +{formatCurrency(tx.amount)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                {/* Status Pinjaman Aktif */}
                <Card>
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="font-medium text-text-primary">Pinjaman Aktif</h3>
                        <Link to="/bendahara/pinjaman" className="ds-link">Kelola →</Link>
                    </div>
                    {loans.length === 0 ? (
                        <p className="mt-5 text-sm text-text-muted">Tidak ada pinjaman aktif</p>
                    ) : (
                        <ul className="mt-4 divide-y divide-gray-100">
                            {loans.map((loan) => (
                                <li key={loan.id} className="py-3.5">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-text-primary">{loan.memberName}</p>
                                            <p className="text-xs text-text-muted">{loan.purpose}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-medium text-text-primary">{formatCurrency(loan.remaining)}</p>
                                            <p className="text-xs text-text-muted">sisa dari {formatCurrency(loan.amount)}</p>
                                        </div>
                                    </div>
                                    <LoanProgressBar amount={loan.amount} remaining={loan.remaining} />
                                    <div className="flex items-center justify-between mt-1.5">
                                        <p className="text-xs text-text-muted">
                                            Cicilan/bln: <span className="text-text-primary">{formatCurrency(loan.monthlyPayment)}</span>
                                        </p>
                                        <Badge status={loan.status} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

            </div>
        </DashboardLayout>
    )
}