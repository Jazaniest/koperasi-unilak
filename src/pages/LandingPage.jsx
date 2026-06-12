import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Card, StatCard } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { IconUsers, IconWallet, IconLoan } from '../components/ui/Icons'
import { formatCurrency } from '../utils/format'

// ─── Dummy data ───────────────────────────────────────────────────
const dummyStats = {
    totalMembers: 312,
    activeMembers: 287,
    totalSavings: 4_875_600_000,
    totalLoans: 2_340_000_000,
}

const dummyAngsuran = [
    {
        id: 'ANG-001',
        memberName: 'Ahmad Fauzi',
        memberNumber: 'KU-2021-0045',
        pinjaman: 10_000_000,
        angsuranPerBulan: 916_667,
        sisaBulan: 6,
        jatuhTempo: '2025-07-05',
        status: 'active',
    },
    {
        id: 'ANG-002',
        memberName: 'Siti Rahayu',
        memberNumber: 'KU-2020-0118',
        pinjaman: 5_000_000,
        angsuranPerBulan: 458_333,
        sisaBulan: 3,
        jatuhTempo: '2025-04-10',
        status: 'active',
    },
    {
        id: 'ANG-003',
        memberName: 'Budi Santoso',
        memberNumber: 'KU-2022-0033',
        pinjaman: 15_000_000,
        angsuranPerBulan: 1_375_000,
        sisaBulan: 9,
        jatuhTempo: '2025-10-15',
        status: 'active',
    },
    {
        id: 'ANG-004',
        memberName: 'Dewi Pertiwi',
        memberNumber: 'KU-2021-0207',
        pinjaman: 8_000_000,
        angsuranPerBulan: 733_333,
        sisaBulan: 0,
        jatuhTempo: '2025-01-20',
        status: 'completed',
    },
    {
        id: 'ANG-005',
        memberName: 'Rudi Hermawan',
        memberNumber: 'KU-2023-0009',
        pinjaman: 20_000_000,
        angsuranPerBulan: 1_833_333,
        sisaBulan: 11,
        jatuhTempo: '2025-12-01',
        status: 'active',
    },
]

const features = [
    {
        icon: IconUsers,
        title: 'Keanggotaan Terbuka',
        desc: 'Seluruh sivitas akademika Unilak — dosen, karyawan, dan mahasiswa — dapat mendaftar menjadi anggota dengan mudah.',
    },
    {
        icon: IconWallet,
        title: 'Simpanan Fleksibel',
        desc: 'Kelola simpanan pokok, wajib, dan sukarela dalam satu platform yang transparan dan dapat dipantau kapan saja.',
    },
    {
        icon: IconLoan,
        title: 'Pinjaman Terjangkau',
        desc: 'Proses pengajuan pinjaman yang cepat dan bunga kompetitif untuk memenuhi berbagai kebutuhan finansial anggota.',
    },
]
// ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function LandingPage() {
    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="border-b border-gray-100 bg-surface-card">
                <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
                    <div className="max-w-2xl">
                        <span className="inline-block rounded-xl bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                            Koperasi Simpan Pinjam
                        </span>
                        <h1 className="mt-4 text-3xl font-medium leading-snug text-text-primary sm:text-4xl lg:text-5xl">
                            Kelola Keuangan Anda<br />
                            <span className="text-primary">Bersama KoperasiUnilak</span>
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
                            Platform manajemen koperasi digital untuk sivitas akademika Universitas Lancang Kuning.
                            Transparan, amanah, dan profesional.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="/login"
                                className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
                            >
                                Masuk ke Akun
                            </a>
                            <a
                                href="/visi-misi"
                                className="inline-flex items-center rounded-xl border border-gray-200 bg-surface-card px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface"
                            >
                                Pelajari Lebih Lanjut
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ───────────────────────────────────────────────── */}
            <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
                <div className="grid gap-5 sm:grid-cols-3">
                    <StatCard
                        title="Total Anggota"
                        value={dummyStats.totalMembers}
                        subtitle={`${dummyStats.activeMembers} anggota aktif`}
                        icon={IconUsers}
                        accent="primary"
                    />
                    <StatCard
                        title="Saldo Simpanan Aktif"
                        value={formatCurrency(dummyStats.totalSavings)}
                        subtitle="Dana simpanan anggota"
                        icon={IconWallet}
                        accent="success"
                    />
                    <StatCard
                        title="Saldo Pinjaman Aktif"
                        value={formatCurrency(dummyStats.totalLoans)}
                        subtitle="Total pinjaman berjalan"
                        icon={IconLoan}
                        accent="accent"
                    />
                </div>
            </section>

            {/* ── Features ────────────────────────────────────────────── */}
            <section className="mx-auto w-full max-w-6xl px-6 pb-10 sm:pb-14">
                <div className="grid gap-5 sm:grid-cols-3">
                    {features.map((f) => (
                        <Card key={f.title} className="flex flex-col gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                                <f.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium text-text-primary">{f.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{f.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ── Tabel Angsuran ──────────────────────────────────────── */}
            <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:pb-20">
                <Card>
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-medium text-text-primary">Tabel Angsuran Berjalan</h2>
                            <p className="mt-0.5 text-sm text-text-muted">Rekap jadwal angsuran pinjaman anggota aktif</p>
                        </div>
                        <span className="rounded-xl bg-surface px-3 py-1 text-xs font-medium text-text-muted border border-gray-100">
                            {dummyAngsuran.filter((a) => a.status === 'active').length} aktif
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 text-left text-xs font-medium text-text-muted">Anggota</th>
                                    <th className="pb-3 text-right text-xs font-medium text-text-muted">Jumlah Pinjaman</th>
                                    <th className="pb-3 text-right text-xs font-medium text-text-muted">Angsuran/Bulan</th>
                                    <th className="pb-3 text-right text-xs font-medium text-text-muted">Sisa Bulan</th>
                                    <th className="pb-3 text-right text-xs font-medium text-text-muted">Jatuh Tempo</th>
                                    <th className="pb-3 text-right text-xs font-medium text-text-muted">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {dummyAngsuran.map((row) => (
                                    <tr key={row.id} className="group">
                                        <td className="py-3.5">
                                            <p className="font-medium text-text-primary">{row.memberName}</p>
                                            <p className="text-xs text-text-muted">{row.memberNumber}</p>
                                        </td>
                                        <td className="py-3.5 text-right font-medium text-text-primary">
                                            {formatCurrency(row.pinjaman)}
                                        </td>
                                        <td className="py-3.5 text-right text-text-primary">
                                            {formatCurrency(row.angsuranPerBulan)}
                                        </td>
                                        <td className="py-3.5 text-right">
                                            <span
                                                className={`font-medium ${row.sisaBulan === 0
                                                        ? 'text-success'
                                                        : row.sisaBulan <= 3
                                                            ? 'text-warning'
                                                            : 'text-text-primary'
                                                    }`}
                                            >
                                                {row.sisaBulan === 0 ? 'Lunas' : `${row.sisaBulan} bulan`}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-right text-text-muted">
                                            {formatDate(row.jatuhTempo)}
                                        </td>
                                        <td className="py-3.5 text-right">
                                            <Badge status={row.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            <div className="flex-1" />
            <Footer />
        </div>
    )
}