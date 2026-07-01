// src/services/memberService.js

import { apiRequest } from './api'

export async function getAllMembers() {
  const res = await apiRequest('/members')
  return res.data
}

export async function getMemberById(memberId) {
  const res = await apiRequest(`/members/${memberId}`)
  return res.data
}

/**
 * Anggota lihat profil sendiri
 * GET /api/members/me
 */
export async function getMyProfile() {
  const res = await apiRequest('/members/me')
  return res.data
}

/**
 * Untuk service lain yang butuh memberId dari userId saat ini
 * Gunakan /api/members/me — backend resolve dari JWT
 */
//eslint-disable-next-line
export async function getMemberByUserId(_userId) {
  return getMyProfile()
}

export async function getAdminStats() {
  const res = await apiRequest('/members/stats')
  return res.data
}

export async function createMember(data) {
  try {
    const res = await apiRequest('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return { success: true, member: res.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateMember(memberId, data) {
  try {
    await apiRequest(`/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function setMemberStatus(memberId, status) {
  try {
    await apiRequest(`/members/${memberId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/** Anggota ajukan pengunduran diri */
export async function submitResignation(reason) {
  try {
    await apiRequest('/members/me/resignation', {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/** Bendahara: ambil daftar pengunduran diri pending */
export async function getPendingResignations() {
  const res = await apiRequest('/members/resignations/pending')
  return res.data
}

/** Bendahara: setujui atau tolak pengunduran diri */
export async function reviewResignation(memberId, decision, notes) {
  try {
    await apiRequest(`/members/${memberId}/resignation/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, notes }),
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/** Anggota: ubah nama bank & nomor rekening miliknya sendiri */
export async function updateBankAccount(data) {
  try {
    const res = await apiRequest('/members/me/bank-account', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return { success: true, member: res.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function getPublicStats() {
    const res = await apiRequest('/members/public-stats')
    return res.data
}