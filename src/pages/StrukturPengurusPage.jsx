import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// ─── DATA STRUKTUR ───────────────────────────────────────────────────
const dataStruktur = {
    pimpinan: {
        ketua: { nama: "Ir. Hamdan Yasid, M.P.", jabatan: "Ketua Koperasi", foto: "ketua.jpg", role: "pimpinan" },
        wakilKetua: { nama: "Khairunnas, S.P., M.Si.", jabatan: "Wakil Ketua", foto: "waka.jpg", role: "pimpinan" },
    },
    administrasi: {
        sekretaris: { nama: "Wahyudi Ariadi, S.Kom., M.M.", jabatan: "Sekretaris", foto: "sekretaris.jpg", role: "admin" },
        wakilSekretaris: { nama: "Cici Triningsih, S.P., М.Р.", jabatan: "Wakil Sekretaris", foto: "wasekre.jpg", role: "admin" },
        bendahara: { nama: "Anang Cahyono Ardi, S.P.", jabatan: "Bendahara", foto: "bendahara.jpg", role: "admin" },
    },
    bidang: [
        {
            namaBidang: "Bidang Kerja Sama / Bisnis",
            ketua: { nama: "Dr. Amalia, S.P., М.М.", jabatan: "Ketua Bidang KS / Bisnis", foto: "ketuabidangksb.jpg", role: "bidang" },
            anggota: [
                { nama: "Liviawati, S.E., M.Si, Ak.", jabatan: "Anggota", foto: "anggotaksb1.jpg" },
                { nama: "Elly Nelwaty, S.Sos, M.M.", jabatan: "Anggota", foto: "anggotaksb2.jpg" },
                { nama: "Diana, S.Sos.", jabatan: "Anggota", foto: "anggotaksb3.jpg" },
                { nama: "Eko Saputra Utama, S.IP., M.M.", jabatan: "Anggota", foto: "anggotaksb4.jpg" },
            ],
        },
        {
            namaBidang: "Bidang Humas / Sosial",
            ketua: { nama: "Supriadi, M.Kom", jabatan: "Ketua Bidang Humas / Sosial", foto: "ketuabidanghs.jpg", role: "bidang" },
            anggota: [
                { nama: "Sindi Theresia, S.Pd.", jabatan: "Anggota", foto: "anggotahs1.jpg" },
                { nama: "Bunga Apriliani, S.Kom., M.M.", jabatan: "Anggota", foto: "anggotahs2.jpg" },
                { nama: "Sri Wahyuni, S.E.", jabatan: "Anggota", foto: "anggotahs3.jpg" },
            ],
        },
    ],
};

// ─── THEME PER ROLE ──────────────────────────────────────────────────
const getTheme = (role) => {
    switch (role) {
        case 'pimpinan':
            return {
                accent: 'bg-primary',
                border: 'border-primary',
                badgeBg: 'bg-primary/10',
                badgeText: 'text-primary',
            };
        case 'admin':
            return {
                accent: 'bg-primary-light',
                border: 'border-primary-light',
                badgeBg: 'bg-primary-light/10',
                badgeText: 'text-primary-light',
            };
        case 'bidang':
        default:
            return {
                accent: 'bg-primary-light',
                border: 'border-primary-light',
                badgeBg: 'bg-primary-light/10',
                badgeText: 'text-primary-light',
            };
    }
};

