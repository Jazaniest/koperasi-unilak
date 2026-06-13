// src/services/treasurerService.js

import { apiRequest } from './api'

export async function getTreasurerStats() {
    const res = await apiRequest('/treasurer/stats')
    return res.data
}

export async function getMonthlyReport(year, month) {
    const res = await apiRequest(`/treasurer/report/monthly?year=${year}&month=${month}`)
    return res.data
}

export async function getLast6MonthsReport() {
    const res = await apiRequest('/treasurer/report/last6months')
    return res.data
}

export async function processMonthlyCicilan() {
    const res = await apiRequest('/treasurer/process/cicilan', { method: 'POST' })
    return res.data.detail ?? []
}

export async function processSimapananWajib() {
    const res = await apiRequest('/treasurer/process/simpanan-wajib', { method: 'POST' })
    return res.data.detail ?? []
}

// ─── Scheduler (tetap lokal — tidak ada endpoint backend) ──────────────────

export const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
]

const SCHEDULER_KEY = 'koperasi_cicilan_scheduler'
const SCHEDULER_WAJIB_KEY = 'koperasi_simpanan_wajib_scheduler'

export function getSchedulerConfig() {
    try {
        const raw = localStorage.getItem(SCHEDULER_KEY)
        return raw ? JSON.parse(raw) : { enabled: false, dayOfMonth: 1, lastRun: null }
    } catch { return { enabled: false, dayOfMonth: 1, lastRun: null } }
}

export function saveSchedulerConfig(config) {
    localStorage.setItem(SCHEDULER_KEY, JSON.stringify(config))
}

export function getSchedulerWajibConfig() {
    try {
        const raw = localStorage.getItem(SCHEDULER_WAJIB_KEY)
        return raw ? JSON.parse(raw) : { enabled: false, dayOfMonth: 5, lastRun: null }
    } catch { return { enabled: false, dayOfMonth: 5, lastRun: null } }
}

export function saveSchedulerWajibConfig(config) {
    localStorage.setItem(SCHEDULER_WAJIB_KEY, JSON.stringify(config))
}

export async function checkAndRunScheduler() {
    const config = getSchedulerConfig()
    if (!config.enabled) return null

    const now = new Date()
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    if (config.lastRun?.startsWith(thisMonthKey)) return null
    if (now.getDate() < config.dayOfMonth) return null

    const results = await processMonthlyCicilan()
    saveSchedulerConfig({ ...config, lastRun: now.toISOString().slice(0, 10) })
    return results
}

export async function checkAndRunSchedulerWajib() {
    const config = getSchedulerWajibConfig()
    if (!config.enabled) return null

    const now = new Date()
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    if (config.lastRun?.startsWith(thisMonthKey)) return null
    if (now.getDate() < config.dayOfMonth) return null

    const results = await processSimapananWajib()
    saveSchedulerWajibConfig({ ...config, lastRun: now.toISOString().slice(0, 10) })
    return results
}

/**
 * GET /api/loans
 * Semua pinjaman beserta data anggota — staff only
 * Menggantikan getAllLoansWithMembers dari service lokal lama
 */
export async function getAllLoansWithMembers(filters = {}) {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.memberId) params.set('memberId', filters.memberId)

    const query = params.toString() ? `?${params}` : ''
    const res = await apiRequest(`/loans${query}`)
    return res.data
}