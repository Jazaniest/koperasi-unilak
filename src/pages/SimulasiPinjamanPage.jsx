import { useState, useMemo } from 'react'
import {
    BanknotesIcon,
    ClockIcon,
    ChartBarIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Card } from '../components/ui/Card'
import { formatCurrency } from '../utils/format'

// ─── Data tabel angsuran (sesuai dokumen resmi) ──────────────────
// key: plafon dalam rupiah, value: { tenor_bulan: angsuran_per_bulan }
// null = tidak tersedia untuk plafon tersebut
const TABEL = [
    {
        plafon: 2_500_000,
        angsuran: { 12: 238_333, 18: 168_889, 24: 134_167, 30: null, 36: null, 42: null, 48: null, 54: null, 60: null },
    },
    {
        plafon: 5_000_000,
        angsuran: { 12: 476_667, 18: 337_778, 24: 268_333, 30: null, 36: null, 42: null, 48: null, 54: null, 60: null },
    },
    {
        plafon: 7_500_000,
        angsuran: { 12: 715_000, 18: 506_667, 24: 402_500, 30: null, 36: null, 42: null, 48: null, 54: null, 60: null },
    },
    {
        plafon: 10_000_000,
        angsuran: { 12: 953_333, 18: 675_556, 24: 536_667, 30: null, 36: null, 42: null, 48: null, 54: null, 60: null },
    },
    {
        plafon: 15_000_000,
        angsuran: { 12: 1_430_000, 18: 1_013_333, 24: 805_000, 30: 680_000, 36: 596_667, 42: null, 48: null, 54: null, 60: null },
    },
    {
        plafon: 20_000_000,
        angsuran: { 12: 1_906_667, 18: 1_351_111, 24: 1_073_333, 30: 906_667, 36: 795_556, 42: null, 48: null, 54: null, 60: null },
    },
    {
        plafon: 25_000_000,
        angsuran: { 12: 2_383_333, 18: 1_688_889, 24: 1_341_667, 30: 1_133_333, 36: 994_444, 42: 895_238, 48: 820_833, 54: 762_963, 60: 716_667 },
    },
    {
        plafon: 30_000_000,
        angsuran: { 12: 2_860_000, 18: 2_026_667, 24: 1_610_000, 30: 1_360_000, 36: 1_193_333, 42: 1_074_286, 48: 985_000, 54: 915_556, 60: 860_000 },
    },
    {
        plafon: 35_000_000,
        angsuran: { 12: 3_336_667, 18: 2_364_444, 24: 1_878_333, 30: 1_586_667, 36: 1_392_222, 42: 1_253_333, 48: 1_149_167, 54: 1_068_148, 60: 1_003_333 },
    },
    {
        plafon: 40_000_000,
        angsuran: { 12: 3_813_333, 18: 2_702_222, 24: 2_146_667, 30: 1_813_333, 36: 1_591_111, 42: 1_432_381, 48: 1_313_333, 54: 1_220_741, 60: 1_146_667 },
    },
    {
        plafon: 45_000_000,
        angsuran: { 12: 4_290_000, 18: 3_040_000, 24: 2_415_000, 30: 2_040_000, 36: 1_790_000, 42: 1_611_429, 48: 1_477_500, 54: 1_373_333, 60: 1_290_000 },
    },
    {
        plafon: 50_000_000,
        angsuran: { 12: 4_766_667, 18: 3_377_778, 24: 2_683_333, 30: 2_266_667, 36: 1_988_889, 42: 1_790_476, 48: 1_641_667, 54: 1_525_926, 60: 1_433_333 },
    },
]

const TENORS = [12, 18, 24, 30, 36, 42, 48, 54, 60]

function formatRibuan(n) {
    if (!n) return '—'
    return new Intl.NumberFormat('id-ID').format(n)
}

// ─── Kalkulator: cari angsuran terdekat dari plafon & tenor ──────
function cariAngsuran(plafon, tenor) {
    // Cari baris terdekat (plafon ke atas)
    const row = TABEL.find((r) => r.plafon >= plafon) ?? TABEL[TABEL.length - 1]
    // Jika tenor tidak tersedia di baris itu, ambil tenor terdekat yang ada
    if (row.angsuran[tenor] !== null) {
        return { angsuran: row.angsuran[tenor], plafonRef: row.plafon }
    }
    return { angsuran: null, plafonRef: row.plafon }
}

