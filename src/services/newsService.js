import { apiRequest } from './api'

// ── Public ────────────────────────────────────────────────────────────────────

/** Ambil berita yang sudah published, untuk landing page */
export async function getPublicNews(limit = 6) {
    const res = await apiRequest(`/news?limit=${limit}`)
    return res.data // { news: [...], total: N }
}

/** Ambil detail berita by slug (halaman publik) */
export async function getPublicNewsBySlug(slug) {
    const res = await apiRequest(`/news/slug/${slug}`)
    return res.data
}

// ── Admin ─────────────────────────────────────────────────────────────────────

/** Ambil semua berita termasuk draft (admin) */
export async function getAdminNews(limit = 20, offset = 0) {
    const res = await apiRequest(`/news/admin?limit=${limit}&offset=${offset}`)
    return res.data // { news: [...], total: N }
}

/** Ambil detail satu berita by ID (admin) */
export async function getAdminNewsById(id) {
    const res = await apiRequest(`/news/admin/${id}`)
    return res.data
}

/** Buat berita baru */
export async function createNews(payload) {
    // payload: { title, excerpt, content, thumbnail_url, is_published }
    const res = await apiRequest('/news', {
        method: 'POST',
        body: payload, // axios akan otomatis stringify
    })
    return res.data
}

/** Update berita */
export async function updateNews(id, payload) {
    const res = await apiRequest(`/news/${id}`, {
        method: 'PUT',
        body: payload, // axios akan otomatis stringify
    })
    return res.data
}

/** Hapus berita */
export async function deleteNews(id) {
    const res = await apiRequest(`/news/${id}`, { method: 'DELETE' })
    return res.data
}

/**
 * Upload thumbnail — pakai FormData, return { url }
 */
export async function uploadThumbnail(file) {
    const form = new FormData()
    form.append('thumbnail', file)
    const res = await apiRequest('/news/upload-thumbnail', {
        method: 'POST',
        body: form,
    })
    return res.data // { url: '/uploads/news/...' }
}

/** Helper: bangun URL gambar dari path relatif */
export function buildImageUrl(path) {
    if (!path) return null
    if (path.startsWith('http')) return path
    // Dapatkan base URL dari environment variable, hapus '/api' di akhir
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '')
    return `${baseUrl}${path}`
}
