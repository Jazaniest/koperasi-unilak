import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Card } from '../components/ui/Card'
import { IconWallet, IconUsers, IconFile } from '../components/ui/Icons'

const visi = `Menjadi koperasi simpan pinjam yang terpercaya, modern, dan berdaya saing
tinggi dalam melayani kebutuhan keuangan seluruh sivitas akademika
Universitas Lancang Kuning secara transparan dan profesional.`

const misi = [
    'Memberikan layanan simpan pinjam yang mudah, cepat, dan terjangkau bagi seluruh anggota.',
    'Mengelola keuangan koperasi secara transparan, akuntabel, dan sesuai prinsip koperasi.',
    'Meningkatkan kesejahteraan anggota melalui program simpanan dan pembiayaan yang kompetitif.',
    'Mengembangkan sistem manajemen digital yang memudahkan anggota mengakses layanan kapan saja.',
    'Membangun sumber daya manusia pengurus yang profesional, berintegritas, dan berkomitmen.',
    'Mendorong partisipasi aktif anggota dalam pengembangan dan pengawasan koperasi.',
]

const nilaiUtama = [
    {
        icon: IconUsers,
        title: 'Kekeluargaan',
        desc: 'Membangun hubungan yang harmonis antara pengurus dan anggota berdasarkan asas kekeluargaan dan gotong royong.',
    },
    {
        icon: IconWallet,
        title: 'Amanah',
        desc: 'Mengelola setiap titipan dan kepercayaan anggota dengan penuh tanggung jawab dan kejujuran.',
    },
    {
        icon: IconFile,
        title: 'Transparansi',
        desc: 'Menyajikan laporan keuangan dan operasional secara terbuka agar dapat diawasi oleh seluruh anggota.',
    },
]

export function VisiMisiPage() {
    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />

            {/* ── Header ──────────────────────────────────────────────── */}
            <section className="border-b border-gray-100 bg-surface-card">
                <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
                    <span className="inline-block rounded-xl bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                        Tentang Kami
                    </span>
                    <h1 className="mt-4 text-3xl font-medium text-text-primary sm:text-4xl">
                        Visi &amp; Misi
                    </h1>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-text-muted">
                        Landasan arah dan tujuan Koperasi Unilak dalam melayani sivitas akademika
                        Universitas Lancang Kuning.
                    </p>
                </div>
            </section>

            <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14 space-y-10">

                {/* ── Visi ──────────────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted pt-1">Visi</p>
                    </div>
                    <Card className="lg:col-span-4">
                        <div className="flex gap-4">
                            <div className="mt-1 h-1 w-8 shrink-0 rounded-full bg-primary" />
                            <p className="text-base leading-relaxed text-text-primary">{visi}</p>
                        </div>
                    </Card>
                </div>

                {/* ── Misi ──────────────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted pt-1">Misi</p>
                    </div>
                    <Card className="lg:col-span-4">
                        <ol className="space-y-4">
                            {misi.map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-xs font-medium text-primary">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm leading-relaxed text-text-primary pt-0.5">{item}</p>
                                </li>
                            ))}
                        </ol>
                    </Card>
                </div>

                {/* ── Nilai Utama ───────────────────────────────────────── */}
                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted pt-1">Nilai Utama</p>
                    </div>
                    <div className="lg:col-span-4 grid gap-5 sm:grid-cols-3">
                        {nilaiUtama.map((n) => (
                            <Card key={n.title} className="flex flex-col gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                                    <n.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-primary">{n.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{n.desc}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>

            <div className="flex-1" />
            <Footer />
        </div>
    )
}