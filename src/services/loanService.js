// src/services/loanService.js

import { apiRequest } from './api'

/**
 * GET /api/loans?status=active&memberId=m-001
 */
export async function getAllLoans(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.memberId) params.set('memberId', filters.memberId)

  const query = params.toString() ? `?${params}` : ''
  const res = await apiRequest(`/loans${query}`)
  return res.data
}

/**
 * GET /api/loans/member/:memberId
 */
export async function getMemberLoans(memberId) {
  const res = await apiRequest(`/loans/member/${memberId}`)
  return res.data
}

/**
 * GET /api/loans/:id
 */
export async function getLoanDetail(loanId) {
  const res = await apiRequest(`/loans/${loanId}`)
  return res.data
}

/**
 * GET /api/loans/:id/installments
 */
export async function getLoanInstallments(loanId) {
  const res = await apiRequest(`/loans/${loanId}/installments`);
  return res.data;
}


/**
 * GET /api/loans/:id/payments
 */
export async function getLoanPayments(loanId) {
  const res = await apiRequest(`/loans/${loanId}/payments`)
  return res.data
}

/**
 * POST /api/loans/:id/pay
 * Body: { amount, description }
 */
export async function recordLoanPayment({ loanId, amount, description }) {
  try {
    const res = await apiRequest(`/loans/${loanId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ amount, description }),
    })
    return { success: true, ...res.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * POST /api/loans/:id/settle
 */
export async function settleLoan(loanId) {
  try {
    await apiRequest(`/loans/${loanId}/settle`, { method: 'POST' })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
