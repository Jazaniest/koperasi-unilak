import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { getAllMembers, getMemberById } from '../../services/memberService'
import { SAVINGS_TYPE_LABELS } from '../../services/savingsService'
import { formatCurrency, formatDate } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'

const KOPERASI_NAME = 'KOPERASI KARYAWAN (KOPKAR) DAN DOSEN'
const KOPERASI_SUB = 'UNIVERSITAS LANCANG KUNING'

function handlePrint(elementId) {
    const el = document.getElementById(elementId)
    if (!el) return
    const w = window.open('', '_blank')
    w.document.write(`
        <html><head>
        <title>Daftar Anggota Koperasi</title>
        <style>
            body { font-family: Arial, sans-serif; font-size: 11px; padding: 20px; }
            h2, h3, h4 { text-align: center; margin: 4px 0; }
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

function TabelAnggota({ members }) {
    if (!members?.length) return null

    // const fmt = (n) => Number(n).toLocaleString('id-ID')

    // const totalSavings = members.reduce((acc, m) => acc + (m.totalSavings ?? 0), 0)
    // const totalLoan = members.reduce((acc, m) => acc + (m.totalLoanRemaining ?? 0), 0)

    return (
        <div className="section">
            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center', width: '30px' }}>NO</th>
                        <th style={{ textAlign: 'center' }}>No. Anggota</th>
                        <th style={{ textAlign: 'center' }}>Nama</th>
                        <th style={{ textAlign: 'center' }}>NIK</th>
                        <th style={{ textAlign: 'center' }}>Email</th>
                        <th style={{ textAlign: 'center' }}>Telepon</th>
                        <th style={{ textAlign: 'center' }}>Pekerjaan</th>
                        <th style={{ textAlign: 'center' }}>Bergabung</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        {/* <th style={{ textAlign: 'right' }}>Total Simpanan</th>
                        <th style={{ textAlign: 'right' }}>Sisa Pinjaman</th> */}
                    </tr>
                </thead>
                <tbody>
                    {members.map((m, i) => (
                        <tr key={m.id}>
                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                            <td style={{ textAlign: 'center' }}>{m.memberNumber}</td>
                            <td>{m.name}</td>
                            <td style={{ textAlign: 'center' }}>{m.nik}</td>
                            <td>{m.email}</td>
                            <td style={{ textAlign: 'center' }}>{m.phone}</td>
                            <td>{m.occupation}</td>
                            <td style={{ textAlign: 'center' }}>{formatDate(m.joinDate)}</td>
                            <td style={{ textAlign: 'center' }}>{m.status}</td>
                            {/* <td style={{ textAlign: 'right' }}>{fmt(m.totalSavings ?? 0)}</td>
                            <td style={{ textAlign: 'right' }}>{fmt(m.totalLoanRemaining ?? 0)}</td> */}
                        </tr>
                    ))}
                </tbody>
                {/* <tfoot>
                    <tr>
                        <td colSpan={9} style={{ textAlign: 'right' }}>TOTAL</td>
                        <td style={{ textAlign: 'right' }}>{fmt(totalSavings)}</td>
                        <td style={{ textAlign: 'right' }}>{fmt(totalLoan)}</td>
                    </tr>
                </tfoot> */}
            </table>
        </div>
    )
}

function TabelSimpanan({ members }) {
    const rows = members.flatMap((m) =>
        (m.savings ?? []).map((s) => ({ ...s, memberName: m.name, memberNumber: m.memberNumber }))
    )
    if (!rows.length) return null

    const fmt = (n) => Number(n).toLocaleString('id-ID')
    const total = rows.reduce((acc, s) => acc + (s.amount ?? 0), 0)

    return (
        <div className="section" style={{ marginTop: '32px' }}>
            <h4 style={{ textAlign: 'left', marginBottom: '4px' }}>Rincian Simpanan</h4>
            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center', width: '30px' }}>NO</th>
                        <th style={{ textAlign: 'center' }}>No. Anggota</th>
                        <th>Nama</th>
                        <th>Jenis Simpanan</th>
                        <th>Keterangan</th>
                        <th style={{ textAlign: 'right' }}>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((s, i) => (
                        <tr key={s.id ?? i}>
                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                            <td style={{ textAlign: 'center' }}>{s.memberNumber}</td>
                            <td>{s.memberName}</td>
                            <td>{SAVINGS_TYPE_LABELS[s.type] ?? s.type}</td>
                            <td>{s.description}</td>
                            <td style={{ textAlign: 'right' }}>{fmt(s.amount)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'right' }}>TOTAL SIMPANAN</td>
                        <td style={{ textAlign: 'right' }}>{fmt(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

function TabelPinjaman({ members }) {
    const rows = members.flatMap((m) =>
        (m.loans ?? []).map((l) => ({ ...l, memberName: m.name, memberNumber: m.memberNumber }))
    )
    if (!rows.length) return null

    const fmt = (n) => Number(n).toLocaleString('id-ID')
    const totalAmount = rows.reduce((acc, l) => acc + (l.amount ?? 0), 0)
    const totalRemaining = rows.reduce((acc, l) => acc + (l.remaining ?? 0), 0)

    return (
        <div className="section" style={{ marginTop: '32px' }}>
            <h4 style={{ textAlign: 'left', marginBottom: '4px' }}>Rincian Pinjaman</h4>
            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center', width: '30px' }}>NO</th>
                        <th style={{ textAlign: 'center' }}>No. Anggota</th>
                        <th>Nama</th>
                        <th>Tujuan</th>
                        <th style={{ textAlign: 'right' }}>Jumlah Pinjaman</th>
                        <th style={{ textAlign: 'right' }}>Sisa</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        <th style={{ textAlign: 'center' }}>Tanggal Lunas</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((l, i) => (
                        <tr key={l.id ?? i}>
                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                            <td style={{ textAlign: 'center' }}>{l.memberNumber}</td>
                            <td>{l.memberName}</td>
                            <td>{l.purpose}</td>
                            <td style={{ textAlign: 'right' }}>{fmt(l.amount)}</td>
                            <td style={{ textAlign: 'right' }}>{fmt(l.remaining)}</td>
                            <td style={{ textAlign: 'center' }}>{l.status}</td>
                            <td style={{ textAlign: 'center' }}>{l.settledAt ? formatDate(l.settledAt) : '—'}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} style={{ textAlign: 'right' }}>TOTAL</td>
                        <td style={{ textAlign: 'right' }}>{fmt(totalAmount)}</td>
                        <td style={{ textAlign: 'right' }}>{fmt(totalRemaining)}</td>
                        <td colSpan={2}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export function BendaharaMembersPage() {
    const [search, setSearch] = useState('')
    const [members, setMembers] = useState([])
    const [exporting, setExporting] = useState(false)
    const [printMembers, setPrintMembers] = useState([])

    useEffect(() => {
        getAllMembers().then(setMembers)
    }, [])

    const filtered = members.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.memberNumber.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()),
    )

    async function handleExport() {
        setExporting(true)
        try {
            const details = await Promise.all(members.map((m) => getMemberById(m.id)))
            setPrintMembers(details)
            // Tunggu DOM update sebelum print
            setTimeout(() => handlePrint('print-anggota'), 100)
        } finally {
            setExporting(false)
        }
    }

    const printDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    })

    return (
        <DashboardLayout title="Daftar Anggota" subtitle={`${members.length} anggota terdaftar`} navItems={BendaharaNavbar}>
            <Card className="mb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <Input
                            placeholder="Cari nama, no. anggota, atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={exporting || members.length === 0}
                        className="shrink-0 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-light transition flex items-center gap-2 disabled:opacity-60"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                        </svg>
                        {exporting ? 'Menyiapkan...' : 'Export / Print'}
                    </button>
                </div>
            </Card>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((member) => (
                    <Link key={member.id} to={`/bendahara/anggota/${member.id}`}>
                        <Card className="h-full transition hover:border-primary/20 hover:shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div className="ds-avatar h-12 w-12 text-sm">
                                    {member.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join('')}
                                </div>
                                <Badge status={member.status} />
                            </div>
                            <h3 className="mt-4 font-medium text-text-primary">{member.name}</h3>
                            <p className="text-sm text-text-muted">{member.memberNumber}</p>
                            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                                <div className="rounded-xl border border-gray-100 bg-surface px-3 py-2.5">
                                    <p className="text-text-muted">Simpanan</p>
                                    <p className="mt-1 font-medium text-success">{formatCurrency(member.totalSavings)}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-surface px-3 py-2.5">
                                    <p className="text-text-muted">Pinjaman</p>
                                    <p className="mt-1 font-medium text-primary">{formatCurrency(member.totalLoanRemaining)}</p>
                                </div>
                            </div>
                            {member.pendingApplications > 0 && (
                                <p className="mt-4 text-xs font-medium text-warning">
                                    {member.pendingApplications} pengajuan pending
                                </p>
                            )}
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Konten tersembunyi untuk print */}
            {printMembers.length > 0 && (
                <div id="print-anggota" className="hidden">
                    <h2>{KOPERASI_NAME}</h2>
                    <h3>{KOPERASI_SUB}</h3>
                    <h3>DAFTAR ANGGOTA KOPERASI</h3>
                    <h4>Per Tanggal: {printDate}</h4>
                    <TabelAnggota members={printMembers} />
                    <TabelSimpanan members={printMembers} />
                    <TabelPinjaman members={printMembers} />
                </div>
            )}
        </DashboardLayout>
    )
}