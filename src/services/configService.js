// src/services/configService.js

import { apiRequest } from './api'

/**
 * GET /api/system/metrics
 */
export async function getServerConfig() {
  // Config server sekarang dari backend, bukan localStorage
  const res = await apiRequest('/system/metrics')
  return res.data
}

export async function getMockServerMetrics() {
  const res = await apiRequest('/system/metrics')
  return res.data
}

/**
 * Tidak ada endpoint PUT config di backend.
 * Fungsi ini dipertahankan agar tidak ada error di pemanggil,
 * tapi tidak melakukan apa-apa sampai endpoint tersedia.
 */
export async function updateServerConfig(updates) {
  console.warn('[configService] updateServerConfig: endpoint belum tersedia di backend', updates)
  return updates
}