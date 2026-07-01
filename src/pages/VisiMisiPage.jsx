import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import {
    EyeIcon,
    RocketLaunchIcon,
    ScaleIcon,
    BookOpenIcon,
    StarIcon,
    UserGroupIcon,
    HeartIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline'

// ─── DATA ────────────────────────────────────────────────────────────
const visi = `Menjadikan Koperasi Karyawan dan Dosen Universitas Lancang Kuning sebagai
Badan Usaha Koperasi yang dipercaya oleh anggota-anggotanya, mitra kerja,
dan masyarakat yang berinteraksi dengannya.`

const misi = `Meningkatkan kesejahteraan anggota melalui pengembangan dan pemantapan
usaha/bisnis secara profesional dengan mengikutsertakan potensi ekonomi
anggota, mitra usaha, dan atau masyarakat.`

const nilaiUtama = [
    {
        icon: ScaleIcon,
        title: 'Pancasila & UUD 1945',
        desc: 'Seluruh kegiatan koperasi berlandaskan Pancasila dan Undang-Undang Dasar 1945 sebagai fondasi utama.',
    },
    {
        icon: BookOpenIcon,
        title: 'Kepatuhan Hukum',
        desc: 'Mematuhi Undang-Undang Perkoperasian dan seluruh peraturan pemerintah yang berlaku dan terkait.',
    },
    {
        icon: StarIcon,
        title: 'Integritas & Profesionalisme',
        desc: 'Menjunjung tinggi nilai integritas, kejujuran, etika bisnis, dan profesionalisme dalam setiap tindakan.',
    },
    {
        icon: UserGroupIcon,
        title: 'Anggota sebagai Utama',
        desc: 'Menempatkan anggota sebagai potensi utama koperasi yang menjadi pusat dari setiap kebijakan dan layanan.',
    },
    {
        icon: HeartIcon,
        title: 'Peduli Lingkungan',
        desc: 'Peduli terhadap masyarakat dan lingkungan sekitar sebagai wujud tanggung jawab sosial koperasi.',
    },
]

const moto = 'Dari Anggota, Untuk Anggota dan Kesejahteraan Anggota'

// ─── NILAI CARD ──────────────────────────────────────────────────────
const NilaiCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-surface-card border border-border rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{desc}</p>
        </div>
    </div>
)

// ─── PAGE ────────────────────────────────────────────────────────────
export function VisiMisiPage() {
    return (
        <div className="min-h-screen bg-surface flex flex-col text-text-primary font-sans">
            <Navbar />

            {/* HEADER */}
            <header className="bg-surface-card border-b border-border py-12 px-6 text-center shadow-sm">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-widest">
                    Tentang Kami
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    Visi &amp; Misi
                </h1>
                <p className="mt-2 text-base text-text-muted max-w-xl mx-auto">
                    Landasan arah dan tujuan Koperasi Karyawan dan Dosen Universitas Lancang Kuning
                    dalam melayani seluruh anggotanya.
                </p>
            </header>

            <main className="flex-1 py-14 px-4 max-w-5xl mx-auto w-full">

                {/* ── VISI & MISI ──────────────────────────────────────── */}
                <div className="grid lg:grid-cols-2 gap-6 mb-14">

                    {/* Visi */}
                    <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <EyeIcon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full">
                                Visi
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 self-stretch rounded-full bg-primary/30 shrink-0" />
                            <p className="text-sm leading-relaxed text-text-primary">{visi}</p>
                        </div>
                    </div>

                    {/* Misi */}
                    <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <RocketLaunchIcon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full">
                                Misi
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 self-stretch rounded-full bg-primary/30 shrink-0" />
                            <p className="text-sm leading-relaxed text-text-primary">{misi}</p>
                        </div>
                    </div>

                </div>

                {/* ── NILAI-NILAI ───────────────────────────────────────── */}
                <div className="mb-14">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-6">
                        Nilai-Nilai
                    </span>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {nilaiUtama.map((n) => (
                            <NilaiCard key={n.title} {...n} />
                        ))}
                    </div>
                </div>

                {/* ── MOTO ─────────────────────────────────────────────── */}
                <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-6">
                        Moto
                    </span>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <SparklesIcon className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-lg font-bold text-primary tracking-wide leading-snug">
                            "{moto}"
                        </p>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    )
}