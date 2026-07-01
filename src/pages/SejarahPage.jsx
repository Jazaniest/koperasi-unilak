import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
    DocumentTextIcon,
    CalendarDaysIcon,
    BuildingLibraryIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';

// ─── DATA ────────────────────────────────────────────────────────────
const milestones = [
    {
        tahun: "1989",
        judul: "Pendirian Koperasi",
        deskripsi:
            "Koperasi Karyawan dan Dosen (Kopkar) Unilak resmi berdiri pada 23 November 1989, dengan badan hukum Nomor 1252a/BH/XII/1989.",
    },
    {
        tahun: "1989",
        judul: "Modal Awal",
        deskripsi:
            "Koperasi didirikan dari simpanan pokok sebesar Rp 5.000 dan simpanan wajib Rp 100.000 per bulan yang dipotong langsung dari gaji anggota.",
    },
    {
        tahun: "2015",
        judul: "Penyesuaian Iuran",
        deskripsi:
            "Simpanan pokok bagi anggota baru disesuaikan menjadi Rp 100.000, sementara simpanan wajib tetap Rp 100.000 per bulan hingga saat ini.",
    },
    {
        tahun: "Kini",
        judul: "7 Periode Pengurus",
        deskripsi:
            "Kopkar Unilak telah melewati 7 kali pergantian pengurus dan terus berkembang melayani seluruh Karyawan dan Dosen Universitas Lancang Kuning.",
    },
];

const infoCards = [
    {
        icon: <DocumentTextIcon className="w-6 h-6 text-primary" />,
        label: "Badan Hukum",
        value: "1252a/BH/XII/1989",
    },
    {
        icon: <CalendarDaysIcon className="w-6 h-6 text-primary" />,
        label: "Berdiri",
        value: "23 November 1989",
    },
    {
        icon: <BuildingLibraryIcon className="w-6 h-6 text-primary" />,
        label: "Bidang Usaha",
        value: "Simpan Pinjam",
    },
    {
        icon: <UsersIcon className="w-6 h-6 text-primary" />,
        label: "Anggota",
        value: "Karyawan & Dosen Unilak",
    },
];

// ─── INFO CARD ───────────────────────────────────────────────────────
const InfoCard = ({ icon, label, value }) => (
    <div className="bg-surface-card border border-border rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-300">
        <div>{icon}</div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-text-primary leading-snug">{value}</p>
    </div>
);

// ─── TIMELINE ITEM ───────────────────────────────────────────────────
const TimelineItem = ({ tahun, judul, deskripsi, isLast }) => (
    <div className="flex gap-5">
        {/* Garis & titik */}
        <div className="flex flex-col items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>
            {!isLast && <div className="w-px flex-1 bg-primary/20 mt-1" />}
        </div>

        {/* Konten */}
        <div className={`flex-1 pb-10 ${isLast ? 'pb-0' : ''}`}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-2">
                {tahun}
            </span>
            <h3 className="text-base font-bold text-text-primary mb-1">{judul}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{deskripsi}</p>
        </div>
    </div>
);

// ─── PAGE ────────────────────────────────────────────────────────────
export function SejarahPage() {
    return (
        <div className="min-h-screen bg-surface flex flex-col text-text-primary font-sans">
            <Navbar />

            {/* HEADER */}
            <header className="bg-surface-card border-b border-border py-12 px-6 text-center shadow-sm">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-widest">
                    Tentang Kami
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    Sejarah Koperasi
                </h1>
                <p className="mt-2 text-base text-text-muted max-w-xl mx-auto">
                    Koperasi Karyawan dan Dosen Universitas Lancang Kuning
                </p>
            </header>

            <main className="flex-1 py-14 px-4 max-w-5xl mx-auto w-full">

                {/* ── INFO CARDS ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
                    {infoCards.map((card, i) => (
                        <InfoCard key={i} {...card} />
                    ))}
                </div>

                {/* ── KONTEN UTAMA ─────────────────────────────────────── */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Narasi */}
                    <div>
                        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-5">
                            Latar Belakang
                        </span>

                        <div className="space-y-4 text-sm text-text-muted leading-relaxed">
                            <p>
                                Kopkar Unilak merupakan salah satu koperasi di Provinsi Riau yang bergerak
                                di bidang <span className="font-semibold text-text-primary">simpan pinjam</span>.
                                Koperasi ini bersifat konvensional dengan anggota terdiri dari seluruh
                                Karyawan dan Dosen Universitas Lancang Kuning.
                            </p>
                            <p>
                                Koperasi didirikan dengan modal yang bersumber dari simpanan wajib dan
                                simpanan pokok anggota. Simpanan pokok hanya dibayar satu kali di awal
                                keanggotaan, sedangkan simpanan wajib dipotong otomatis setiap bulan
                                langsung dari gaji.
                            </p>
                            <p>
                                Sistem potongan gaji ini dijalankan melalui kerja sama langsung dengan
                                Bendahara Universitas, sehingga tidak ada penunggakan dari anggota koperasi
                                dan operasional tetap berjalan lancar.
                            </p>
                        </div>

                        
                    </div>

                    {/* Timeline */}
                    <div>
                        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-5">
                            Perjalanan
                        </span>
                        <div>
                            {milestones.map((item, i) => (
                                <TimelineItem
                                    key={i}
                                    {...item}
                                    isLast={i === milestones.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}