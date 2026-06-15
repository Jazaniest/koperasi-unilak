import { useEffect, useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Card, StatCard } from '../components/ui/Card'
import { IconUsers, IconWallet, IconLoan, IconNews } from '../components/ui/Icons'
import { formatCurrency } from '../utils/format'
import { getPublicNews, buildImageUrl } from '../services/newsService'

// ─── Dummy data ───────────────────────────────────────────────────
const dummyStats = {
    totalMembers: 312,
    activeMembers: 287,
    totalSavings: 4_875_600_000,
    totalLoans: 2_340_000_000,
}

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

function formatNewsDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

// ── Skeleton card untuk loading state berita ──────────────────────
function NewsCardSkeleton() {
    return (
        <div className="ds-card flex flex-col gap-0 overflow-hidden p-0">
            <div className="h-44 w-full animate-pulse bg-gray-100" />
            <div className="flex flex-col gap-3 p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
        </div>
    )
}

// ── Card berita individual ────────────────────────────────────────
function NewsCard({ item }) {
    const imgUrl = buildImageUrl(item.thumbnail_url)

    return (
        <article className="ds-card flex flex-col gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md group">
            {/* Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden bg-surface">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <IconNews className="h-8 w-8 text-text-muted/30" />
                    </div>
                )}
            </div>

            {/* Konten */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                <time className="text-xs font-medium text-primary/70">
                    {formatNewsDate(item.published_at)}
                </time>

                <h3 className="font-medium leading-snug text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                </h3>

                {item.excerpt && (
                    <p className="text-sm leading-relaxed text-text-muted line-clamp-3">
                        {item.excerpt}
                    </p>
                )}

                <div className="mt-auto pt-1">
                    <span className="text-xs font-medium text-primary/80">
                        {item.author?.name ?? 'Admin Koperasi'}
                    </span>
                </div>
            </div>
        </article>
    )
}

export function LandingPage() {
    const [news, setNews] = useState([])
    const [newsLoading, setNewsLoading] = useState(true)

    useEffect(() => {
        getPublicNews(3)
            .then((res) => setNews(res.news ?? []))
            .catch(() => setNews([]))
            .finally(() => setNewsLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="border-b border-gray-100 bg-surface-card">
                <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
                    <div className="max-w-2xl">
                        <span className="inline-block rounded-xl bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                            Koperasi Konsumen Karyawan dan Dosen
                        </span>
                        <h1 className="mt-4 text-3xl font-medium leading-snug text-text-primary sm:text-4xl lg:text-5xl">
                            Kelola Keuangan Anda<br />
                            <span className="text-primary">Bersama Koperasi Unilak</span>
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

            {/* ── Berita & Pengumuman ──────────────────────────────────── */}
            {/* Hanya tampil jika ada berita yang published */}
            {(newsLoading || news.length > 0) && (
                <section className="border-t border-gray-100 bg-surface-card">
                    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
                        {/* Section header */}
                        <div className="mb-7 flex items-end justify-between gap-4">
                            <div>
                                <span className="text-xs font-medium uppercase tracking-wider text-primary/70">
                                    Info Koperasi
                                </span>
                                <h2 className="mt-1 text-xl font-medium text-text-primary sm:text-2xl">
                                    Berita &amp; Pengumuman
                                </h2>
                            </div>
                        </div>

                        {/* Grid berita */}
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {newsLoading
                                ? Array.from({ length: 3 }).map((_, i) => (
                                    <NewsCardSkeleton key={i} />
                                ))
                                : news.map((item) => (
                                    <NewsCard key={item.id} item={item} />
                                ))}
                        </div>
                    </div>
                </section>
            )}

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

            <div className="flex-1" />
            <Footer />
        </div>
    )
}