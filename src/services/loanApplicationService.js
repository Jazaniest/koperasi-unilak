// src/services/loanApplicationService.js

import { apiRequest } from './api'

/**
 * GET /api/loan-applications?status=pending
 */
export async function getLoanApplications(filters = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.memberId) params.set('memberId', filters.memberId)

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
export async function submitLoanApplication(_memberId, data) {
    try {
        const res = await apiRequest('/loan-applications/loan', {
            method: 'POST',
            body: JSON.stringify(data),
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