// ─── AVATAR FALLBACK URL ─────────────────────────────────────────────
const avatarFallback = (nama, bg = '1e3a5f') =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${bg}&color=ffffff&font-size=0.35&bold=true`;

// ─── ORG CARD ────────────────────────────────────────────────────────
const OrgCard = ({ person, compact = false }) => {
    const theme = getTheme(person.role);
    return (
        <div className={`relative bg-surface-card rounded-2xl border border-border overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 ${compact ? 'p-3' : 'p-4'}`}>
            {/* Top accent bar */}
            <div className={`absolute top-0 inset-x-0 h-1.5 ${theme.accent}`} />

            {/* Avatar */}
            <div className={`${compact ? 'w-14 h-14' : 'w-20 h-20'} rounded-full overflow-hidden border-2 ${theme.border} mt-2 mb-3 shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                <img
                    src={`/images/struktur/${person.foto}`}
                    alt={person.nama}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.target.src = avatarFallback(person.nama); }}
                />
            </div>

            {/* Badge jabatan */}
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
                {person.jabatan}
            </span>

            {/* Nama */}
            <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-text-primary mt-2 leading-snug px-1`}>
                {person.nama}
            </p>
        </div>
    );
};

// ─── ANGGOTA ROW CARD ────────────────────────────────────────────────
const AnggotaCard = ({ person }) => (
    <div className="flex items-center gap-3 bg-surface-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
        <img
            src={`/images/struktur/${person.foto}`}
            alt={person.nama}
            className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
            onError={(e) => { e.target.src = avatarFallback(person.nama); }}
        />
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Anggota</p>
            <p className="text-xs font-semibold text-text-primary leading-snug mt-0.5 truncate">{person.nama}</p>
        </div>
    </div>
);

// ─── CONNECTOR: vertical line ────────────────────────────────────────
const LineV = ({ height = 'h-8', color = 'bg-primary/20' }) => (
    <div className={`w-px ${height} ${color} mx-auto`} />
);

// ─── SECTION LABEL (mobile) ──────────────────────────────────────────
const SectionLabel = ({ children, color = 'border-primary text-primary' }) => (
    <h2 className={`text-[11px] font-bold uppercase tracking-widest pl-3 border-l-4 ${color} mb-3`}>
        {children}
    </h2>
);

// ─── PAGE ────────────────────────────────────────────────────────────
export function StrukturPengurusPage() {
    const { pimpinan, administrasi, bidang } = dataStruktur;

    return (
        <div className="min-h-screen bg-surface flex flex-col text-text-primary font-sans">
            <Navbar />

            {/* HEADER */}
            <header className="bg-surface-card border-b border-border py-12 px-6 text-center shadow-sm">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-widest">
                    Manajemen Koperasi
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                    Struktur Organisasi
                </h1>
                <p className="mt-2 text-base text-text-muted max-w-xl mx-auto">
                    Susunan Pengurus & Bidang Kerja Koperasi Unilak · Periode 2026 - 2031
                </p>
            </header>

            <main className="flex-1 py-14 px-4 max-w-6xl mx-auto w-full">

                {/* ══════════════════════════════════════════════════════ */}
                {/* DESKTOP TREE (lg+)                                     */}
                {/* ══════════════════════════════════════════════════════ */}
                <div className="hidden lg:flex flex-col items-center w-full">

                    {/* L1 — Ketua */}
                    <div className="w-48">
                        <OrgCard person={pimpinan.ketua} />
                    </div>

                    <LineV height="h-8" />

                    {/* L2 — Wakil Ketua */}
                    <div className="w-48">
                        <OrgCard person={pimpinan.wakilKetua} />
                    </div>

                    <LineV height="h-8" />

                    {/* L3 — Admin branch */}
                    <div className="relative flex justify-center w-full">
                        {/* horizontal connector bar */}
                        <div className="absolute top-0 left-[calc(50%-88px)] right-[calc(50%-88px)] h-px bg-primary/20" />

                        <div className="flex gap-16 pt-0">
                            {/* Left: Sekretaris stack */}
                            <div className="flex flex-col items-center">
                                <LineV height="h-8" />
                                <div className="w-48">
                                    <OrgCard person={administrasi.sekretaris} />
                                </div>
                                <LineV height="h-6" color="bg-primary-light/30" />
                                <div className="w-48">
                                    <OrgCard person={administrasi.wakilSekretaris} />
                                </div>
                            </div>

                            {/* Right: Bendahara */}
                            <div className="flex flex-col items-center">
                                <LineV height="h-8" />
                                <div className="w-48">
                                    <OrgCard person={administrasi.bendahara} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <LineV height="h-10" />

                    {/* L4 — Bidang */}
                    <div className="relative flex justify-center gap-8 w-full">
                        {/* horizontal connector bar spanning both bidang */}
                        <div className="absolute top-0 left-[calc(50%-160px)] right-[calc(50%-160px)] h-px bg-primary/20" />

                        {bidang.map((bid, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1 max-w-sm">
                                <LineV height="h-10" />

                                {/* Bidang container */}
                                <div className="w-full bg-primary/5 border border-primary/10 rounded-2xl p-5 flex flex-col items-center">
                                    {/* Title pill */}
                                    <span className="text-primary font-bold text-[11px] uppercase tracking-widest bg-surface-card border border-border px-4 py-1.5 rounded-full shadow-sm mb-5">
                                        {bid.namaBidang}
                                    </span>

                                    {/* Ketua bidang */}
                                    <div className="w-44">
                                        <OrgCard person={bid.ketua} compact />
                                    </div>

                                    <LineV height="h-6" color="bg-primary-light/30" />

                                    {/* Anggota grid */}
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        {bid.anggota.map((ang, i) => (
                                            <AnggotaCard key={i} person={ang} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════ */}
                {/* MOBILE & TABLET (< lg)                                 */}
                {/* ══════════════════════════════════════════════════════ */}
                <div className="flex flex-col gap-10 lg:hidden">

                    {/* Pimpinan */}
                    <section>
                        <SectionLabel color="border-primary text-primary">Pimpinan Koperasi</SectionLabel>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                            <OrgCard person={pimpinan.ketua} />
                            <OrgCard person={pimpinan.wakilKetua} />
                        </div>
                    </section>

                    {/* Kesekretariatan */}
                    <section>
                        <SectionLabel color="border-primary-light text-primary-light">Kesekretariatan & Bendahara</SectionLabel>

                        {/* Sekretaris + Wakil Sekretaris dalam satu box */}
                        <div className="bg-primary-light/5 border border-primary-light/20 rounded-2xl p-4 mb-3">
                            <OrgCard person={administrasi.sekretaris} />
                            <div className="flex items-start gap-3 mt-3 pl-4 border-l-2 border-primary-light/30">
                                <div className="flex-1">
                                    <OrgCard person={administrasi.wakilSekretaris} />
                                </div>
                            </div>
                        </div>

                        {/* Bendahara standalone */}
                        <OrgCard person={administrasi.bendahara} />
                    </section>

                    {/* Bidang */}
                    <section>
                        <SectionLabel color="border-primary text-primary">Bidang Kerja</SectionLabel>
                        <div className="flex flex-col gap-4">
                            {bidang.map((bid, idx) => (
                                <div key={idx} className="bg-primary/5 border border-primary/10 rounded-2xl overflow-hidden">
                                    {/* Header bidang */}
                                    <div className="bg-primary/10 border-b border-primary/10 px-4 py-2.5">
                                        <span className="text-primary font-bold text-[11px] uppercase tracking-widest">
                                            {bid.namaBidang}
                                        </span>
                                    </div>

                                    <div className="p-4 flex flex-col gap-3">
                                        {/* Ketua bidang */}
                                        <OrgCard person={bid.ketua} compact />

                                        {/* Anggota list */}
                                        <div className="flex flex-col gap-2 pl-3 border-l-2 border-primary-light/30">
                                            {bid.anggota.map((ang, i) => (
                                                <AnggotaCard key={i} person={ang} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

            </main>

            <Footer />
        </div>
    );
}