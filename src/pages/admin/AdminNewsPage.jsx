import { useEffect, useRef, useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { AdminNavbar } from '../../components/admin/AdminNavbar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
// import { Badge } from '../../components/ui/Badge'
import { IconNews } from '../../components/ui/Icons'
import {
    getAdminNews,
    getAdminNewsById,
    createNews,
    updateNews,
    deleteNews,
    uploadThumbnail,
    buildImageUrl,
} from '../../services/newsService'
import { formatDateTime } from '../../utils/format'

// ── Status badge khusus untuk berita ─────────────────────────────────────────
function NewsBadge({ published }) {
    return published ? (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            Draft
        </span>
    )
}

// ── Modal Form Berita ─────────────────────────────────────────────────────────
function NewsFormModal({ initial, onClose, onSaved }) {
    const [form, setForm] = useState({
        title: initial?.title ?? '',
        excerpt: initial?.excerpt ?? '',
        content: initial?.content ?? '',
        thumbnail_url: initial?.thumbnail_url ?? '',
        is_published: initial?.is_published ?? false,
    })
    const [previewUrl, setPreviewUrl] = useState(
        initial?.thumbnail_url ? buildImageUrl(initial.thumbnail_url) : null
    )
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const fileRef = useRef()

    function set(key, val) {
        setForm((f) => ({ ...f, [key]: val }))
    }

    async function handleFileChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        // Preview lokal dulu
        setPreviewUrl(URL.createObjectURL(file))
        setUploading(true)
        try {
            const { url } = await uploadThumbnail(file)
            set('thumbnail_url', url)
        } catch {
            setError('Gagal mengupload thumbnail')
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit() {
        if (!form.title.trim() || !form.content.trim()) {
            setError('Judul dan konten wajib diisi')
            return
        }
        setSaving(true)
        setError(null)
        try {
            if (initial) {
                await updateNews(initial.id, form)
            } else {
                await createNews(form)
            }
            onSaved()
        } catch (e) {
            setError(e.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-surface-card shadow-xl animate-fade-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="font-medium text-text-primary">
                        {initial ? 'Edit Berita' : 'Tambah Berita Baru'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface hover:text-text-primary"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-4">
                    {error && (
                        <p className="rounded-xl bg-danger/8 px-4 py-2.5 text-sm text-danger">{error}</p>
                    )}

                    {/* Thumbnail */}
                    <div>
                        <span className="mb-1.5 block text-sm font-medium text-text-primary">
                            Thumbnail Berita
                        </span>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-surface transition hover:border-primary/40 hover:bg-primary/4"
                            style={{ minHeight: previewUrl ? 'auto' : '140px' }}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-52 w-full rounded-xl object-cover"
                                />
                            ) : (
                                <>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-text-muted">Klik untuk upload thumbnail</p>
                                    <p className="text-xs text-text-muted">JPG, PNG · maks. 2 MB</p>
                                </>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70">
                                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                                </div>
                            )}
                        </div>
                        {previewUrl && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); set('thumbnail_url', ''); fileRef.current.value = '' }}
                                className="mt-1.5 text-xs text-danger hover:underline"
                            >
                                Hapus thumbnail
                            </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    <Input
                        label="Judul Berita"
                        placeholder="Masukkan judul berita..."
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                    />

                    <Textarea
                        label="Ringkasan (opsional)"
                        placeholder="Ringkasan singkat yang tampil di halaman utama..."
                        rows={2}
                        value={form.excerpt}
                        onChange={(e) => set('excerpt', e.target.value)}
                    />

                    <Textarea
                        label="Isi Berita"
                        placeholder="Tulis konten berita di sini..."
                        rows={8}
                        value={form.content}
                        onChange={(e) => set('content', e.target.value)}
                    />

                    {/* Toggle publish */}
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-surface px-4 py-3">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={form.is_published}
                                onChange={(e) => set('is_published', e.target.checked)}
                            />
                            <div className="h-5 w-9 rounded-full bg-gray-200 transition peer-checked:bg-primary" />
                            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-primary">
                                {form.is_published ? 'Langsung publish' : 'Simpan sebagai draft'}
                            </p>
                            <p className="text-xs text-text-muted">
                                {form.is_published
                                    ? 'Berita akan langsung tampil di halaman utama'
                                    : 'Berita tidak akan ditampilkan ke publik'}
                            </p>
                        </div>
                    </label>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <Button variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} loading={saving} disabled={uploading}>
                        {initial ? 'Simpan Perubahan' : 'Buat Berita'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ── Modal Konfirmasi Hapus ────────────────────────────────────────────────────
function DeleteConfirmModal({ news, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)
        try {
            await deleteNews(news.id)
            onDeleted()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-surface-card p-6 shadow-xl animate-fade-in">
                <h3 className="font-medium text-text-primary">Hapus Berita?</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    Berita <span className="font-medium text-text-primary">"{news.title}"</span> akan dihapus permanen dan tidak dapat dipulihkan.
                </p>
                <div className="mt-5 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button variant="danger" onClick={handleDelete} loading={loading}>Hapus</Button>
                </div>
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function AdminNewsPage() {
    const [loading, setLoading] = useState(true)
    const [newsList, setNewsList] = useState([])
    const [total, setTotal] = useState(0)
    const [modal, setModal] = useState(null) // null | 'create' | { mode:'edit', data } | { mode:'delete', data }
    

    async function loadNews() {
        setLoading(true)
        try {
            const result = await getAdminNews()
            setNewsList(result.news)
            setTotal(result.total)
        } finally {
            setLoading(false)
        }
    }


    //eslint-disable-next-line
    useEffect(() => { loadNews() }, [])

    function handleSaved() {
        setModal(null)
        loadNews()
    }

    function handleDeleted() {
        setModal(null)
        loadNews()
    }

    async function openEdit(id) {
        try {
            const data = await getAdminNewsById(id)
            setModal({ mode: 'edit', data })
        } catch {
            // silent
        }
    }

    return (
        <DashboardLayout
            title="Manajemen Berita"
            subtitle="Kelola berita dan pengumuman untuk halaman utama"
            navItems={AdminNavbar}
        >
            {/* Header aksi */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-text-muted">
                        {total} berita total
                    </p>
                </div>
                <Button onClick={() => setModal('create')}>
                    + Tambah Berita
                </Button>
            </div>

            {/* Daftar Berita */}
            {loading ? (
                <Card>
                    <p className="text-sm text-text-muted">Memuat...</p>
                </Card>
            ) : newsList.length === 0 ? (
                <Card className="flex flex-col items-center gap-3 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
                        <IconNews className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium text-text-primary">Belum ada berita</p>
                    <p className="text-sm text-text-muted">Buat berita pertama untuk ditampilkan di halaman utama</p>
                    <Button className="mt-2" onClick={() => setModal('create')}>
                        Buat Berita Pertama
                    </Button>
                </Card>
            ) : (
                <Card className="p-0 overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {newsList.map((item) => (
                            <li key={item.id} className="flex flex-wrap items-start gap-4 p-5 transition hover:bg-surface/50">
                                {/* Thumbnail mini */}
                                {item.thumbnail_url ? (
                                    <img
                                        src={buildImageUrl(item.thumbnail_url)}
                                        alt={item.title}
                                        className="h-16 w-24 shrink-0 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-surface">
                                        <IconNews className="h-6 w-6 text-text-muted/40" />
                                    </div>
                                )}

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-text-primary truncate">{item.title}</p>
                                        <NewsBadge published={item.is_published} />
                                    </div>
                                    {item.excerpt && (
                                        <p className="mt-1 text-sm text-text-muted line-clamp-2">{item.excerpt}</p>
                                    )}
                                    <p className="mt-1.5 text-xs text-text-muted">
                                        {item.author?.name ?? '—'} · {formatDateTime(item.created_at)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => openEdit(item.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => setModal({ mode: 'delete', data: item })}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* Modals */}
            {modal === 'create' && (
                <NewsFormModal
                    initial={null}
                    onClose={() => setModal(null)}
                    onSaved={handleSaved}
                />
            )}
            {modal?.mode === 'edit' && (
                <NewsFormModal
                    initial={modal.data}
                    onClose={() => setModal(null)}
                    onSaved={handleSaved}
                />
            )}
            {modal?.mode === 'delete' && (
                <DeleteConfirmModal
                    news={modal.data}
                    onClose={() => setModal(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </DashboardLayout>
    )
}