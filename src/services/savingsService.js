// src/services/savingService.js

import { apiRequest } from './api'

export const SAVINGS_TYPE_LABELS = {
  pokok: 'Simpanan Pokok',
  wajib: 'Simpanan Wajib',
  sukarela: 'Simpanan Sukarela',
}

/**
 * GET /api/savings/member/:memberId
 * Response: { records, byType, total }
 */
export async function getMemberSavings(memberId) {
  const res = await apiRequest(`/savings/member/${memberId}`)
  return res.data
}

/**
 * GET /api/savings
 * Semua transaksi — staff only
 */
export async function getAllSavingsTransactions() {
  const res = await apiRequest('/savings')
  return res.data
}

/**
 * POST /api/savings
 * Body: { memberId, type, amount, description }
 */
export async function addSavingsTransaction({ memberId, type, amount, description }) {
  try {
    const res = await apiRequest('/savings', {
      method: 'POST',
      body: JSON.stringify({ memberId, type, amount, description }),
    })
    return { success: true, saving: res.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}