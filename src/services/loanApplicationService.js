// src/services/loanApplicationService.js

import { apiRequest } from './api'

/**
 * GET /api/loan-applications?status=pending
 */
export async function getLoanApplications(filters = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.memberId) params.set('memberId', filters.memberId)
    if (filters.type) params.set('type', filters.type)

    const query = params.toString() ? `?${params}` : ''
    const res = await apiRequest(`/loan-applications${query}`)
    return res.data
}

/**
 * GET /api/loan-applications/member/:memberId
 */
export async function getMemberApplications(memberId) {
    const res = await apiRequest(`/loan-applications/member/${memberId}`)
    return res.data
}

/**
 * POST /api/loan-applications/loan
 * Body: { amount, purpose, tenorMonths, collateral }
 * Backend ambil memberId dari JWT — tidak perlu kirim dari frontend
 */
//tambahkan untuk upload file disini, sekarang belum ada
export async function submitLoanApplication(_memberId, data) {
    try {
        const formData = new FormData()
        formData.append('amount', data.amount)
        formData.append('purpose', data.purpose)
        formData.append('tenorMonths', data.tenorMonths)
        if (data.collateral instanceof File) {
            formData.append('collateral', data.collateral)
        }

        const res = await apiRequest('/loan-applications/loan', {
            method: 'POST',
            body: formData,
            // jangan set Content-Type, biar browser set otomatis dengan boundary
        })
        return { success: true, application: res.data }
    } catch (err) {
        return { success: false, error: err.message }
    }
}

/**
 * POST /api/loan-applications/:id/review
 * Body: { decision, adminNotes }
 */
export async function reviewLoanApplication(appId, _adminId, decision, adminNotes) {
    try {
        const res = await apiRequest(`/loan-applications/${appId}/review`, {
            method: 'POST',
            body: JSON.stringify({ decision, adminNotes }),
        })
        return { success: true, loan: res.data }
    } catch (err) {
        return { success: false, error: err.message }
    }
}

/**
 * POST /api/loan-applications/topup
 */
export async function submitTopUpApplication(data) {
    try {
        const formData = new FormData()
        formData.append('amount', data.amount)
        formData.append('purpose', data.purpose)
        formData.append('tenorMonths', data.tenorMonths)
        if (data.collateral instanceof File) {
            formData.append('collateral', data.collateral)
        }

        const res = await apiRequest('/loan-applications/topup', {
            method: 'POST',
            body: formData,
        })
        return { success: true, application: res.data }
    } catch (err) {
        return { success: false, error: err.message }
    }
}

/**
 * GET /api/loan-applications?type=topup  — filter pengajuan top up saja
 * (reuse getLoanApplications dengan filter tambahan)
 */
export async function getTopUpApplications(filters = {}) {
    const params = new URLSearchParams()
    params.set('type', 'topup')
    if (filters.status) params.set('status', filters.status)
    if (filters.memberId) params.set('memberId', filters.memberId)

    const res = await apiRequest(`/loan-applications?${params}`)
    return res.data
}

/**
 * POST /api/loan-applications/:id/review-topup
 */
export async function reviewTopUpApplication(appId, decision, adminNotes) {
    try {
        const res = await apiRequest(`/loan-applications/${appId}/review-topup`, {
            method: 'POST',
            body: JSON.stringify({ decision, adminNotes }),
        })
        return { success: true, loan: res.data }
    } catch (err) {
        return { success: false, error: err.message }
    }
}