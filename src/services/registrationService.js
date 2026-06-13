// src/services/registrationService.js

import { apiRequest } from './api'

/**
 * POST /api/registrations
 * Calon anggota mengajukan pendaftaran (public, tidak perlu token)
 */
export async function submitRegistration(data) {
    try {
        const res = await apiRequest('/registrations', {
            method: 'POST',
            body: JSON.stringify(data),
        })
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.message }
    }
}

/**
 * GET /api/registrations?status=pending|approved|rejected
 * Admin — daftar permintaan pendaftaran
 */
export async function getAllRegistrationRequests(status = null) {
    const query = status ? `?status=${status}` : ''
    const res = await apiRequest(`/registrations${query}`)
    return res.data
}

/**
 * GET /api/registrations/:id
 * Admin — detail satu permintaan
 */
export async function getRegistrationRequestById(id) {
    const res = await apiRequest(`/registrations/${id}`)
    return res.data
}

/**
 * POST /api/registrations/:id/approve
 * Admin — setujui permintaan
 */
export async function approveRegistrationRequest(id, note = '') {
    try {
        const res = await apiRequest(`/registrations/${id}/approve`, {
            method: 'POST',
            body: JSON.stringify({ note }),
        })
        return { success: true, member: res.data }
    } catch (err) {
        return { success: false, error: err.message }
    }
}

/**
 * POST /api/registrations/:id/reject
 * Admin — tolak permintaan
 */
export async function rejectRegistrationRequest(id, note = '') {
    try {
        await apiRequest(`/registrations/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ note }),
        })
        return { success: true }
    } catch (err) {
        return { success: false, error: err.message }
    }
}

/**
 * GET /api/registrations/pending-count
 * Admin — jumlah pending untuk badge notifikasi
 */
export async function getPendingRegistrationCount() {
    try {
        const res = await apiRequest('/registrations/pending-count')
        return res.data.count
    } catch {
        return 0
    }
}