// Hitung bunga implisit dari tabel (bunga flat)
function hitungDetail(plafon, tenor) {
    const { angsuran, plafonRef } = cariAngsuran(plafon, tenor)
    if (!angsuran) return null
    const totalBayar = angsuran * tenor
    const totalBunga = totalBayar - plafon
    const bungaPerBulan = (totalBunga / plafon / tenor) * 100
    return {
        angsuranPerBulan: angsuran,
        totalBayar,
        totalBunga,
        bungaPerBulanPct: bungaPerBulan,
        plafonRef,
    }
}

// Buat jadwal angsuran bulanan
function buatJadwal(plafon, tenor, angsuranPerBulan) {
    let sisa = plafon
    const pokokPerBulan = plafon / tenor
    const bungaPerBulan = angsuranPerBulan - pokokPerBulan
    return Array.from({ length: tenor }, (_, i) => {
        const pokok = Math.round(pokokPerBulan)
        const bunga = Math.round(bungaPerBulan)
        sisa = Math.max(0, sisa - pokok)
        return { bulan: i + 1, pokok, bunga, angsuran: angsuranPerBulan, sisa }
    })
}

const infoCards = [
    { icon: <BanknotesIcon className="w-6 h-6 text-primary" />, label: "Plafon Tersedia", value: "Rp 2,5 Jt – Rp 50 Jt" },
    { icon: <ClockIcon className="w-6 h-6 text-primary" />, label: "Tenor Maksimal", value: "60 Bulan" },
    { icon: <ChartBarIcon className="w-6 h-6 text-primary" />, label: "Sistem Bunga", value: "Flat per Bulan" },
    { icon: <CalendarDaysIcon className="w-6 h-6 text-primary" />, label: "Berlaku", value: "Tahun 2025–2031" },
]

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-surface-card border border-border rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-300">
        <div>{icon}</div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-text-primary leading-snug">{value}</p>
    </div>
)

