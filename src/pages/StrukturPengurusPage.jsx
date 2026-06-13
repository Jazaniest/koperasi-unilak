import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Card } from '../components/ui/Card'
// import { Badge } from '../../components/ui/Badge'

// ─── Dummy data ───────────────────────────────────────────────────
const pengurus = [
    {
        jabatan: 'Ketua',
        kelompok: 'Pengurus',
        name: 'Dr. H. Rasyid Asyari, S.E., M.M.',
        nip: '196803121994031003',
        unit: 'Fakultas Ekonomi',
        periode: '2023 – 2026',
        initials: 'RA',
    },
    {
        jabatan: 'Sekretaris',
        kelompok: 'Pengurus',
        name: 'Hj. Novia Hartati, S.E., M.Si.',
        nip: '197204251998032001',
        unit: 'Biro Keuangan',
        periode: '2023 – 2026',
        initials: 'NH',
    },
    {
        jabatan: 'Bendahara',
        kelompok: 'Pengurus',
        name: 'Drs. Syahrul Ramadhan, M.Ak.',
        nip: '196901151993011002',
        unit: 'Biro Keuangan',
        periode: '2023 – 2026',
        initials: 'SR',
    },
]

const pengawas = [
    {
        jabatan: 'Ketua Pengawas',
        kelompok: 'Pengawas',
        name: 'Prof. Dr. Junaidi, M.Pd.',
        nip: '196505201990031004',
        unit: 'Rektorat',
        periode: '2023 – 2026',
        initials: 'JU',
    },
    {
        jabatan: 'Anggota Pengawas',
        kelompok: 'Pengawas',
        name: 'Ir. Rina Susanti, M.T.',
        nip: '197708142003122005',
        unit: 'Fakultas Teknik',
        periode: '2023 – 2026',
        initials: 'RS',
    },
    {
        jabatan: 'Anggota Pengawas',
        kelompok: 'Pengawas',
        name: 'Dra. Mulyaningsih, M.Hum.',
        nip: '196812091995032002',
        unit: 'Fakultas Hukum',
        periode: '2023 – 2026',
        initials: 'MU',
    },
]

const pengelola = [
    {
        jabatan: 'Manajer Simpan Pinjam',
        kelompok: 'Pengelola',
        name: 'Fitri Wulandari, S.E.',
        nip: '198903042015042001',
        unit: 'Koperasi',
        periode: '2023 – kini',
        initials: 'FW',
    },
    {
        jabatan: 'Staf Administrasi',
        kelompok: 'Pengelola',
        name: 'Agus Prasetyo, A.Md.',
        nip: '199205172019031003',
        unit: 'Koperasi',
        periode: '2023 – kini',
        initials: 'AP',
    },
    {
        jabatan: 'Staf IT & Sistem',
        kelompok: 'Pengelola',
        name: 'Bayu Eka Nugraha, S.Kom.',
        nip: '199407282020121001',
        unit: 'Koperasi',
        periode: '2023 – kini',
        initials: 'BE',
    },
]

const kelompokConfig = {
    Pengurus: { accent: 'bg-primary/8 text-primary', border: 'border-primary/20' },
    Pengawas: { accent: 'bg-success/10 text-success', border: 'border-success/20' },
    Pengelola: { accent: 'bg-warning/10 text-warning', border: 'border-warning/20' },
}

function PersonCard({ person }) {
    const cfg = kelompokConfig[person.kelompok]
    return (
        <Card className={`flex flex-col gap-4`}>
            <div className="flex items-start gap-4">
                <div className="ds-avatar h-12 w-12 shrink-0 text-sm">{person.initials}</div>
                <div className="min-w-0 flex-1">
                    <span className={`inline-block rounded-lg px-2.5 py-0.5 text-xs font-medium ${cfg.accent}`}>
                        {person.jabatan}
                    </span>
                    <p className="mt-1.5 font-medium leading-snug text-text-primary">{person.name}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{person.unit}</p>
                </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs">
                <div>
                    <dt className="text-text-muted">NIP</dt>
                    <dd className="mt-0.5 font-medium text-text-primary">{person.nip}</dd>
                </div>
                <div>
                    <dt className="text-text-muted">Periode</dt>
                    <dd className="mt-0.5 font-medium text-text-primary">{person.periode}</dd>
                </div>
            </dl>
        </Card>
    )
}

function Section({ title, subtitle, data }) {
    return (
        <section>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-lg font-medium text-text-primary">{title}</h2>
                    {subtitle && <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>}
                </div>
                <span className="rounded-xl border border-gray-100 bg-surface px-3 py-1 text-xs font-medium text-text-muted">
                    {data.length} orang
                </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((p) => (
                    <PersonCard key={p.nip} person={p} />
                ))}
            </div>
        </section>
    )
}

export function StrukturPengurusPage() {
    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />

            {/* ── Header ──────────────────────────────────────────────── */}
            <section className="border-b border-gray-100 bg-surface-card">
                <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
                    <span className="inline-block rounded-xl bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                        Organisasi
                    </span>
                    <h1 className="mt-4 text-3xl font-medium text-text-primary sm:text-4xl">
                        Struktur Pengurus
                    </h1>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-text-muted">
                        Susunan pengurus, pengawas, dan pengelola Koperasi Unilak periode 2023 – 2026.
                    </p>
                </div>
            </section>

            {/* ── Konten ──────────────────────────────────────────────── */}
            <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14 space-y-14">
                <Section
                    title="Pengurus"
                    subtitle="Bertanggung jawab atas pengelolaan koperasi secara umum"
                    data={pengurus}
                />
                <Section
                    title="Pengawas"
                    subtitle="Melakukan pengawasan dan audit terhadap jalannya koperasi"
                    data={pengawas}
                />
                <Section
                    title="Pengelola"
                    subtitle="Pelaksana operasional harian koperasi"
                    data={pengelola}
                />
            </div>

            <div className="flex-1" />
            <Footer />
        </div>
    )
}