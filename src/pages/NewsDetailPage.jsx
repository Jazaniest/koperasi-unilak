import { useEffect, useReducer } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { IconNews } from '../components/ui/Icons'
import { getPublicNewsBySlug, buildImageUrl } from '../services/newsService'

function formatNewsDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

const initialState = { news: null, loading: true, notFound: false }

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { news: null, loading: true, notFound: false }
        case 'FETCH_SUCCESS':
            return { news: action.payload, loading: false, notFound: false }
        case 'FETCH_ERROR':
            return { news: null, loading: false, notFound: true }
        default:
            return state
    }
}

function formatDay(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long' })
}

/**
 * Konversi plain text → paragraf HTML.
 * Baris kosong = pisah paragraf, baris tunggal = <br> di dalam paragraf.
 */
function renderContent(text) {
    if (!text) return null

    const blocks = text.split(/\n{2,}/)
    const parsed = blocks.map((block) => block.trim()).filter(Boolean)

    return (
        <div className="prose-article">
            {parsed.map((block, i) => {
                // Heading: baris yang diawali "# " atau "## "
                if (block.startsWith('## ')) {
                    return (
                        <h2 key={i} className="article-h2">
                            {block.slice(3)}
                        </h2>
                    )
                }
                if (block.startsWith('# ')) {
                    return (
                        <h3 key={i} className="article-h3">
                            {block.slice(2)}
                        </h3>
                    )
                }

                // Paragraf biasa
                return (
                    <p key={i} className="article-p">
                        {block.split('\n').map((line, j, arr) => (
                            <span key={j}>
                                {line}
                                {j < arr.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                )
            })}
        </div>
    )
}

// ── Skeleton ──────────────────────────────────────────────────────
function DetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
                <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
                <div className="h-10 w-32 animate-pulse rounded bg-gray-100" />
                <div className="aspect-video w-full animate-pulse rounded-2xl bg-gray-100" />
                <div className="space-y-3 pt-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-4 animate-pulse rounded bg-gray-100"
                            style={{ width: i % 3 === 2 ? '60%' : '100%' }}
                        />
                    ))}
                </div>
            </div>
            <div className="hidden lg:block space-y-4">
                <div className="h-48 w-full animate-pulse rounded-2xl bg-gray-100" />
                <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            </div>
        </div>
    )
}

export function NewsDetailPage() {
    const { slug } = useParams()
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        let isMounted = true

        dispatch({ type: 'FETCH_START' })

        getPublicNewsBySlug(slug)
            .then((data) => {
                if (isMounted) dispatch({ type: 'FETCH_SUCCESS', payload: data })
            })
            .catch(() => {
                if (isMounted) dispatch({ type: 'FETCH_ERROR' })
            })

        return () => {
            isMounted = false
        }
    }, [slug])

    const { news, loading, notFound } = state

    const imgUrl = news?.thumbnail_url ? buildImageUrl(news.thumbnail_url) : null

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14 flex-1">

                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
                    <Link to="/" className="hover:text-primary transition-colors">
                        Beranda
                    </Link>
                    <span>/</span>
                    <span className="text-text-primary truncate max-w-xs sm:max-w-md">
                        {loading ? 'Memuat...' : (news?.title ?? 'Berita')}
                    </span>
                </nav>

                {/* Loading */}
                {loading && <DetailSkeleton />}

                {/* Not found */}
                {!loading && notFound && (
                    <div className="flex flex-col items-center gap-4 py-24 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
                            <IconNews className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-lg font-medium text-text-primary">
                            Berita tidak ditemukan
                        </p>
                        <p className="text-sm text-text-muted">
                            Berita yang Anda cari tidak tersedia atau telah dihapus.
                        </p>
                        <Link
                            to="/"
                            className="mt-2 inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                )}

                {/* Konten artikel */}
                {!loading && news && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* ── Artikel utama ────────────────────────────────── */}
                        <article className="lg:col-span-2">

                            {/* Label kategori */}
                            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
                                Berita Koperasi
                            </p>

                            {/* Judul */}
                            <h1 className="text-2xl sm:text-3xl font-semibold leading-snug text-text-primary">
                                {news.title}
                            </h1>

                            {/* Meta */}
                            <div className="mt-3 mb-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-text-muted">
                                <span className="flex items-center gap-1.5">
                                    {/* Kalender */}
                                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatNewsDate(news.published_at)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    {/* Jam */}
                                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDay(news.published_at)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    {/* User */}
                                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {news.author?.name ?? 'Admin Koperasi'}
                                </span>
                            </div>

                            {/* Thumbnail */}
                            {imgUrl && (
                                <div className="mb-7 aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
                                    <img
                                        src={imgUrl}
                                        alt={news.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Isi berita */}
                            <div className="text-base text-text-primary">
                                {renderContent(news.content)}
                            </div>

                        </article>

                        {/* ── Sidebar ──────────────────────────────────────── */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-6 space-y-4">

                                {/* Info card */}
                                <div className="rounded-2xl border border-gray-100 bg-surface-card p-5">
                                    <h3 className="mb-4 text-sm font-semibold text-text-primary">
                                        Informasi Berita
                                    </h3>
                                    <dl className="space-y-3 text-sm">
                                        <div>
                                            <dt className="text-xs text-text-muted mb-0.5">Diterbitkan</dt>
                                            <dd className="font-medium text-text-primary">
                                                {formatNewsDate(news.published_at)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-text-muted mb-0.5">Hari</dt>
                                            <dd className="font-medium text-text-primary">
                                                {formatDay(news.published_at)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-text-muted mb-0.5">Penulis</dt>
                                            <dd className="font-medium text-text-primary">
                                                {news.author?.name ?? 'Admin Koperasi'}
                                            </dd>
                                        </div>
                                        {news.updated_at && news.updated_at !== news.created_at && (
                                            <div>
                                                <dt className="text-xs text-text-muted mb-0.5">Diperbarui</dt>
                                                <dd className="font-medium text-text-primary">
                                                    {formatNewsDate(news.updated_at)}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                {/* Tombol kembali */}
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-surface-card px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-surface"
                                >
                                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Kembali ke Beranda
                                </Link>

                            </div>
                        </aside>

                    </div>
                )}

            </main>

            <Footer />
        </div>
    )
}