export function SimulasiPinjamanPage() {
    const [plafon, setPlafon] = useState(10_000_000)
    const [tenor, setTenor] = useState(12)
    const [showJadwal, setShowJadwal] = useState(false)
    //eslint-disable-next-line
    const [highlightCell, setHighlightCell] = useState(null) // { plafonIdx, tenor }

    const plafonOptions = TABEL.map((r) => r.plafon)

    // Cek apakah tenor tersedia untuk plafon yang dipilih
    const rowDipilih = TABEL.find((r) => r.plafon === plafon)
    //eslint-disable-next-line
    const tenorTersedia = TENORS.filter((t) => rowDipilih?.angsuran[t] !== null)

    //eslint-disable-next-line
    const detail = useMemo(() => hitungDetail(plafon, tenor), [plafon, tenor])
    const jadwal = useMemo(
        () => (detail ? buatJadwal(plafon, tenor, detail.angsuranPerBulan) : []),
        [plafon, tenor, detail],
    )

    const handleTenorChange = (t) => {
        setTenor(t)
        setShowJadwal(false)
    }

    const handlePlafonChange = (p) => {
        setPlafon(p)
        // Reset tenor jika tidak tersedia di plafon baru
        const row = TABEL.find((r) => r.plafon === p)
        if (row && row.angsuran[tenor] === null) {
            const tersedia = TENORS.find((t) => row.angsuran[t] !== null)
            if (tersedia) setTenor(tersedia)
        }
        setShowJadwal(false)
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />

            {/* ── Header ──────────────────────────────────────────────── */}
            <header className="bg-surface-card border-b border-border py-12 px-6 text-center shadow-sm">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-widest">
                    Layanan Pinjaman
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    Simulasi Pinjaman
                </h1>
                <p className="mt-2 text-base text-text-muted max-w-xl mx-auto">
                    Hitung estimasi angsuran pinjaman sesuai tabel resmi Koperasi Karyawan dan Dosen
                    Universitas Lancang Kuning tahun 2025–2031.
                </p>
            </header>

            <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14 space-y-10">

                {/* ── Kalkulator ──────────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                    {infoCards.map((card, i) => (
                        <InfoCard key={i} {...card} />
                    ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-2 space-y-5">

                        {/* Input plafon */}
                        <Card>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-4">
                                Plafon Pinjaman
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {plafonOptions.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => handlePlafonChange(p)}
                                        className={`rounded-xl px-3 py-2 text-sm font-medium transition ${plafon === p
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'border border-gray-200 bg-surface text-text-muted hover:bg-gray-50 hover:text-text-primary'
                                            }`}
                                    >
                                        {formatCurrency(p)}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Input tenor */}
                        <Card>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-4">
                                Jangka Waktu
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                                {TENORS.map((t) => {
                                    const tersedia = rowDipilih?.angsuran[t] !== null
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            disabled={!tersedia}
                                            onClick={() => handleTenorChange(t)}
                                            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${!tersedia
                                                ? 'cursor-not-allowed border border-gray-100 bg-surface text-gray-300'
                                                : tenor === t
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'border border-gray-200 bg-surface text-text-muted hover:bg-gray-50 hover:text-text-primary'
                                                }`}
                                        >
                                            {t} bln
                                        </button>
                                    )
                                })}
                            </div>
                            <p className="mt-3 text-xs text-text-muted">
                                Tenor abu-abu tidak tersedia untuk plafon yang dipilih.
                            </p>
                        </Card>
                    </div>

                    {/* Hasil simulasi */}
                    <div className="lg:col-span-3 space-y-5">
                        {detail ? (
                            <>
                                <Card highlight>
                                    <p className="ds-label">Angsuran per Bulan</p>
                                    <p className="ds-display-value mt-2 text-primary text-2xl sm:text-3xl wrap-break-words">
                                        {formatCurrency(detail.angsuranPerBulan)}
                                    </p>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Berdasarkan tabel resmi plafon {formatCurrency(detail.plafonRef)}
                                    </p>
                                </Card>

                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <p className="ds-label">Total Bayar</p>
                                        <p className="ds-display-value mt-2 text-text-primary">
                                            {formatCurrency(detail.totalBayar)}
                                        </p>
                                    </Card>
                                    <Card>
                                        <p className="ds-label">Total Bunga</p>
                                        <p className="ds-display-value mt-2 text-warning">
                                            {formatCurrency(detail.totalBunga)}
                                        </p>
                                    </Card>
                                    <Card>
                                        <p className="ds-label">Bunga Flat/Bulan</p>
                                        <p className="ds-display-value mt-2 text-text-primary">
                                            {detail.bungaPerBulanPct.toFixed(2)}%
                                        </p>
                                    </Card>
                                    <Card>
                                        <p className="ds-label">Tenor</p>
                                        <p className="ds-display-value mt-2 text-text-primary">
                                            {tenor} bulan
                                        </p>
                                    </Card>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowJadwal((v) => !v)}
                                    className="w-full rounded-xl border border-primary/20 bg-primary/8 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/12"
                                >
                                    {showJadwal ? 'Sembunyikan' : 'Lihat'} Jadwal Angsuran Lengkap
                                </button>
                            </>
                        ) : (
                            <Card className="py-12 text-center text-text-muted">
                                Tenor tidak tersedia untuk plafon ini.
                            </Card>
                        )}
                    </div>
                </div>

                {/* ── Jadwal angsuran ──────────────────────────────────────── */}
                {showJadwal && jadwal.length > 0 && (
                    <Card>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="font-medium text-text-primary">Jadwal Angsuran</h3>
                                <p className="mt-0.5 text-sm text-text-muted">
                                    {formatCurrency(plafon)} — {tenor} bulan
                                </p>
                            </div>
                            <span className="rounded-xl border border-gray-100 bg-surface px-3 py-1 text-xs text-text-muted">
                                {tenor} cicilan
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm" style={{ minWidth: 480 }}>
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 text-left text-[11px] sm:text-xs font-medium text-text-muted whitespace-nowrap px-2">Bulan</th>
                                        <th className="pb-3 text-right text-[11px] sm:text-xs font-medium text-text-muted whitespace-nowrap px-2">Pokok</th>
                                        <th className="pb-3 text-right text-[11px] sm:text-xs font-medium text-text-muted whitespace-nowrap px-2">Bunga</th>
                                        <th className="pb-3 text-right text-[11px] sm:text-xs font-medium text-text-muted whitespace-nowrap px-2">Angsuran</th>
                                        <th className="pb-3 text-right text-[11px] sm:text-xs font-medium text-text-muted whitespace-nowrap px-2">Sisa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {jadwal.map((row) => (
                                        <tr key={row.bulan}>
                                            <td className="py-2.5 text-text-muted text-xs sm:text-sm whitespace-nowrap px-2">Bulan {row.bulan}</td>
                                            <td className="py-2.5 text-right text-text-primary text-xs sm:text-sm whitespace-nowrap px-2">{formatCurrency(row.pokok)}</td>
                                            <td className="py-2.5 text-right text-warning text-xs sm:text-sm whitespace-nowrap px-2">{formatCurrency(row.bunga)}</td>
                                            <td className="py-2.5 text-right font-medium text-text-primary text-xs sm:text-sm whitespace-nowrap px-2">
                                                {formatCurrency(row.angsuran)}
                                            </td>
                                            <td className="py-2.5 text-right text-text-muted text-xs sm:text-sm whitespace-nowrap px-2">
                                                {row.sisa === 0 ? (
                                                    <span className="text-success font-medium">Lunas</span>
                                                ) : (
                                                    formatCurrency(row.sisa)
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* ── Tabel referensi ─────────────────────────────────────── */}
                <Card>
                    <div className="mb-5">
                        <h2 className="font-medium text-text-primary">
                            Tabel Angsuran Pinjaman Resmi
                        </h2>
                        <p className="mt-1 text-sm text-text-muted">
                            Koperasi Karyawan dan Dosen Universitas Lancang Kuning · Tahun 2025–2031 · 1–5 Tahun
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" style={{ minWidth: 700 }}>
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th
                                        className="pb-3 pr-4 text-left text-xs font-medium text-text-muted"
                                        rowSpan={2}
                                    >
                                        Plafon
                                    </th>
                                    <th
                                        colSpan={9}
                                        className="pb-2 text-center text-xs font-medium text-text-muted border-b border-gray-100"
                                    >
                                        Jangka Waktu (Bulan)
                                    </th>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    {TENORS.map((t) => (
                                        <th
                                            key={t}
                                            className="pb-3 text-center text-[10px] sm:text-xs font-medium text-text-muted px-1 sm:px-2"
                                        >
                                            {t}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {TABEL.map((row) => (
                                    <tr
                                        key={row.plafon}
                                        className={plafon === row.plafon ? 'bg-primary/4' : ''}
                                    >
                                        <td className="py-3 pr-4 font-medium text-text-primary whitespace-nowrap">
                                            {formatCurrency(row.plafon)}
                                        </td>
                                        {TENORS.map((t) => {
                                            const val = row.angsuran[t]
                                            const isActive = plafon === row.plafon && tenor === t
                                            return (
                                                <td
                                                    key={t}
                                                    onClick={() => {
                                                        if (val) {
                                                            handlePlafonChange(row.plafon)
                                                            handleTenorChange(t)
                                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                                        }
                                                    }}
                                                    className={`py-2.5 sm:py-3 text-center px-1 sm:px-2 text-[10px] sm:text-xs whitespace-nowrap transition ${val
                                                        ? isActive
                                                            ? 'rounded-lg bg-primary text-white font-medium cursor-pointer'
                                                            : 'text-text-primary cursor-pointer hover:bg-primary/8 hover:text-primary rounded-lg'
                                                        : 'text-gray-200 select-none'
                                                        }`}
                                                >
                                                    {val ? formatRibuan(val) : '—'}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-text-muted">
                        Klik sel pada tabel untuk langsung menggunakan nilai tersebut pada kalkulator di atas. Angka pada tabel adalah angsuran per bulan dalam rupiah.
                    </p>
                </Card>

            </div>

            <div className="flex-1" />
            <Footer />
        </div>
    )
}