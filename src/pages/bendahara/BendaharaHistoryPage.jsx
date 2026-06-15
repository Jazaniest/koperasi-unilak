import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { getTransactionHistory, getYearlyReport } from '../../services/treasureService'
import { formatCurrency } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'

const MONTH_NAMES_FULL = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const KOPERASI_NAME = 'KOPERASI KARYAWAN (KOPKAR) DAN DOSEN'
const KOPERASI_SUB = 'UNIVERSITAS LANCANG KUNING'

//eslint-disable-next-line
function TabelGabungan({ data, year, month }) {
    if (!data?.rows?.length) return (
        <p className="text-sm text-text-muted py-4">Tidak ada data transaksi bulan ini.</p>
    )

    const fmt = (n) => n > 0 ? Number(n).toLocaleString('id-ID') : '—'

    const totals = data.rows.reduce((acc, r) => ({
        loanAmount: acc.loanAmount + r.loanAmount,
        piutangAwal: acc.piutangAwal + r.piutangAwal,
        simpananWajib: acc.simpananWajib + r.simpananWajib,
        angsuranPokok: acc.angsuranPokok + r.angsuranPokok,
        jasa: acc.jasa + r.jasa,
        jumlahPotongan: acc.jumlahPotongan + r.jumlahPotongan,
        piutangAkhir: acc.piutangAkhir + r.piutangAkhir,
    }), {
        loanAmount: 0, piutangAwal: 0, simpananWajib: 0,
        angsuranPokok: 0, jasa: 0, jumlahPotongan: 0, piutangAkhir: 0,
    })

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-275">
                <thead>
                    <tr className="bg-primary text-white">
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center w-8">NO</th>
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center min-w-35">N A M A</th>
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center w-16">No<br />Anggota</th>
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center">Besar<br />Pinjaman</th>
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center">Piutang<br />Awal {MONTH_NAMES_FULL[month - 1].slice(0, 3)}</th>
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center w-10">Pekerjaan</th>
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center">Simpanan<br />Wajib</th>
                        <th colSpan={4} className="border border-primary/40 px-2 py-1.5 text-center bg-primary-light">Potongan Pinjaman</th>
                        {/* <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center">Angsuran<br />Ke</th> */}
                        <th rowSpan={2} className="border border-primary/40 px-2 py-2 text-center">Piutang<br />Akhir {MONTH_NAMES_FULL[month - 1].slice(0, 3)}</th>
                    </tr>
                    <tr className="bg-primary-light text-white text-center">
                        <th className="border border-primary/40 px-2 py-1.5">Angsuran<br />Pokok</th>
                        <th className="border border-primary/40 px-2 py-1.5">Jasa</th>
                        <th className="border border-primary/40 px-2 py-1.5">Jumlah<br />Potongan</th>
                        <th className="border border-primary/40 px-2 py-1.5">Angsuran<br />Ke</th>
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row, i) => {
                        const isTopUp = row.isTopUp
                        const noPinjaman = !row.hasPinjaman

                        // Style khusus baris top up
                        const topUpCellClass = isTopUp
                            ? 'bg-accent/10 text-accent font-semibold'
                            : ''

                        return (
                            <tr key={row.memberId}
                                className={i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                                <td className="border border-gray-200 px-2 py-1.5 text-center">{i + 1}</td>
                                <td className="border border-gray-200 px-2 py-1.5 font-medium">
                                    {row.memberName}
                                </td>
                                <td className="border border-gray-200 px-2 py-1.5 text-center">{row.memberNumber}</td>

                                {/* Besar Pinjaman */}
                                <td className={`border border-gray-200 px-2 py-1.5 text-right ${noPinjaman ? 'text-text-muted' : ''}`}>
                                    {noPinjaman ? '—' : fmt(row.loanAmount)}
                                </td>

                                {/* Piutang Awal */}
                                <td className={`border border-gray-200 px-2 py-1.5 text-right ${topUpCellClass} ${noPinjaman ? 'text-text-muted' : ''}`}>
                                    {noPinjaman ? '—' : fmt(row.piutangAwal)}
                                </td>

                                {/* Pekerjaan */}
                                <td className="border border-gray-200 px-2 py-1.5 text-center text-text-muted">
                                    {row.occupation ?? '—'}
                                </td>

                                {/* Simpanan Wajib */}
                                <td className="border border-gray-200 px-2 py-1.5 text-right text-success font-medium">
                                    {row.simpananWajib > 0 ? fmt(row.simpananWajib) : '—'}
                                </td>

                                {/* Angsuran Pokok */}
                                <td className={`border border-gray-200 px-2 py-1.5 text-right ${noPinjaman ? 'text-text-muted' : ''}`}>
                                    {noPinjaman ? '—' : isTopUp ? (
                                        <span className="inline-flex flex-col items-end gap-0.5">
                                            <span className="text-[9px] font-bold bg-accent text-white px-1.5 py-0.5 rounded-full leading-none">TOP UP</span>
                                            <span className="text-accent font-semibold">{fmt(row.angsuranPokok)}</span>
                                        </span>
                                    ) : fmt(row.angsuranPokok)}
                                </td>

                                {/* Jasa */}
                                <td className={`border border-gray-200 px-2 py-1.5 text-right ${noPinjaman ? 'text-text-muted' : ''}`}>
                                    {noPinjaman ? '—' : isTopUp ? (
                                        <span className="text-accent font-semibold">{fmt(row.jasa)}</span>
                                    ) : fmt(row.jasa)}
                                </td>

                                {/* Jumlah Potongan */}
                                <td className="border border-gray-200 px-2 py-1.5 text-right font-semibold">
                                    {row.jumlahPotongan > 0 ? (
                                        isTopUp ? (
                                            <span className="text-accent">{fmt(row.jumlahPotongan)}</span>
                                        ) : fmt(row.jumlahPotongan)
                                    ) : '—'}
                                </td>

                                {/* Angsuran Ke */}
                                <td className={`border border-gray-200 px-2 py-1.5 text-center ${noPinjaman ? 'text-text-muted' : ''}`}>
                                    {noPinjaman ? '—' : isTopUp ? (
                                        <span className="text-accent font-semibold">{row.angsuranKe} / {row.tenorMonths}</span>
                                    ) : `${row.angsuranKe} / ${row.tenorMonths}`}
                                </td>

                                {/* Piutang Akhir */}
                                <td className={`border border-gray-200 px-2 py-1.5 text-right font-semibold ${noPinjaman ? 'text-text-muted' : isTopUp ? 'text-accent' : 'text-danger'}`}>
                                    {noPinjaman ? '—' : fmt(row.piutangAkhir)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-primary/10 font-bold text-xs">
                        <td colSpan={3} className="border border-gray-200 px-2 py-2 text-right">TOTAL</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{fmt(totals.loanAmount)}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{fmt(totals.piutangAwal)}</td>
                        <td className="border border-gray-200 px-2 py-2"></td>
                        <td className="border border-gray-200 px-2 py-2 text-right text-success">{fmt(totals.simpananWajib)}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{fmt(totals.angsuranPokok)}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{fmt(totals.jasa)}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{fmt(totals.jumlahPotongan)}</td>
                        <td className="border border-gray-200 px-2 py-2"></td>
                        <td className="border border-gray-200 px-2 py-2 text-right text-danger">{fmt(totals.piutangAkhir)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

// ── Tabel Laporan Tahunan ─────────────────────────────────────────────────────
function TabelTahunan({ data }) {
    if (!data) return null

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
                <thead>
                    <tr className="bg-primary text-white">
                        <th className="border border-primary px-2 py-2 text-center w-8">NO</th>
                        <th className="border border-primary px-2 py-2">BULAN</th>
                        <th className="border border-primary px-2 py-2 text-right">Simpanan Masuk</th>
                        <th className="border border-primary px-2 py-2 text-right">Cicilan Diterima</th>
                        <th className="border border-primary px-2 py-2 text-right">Bunga Diterima</th>
                        <th className="border border-primary px-2 py-2 text-right">Total Pemasukan</th>
                    </tr>
                </thead>
                <tbody>
                    {data.months.map((r, i) => (
                        <tr key={r.month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-200 px-2 py-1.5 text-center">{i + 1}</td>
                            <td className="border border-gray-200 px-2 py-1.5 font-medium">{MONTH_NAMES_FULL[r.month - 1]}</td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right">{formatCurrency(r.simpananMasuk).replace('Rp\u00a0', '')}</td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right">{formatCurrency(r.cicilanDiterima).replace('Rp\u00a0', '')}</td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right">{formatCurrency(r.bungaDiterima).replace('Rp\u00a0', '')}</td>
                            <td className="border border-gray-200 px-2 py-1.5 text-right font-semibold text-primary">{formatCurrency(r.totalPemasukan).replace('Rp\u00a0', '')}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-primary/10 font-bold">
                        <td colSpan={2} className="border border-gray-200 px-2 py-2 text-right">TOTAL {data.year}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{formatCurrency(data.totals.simpananMasuk).replace('Rp\u00a0', '')}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{formatCurrency(data.totals.cicilanDiterima).replace('Rp\u00a0', '')}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{formatCurrency(data.totals.bungaDiterima).replace('Rp\u00a0', '')}</td>
                        <td className="border border-gray-200 px-2 py-2 text-right">{formatCurrency(data.totals.totalPemasukan).replace('Rp\u00a0', '')}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

// ── Export Print ──────────────────────────────────────────────────────────────
function handlePrint(elementId) {
    const el = document.getElementById(elementId)
    if (!el) return
    const w = window.open('', '_blank')
    w.document.write(`
        <html><head>
        <title>Laporan Koperasi</title>
        <style>
            body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; }
            h2,h3,h4 { text-align: center; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #999; padding: 4px 6px; }
            th { background: #dbeafe; }
            tfoot td { font-weight: bold; background: #eff6ff; }
            .section { margin-top: 24px; }
            @media print { button { display: none; } }
        </style>
        </head><body>
        ${el.innerHTML}
        <br/><button onclick="window.print()">Print</button>
        </body></html>
    `)
    w.document.close()
    setTimeout(() => w.print(), 400)
}

// ── Halaman Utama ─────────────────────────────────────────────────────────────
export function BendaharaHistoryPage() {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const [mode, setMode] = useState('bulanan')   // 'bulanan' | 'tahunan'
    const [year, setYear] = useState(currentYear)
    const [month, setMonth] = useState(currentMonth)
    const [loading, setLoading] = useState(false)

    const [monthlyData, setMonthlyData] = useState(null)
    const [yearlyData, setYearlyData] = useState(null)

    // const [activeTab, setActiveTab] = useState('cicilan') // 'cicilan' | 'simpanan' | 'topup'

    useEffect(() => {
        let cancelled = false

        async function loadData() {
            setLoading(true)

            try {
                if (mode === 'bulanan') {
                    const data = await getTransactionHistory(year, month)

                    if (!cancelled) {
                        setMonthlyData(data)
                    }
                } else {
                    const data = await getYearlyReport(year)

                    if (!cancelled) {
                        setYearlyData(data)
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadData()

        return () => {
            cancelled = true
        }
    }, [mode, year, month])



    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)
    const printId = mode === 'bulanan' ? 'print-bulanan' : 'print-tahunan'

    // const tabConfig = [
    //     { key: 'cicilan', label: 'Angsuran Pinjaman', count: monthlyData?.cicilan?.length ?? 0 },
    //     { key: 'simpanan', label: 'Simpanan', count: monthlyData?.simpanan?.length ?? 0 },
    //     { key: 'topup', label: 'Top Up', count: monthlyData?.topup?.length ?? 0 },
    // ]

    return (
        <DashboardLayout
            title="Riwayat & Laporan"
            subtitle="Rekap transaksi bulanan dan tahunan koperasi"
            navItems={BendaharaNavbar}
        >
            {/* ── Kontrol Filter ── */}
            <Card className="mb-6">
                <div className="flex flex-wrap gap-3 items-end">
                    {/* Mode */}
                    <div>
                        <p className="text-xs text-text-muted mb-1.5">Periode</p>
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                            {['bulanan', 'tahunan'].map((m) => (
                                <button key={m} type="button"
                                    onClick={() => setMode(m)}
                                    className={`px-4 py-2 text-sm font-medium transition capitalize ${mode === m
                                        ? 'bg-primary text-white'
                                        : 'bg-surface-card text-text-muted hover:bg-surface'}`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tahun */}
                    <div>
                        <p className="text-xs text-text-muted mb-1.5">Tahun</p>
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))}
                            className="rounded-xl border border-gray-200 bg-surface-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                            {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    {/* Bulan (hanya mode bulanan) */}
                    {mode === 'bulanan' && (
                        <div>
                            <p className="text-xs text-text-muted mb-1.5">Bulan</p>
                            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                                className="rounded-xl border border-gray-200 bg-surface-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                                {MONTH_NAMES_FULL.map((n, i) => (
                                    <option key={i + 1} value={i + 1}>{n}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Tombol Export */}
                    <button type="button" onClick={() => handlePrint(printId)}
                        className="ml-auto rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-light transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                        </svg>
                        Export / Print
                    </button>
                </div>
            </Card>

            {loading ? (
                <Card className="py-16 text-center text-text-muted">Memuat data...</Card>
            ) : (
                <>
                    {/* ── MODE BULANAN ── */}
                    {mode === 'bulanan' && monthlyData && (
                        <>
                            <Card>
                                <h3 className="font-medium text-text-primary mb-4">
                                    Buku Besar Angsuran — {MONTH_NAMES_FULL[month - 1]} {year}
                                </h3>
                                <TabelGabungan data={monthlyData} year={year} month={month} />
                            </Card>

                            {/* Konten tersembunyi untuk print */}
                            <div id="print-bulanan" className="hidden">
                                <h2>{KOPERASI_NAME}</h2>
                                <h3>{KOPERASI_SUB}</h3>
                                <h3>BUKU BESAR ANGSURAN PINJAMAN</h3>
                                <h4>{MONTH_NAMES_FULL[month - 1].toUpperCase()} {year}</h4>
                                <TabelGabungan data={monthlyData} year={year} month={month} />
                            </div>
                        </>
                    )}

                    {/* ── MODE TAHUNAN ── */}
                    {mode === 'tahunan' && yearlyData && (
                        <>
                            <Card>
                                <h3 className="font-medium text-text-primary mb-4">
                                    Rekap Laporan Tahunan — {year}
                                </h3>
                                <TabelTahunan data={yearlyData} />
                            </Card>

                            {/* Konten tersembunyi untuk print */}
                            <div id="print-tahunan" className="hidden">
                                <h2>{KOPERASI_NAME}</h2>
                                <h3>{KOPERASI_SUB}</h3>
                                <h3>LAPORAN KEUANGAN TAHUNAN</h3>
                                <h4>TAHUN {year}</h4>
                                <TabelTahunan data={yearlyData} />
                            </div>
                        </>
                    )}
                </>
            )}
        </DashboardLayout>
    )
}