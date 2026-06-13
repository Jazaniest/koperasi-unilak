// services/treasurerService.js
import { getDatabase, updateDatabase, generateId } from './dbService'

// ─── Ringkasan Keuangan ───────────────────────────────────────────────────────

export function getTreasurerStats() {
    const db = getDatabase()

    const totalSimpananPokok = db.savings
        .filter((s) => s.type === 'pokok')
        .reduce((sum, s) => sum + s.amount, 0)

    const totalSimpananWajib = db.savings
        .filter((s) => s.type === 'wajib')
        .reduce((sum, s) => sum + s.amount, 0)

    const totalSimpananSukarela = db.savings
        .filter((s) => s.type === 'sukarela')
        .reduce((sum, s) => sum + s.amount, 0)

    const totalSimpanan = totalSimpananPokok + totalSimpananWajib + totalSimpananSukarela

    const totalPinjamanDikucurkan = db.loans.reduce((sum, l) => sum + l.amount, 0)
    const totalSisaPinjaman = db.loans.reduce((sum, l) => sum + l.remaining, 0)
    const totalPinjamanAktif = db.loans.filter((l) => l.status === 'active').length

    // Kas = total simpanan - total pinjaman yang masih berjalan
    const totalKas = totalSimpanan - totalSisaPinjaman

    // Pendapatan bunga estimasi (bunga * remaining / 12 per bulan)
    const estimasiBungaBulanIni = db.loans
        .filter((l) => l.status === 'active')
        .reduce((sum, l) => sum + (l.remaining * l.interestRate) / 100 / 12, 0)

    return {
        totalSimpanan,
        totalSimpananPokok,
        totalSimpananWajib,
        totalSimpananSukarela,
        totalPinjamanDikucurkan,
        totalSisaPinjaman,
        totalPinjamanAktif,
        totalKas,
        estimasiBungaBulanIni,
        totalAnggota: db.members.length,
        totalAnggotaAktif: db.members.filter((m) => m.status === 'active').length,
    }
}

// ─── Transaksi Simpanan ───────────────────────────────────────────────────────

export function getAllSavingsTransactions() {
    const db = getDatabase()
    return db.savings
        .map((s) => {
            const member = db.members.find((m) => m.id === s.memberId)
            const user = db.users.find((u) => u.id === member?.userId)
            return {
                ...s,
                memberName: user?.name ?? 'Tidak diketahui',
                memberNumber: member?.memberNumber ?? '-',
            }
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function addSavingsTransaction({ memberId, type, amount, description }) {
    return updateDatabase((db) => {
        const newTx = {
            id: generateId('sv'),
            memberId,
            type,
            amount: Number(amount),
            date: new Date().toISOString().slice(0, 10),
            description,
        }
        db.savings.push(newTx)
        return db
    })
}

// ─── Cicilan Pinjaman ─────────────────────────────────────────────────────────

export function getAllLoansWithMembers() {
    const db = getDatabase()
    return db.loans.map((l) => {
        const member = db.members.find((m) => m.id === l.memberId)
        const user = db.users.find((u) => u.id === member?.userId)
        return {
            ...l,
            memberName: user?.name ?? 'Tidak diketahui',
            memberNumber: member?.memberNumber ?? '-',
        }
    })
}

export function recordLoanPayment({ loanId, amount, description }) {
    return updateDatabase((db) => {
        const loan = db.loans.find((l) => l.id === loanId)
        if (!loan) throw new Error('Pinjaman tidak ditemukan')

        const paid = Number(amount)
        loan.remaining = Math.max(0, loan.remaining - paid)
        if (loan.remaining === 0) loan.status = 'lunas'

        // Simpan riwayat pembayaran
        db.loanPayments = db.loanPayments ?? []
        db.loanPayments.push({
            id: generateId('pay'),
            loanId,
            amount: paid,
            date: new Date().toISOString().slice(0, 10),
            description: description || 'Pembayaran cicilan',
            remainingAfter: loan.remaining,
        })
        return db
    })
}

export function getLoanPayments(loanId) {
    const db = getDatabase()
    const payments = db.loanPayments ?? []
    return loanId ? payments.filter((p) => p.loanId === loanId) : payments
}

// ─── Laporan Bulanan ──────────────────────────────────────────────────────────

export function getMonthlyReport(year, month) {
    const db = getDatabase()

    const pad = (n) => String(n).padStart(2, '0')
    const prefix = `${year}-${pad(month)}`

    const simpananBulanIni = db.savings
        .filter((s) => s.date.startsWith(prefix))
        .reduce((sum, s) => sum + s.amount, 0)

    const payments = db.loanPayments ?? []
    const cicilanBulanIni = payments
        .filter((p) => p.date.startsWith(prefix))
        .reduce((sum, p) => sum + p.amount, 0)

    // Bunga diterima bulan ini (estimasi dari cicilan * proporsi bunga)
    const bungaDiterima = db.loans
        .filter((l) => l.status === 'active')
        .reduce((sum, l) => sum + (l.remaining * l.interestRate) / 100 / 12, 0)

    return {
        year,
        month,
        simpananMasuk: simpananBulanIni,
        cicilanDiterima: cicilanBulanIni,
        bungaDiterima,
        totalPemasukan: simpananBulanIni + cicilanBulanIni + bungaDiterima,
    }
}

export function getLast6MonthsReport() {
    const reports = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        reports.push(getMonthlyReport(d.getFullYear(), d.getMonth() + 1))
    }
    return reports
}

// ─── Helper nama bulan ────────────────────────────────────────────────────────
export const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
]

const SCHEDULER_KEY = 'koperasi_cicilan_scheduler'

export function getSchedulerConfig() {
    try {
        const raw = localStorage.getItem(SCHEDULER_KEY)
        return raw ? JSON.parse(raw) : { enabled: false, dayOfMonth: 1, lastRun: null }
    } catch {
        return { enabled: false, dayOfMonth: 1, lastRun: null }
    }
}

export function saveSchedulerConfig(config) {
    localStorage.setItem(SCHEDULER_KEY, JSON.stringify(config))
}

// ─── Proses cicilan: kurangi remaining semua pinjaman aktif ──────────────────

export function processMonthlyCicilan() {
    const results = []

    updateDatabase((db) => {
        db.loanPayments = db.loanPayments ?? []

        for (const loan of db.loans) {
            if (loan.status !== 'active') continue

            const bayar = Math.min(loan.monthlyPayment, loan.remaining)
            loan.remaining = Math.max(0, loan.remaining - bayar)
            if (loan.remaining === 0) loan.status = 'lunas'

            const payment = {
                id: generateId('pay'),
                loanId: loan.id,
                amount: bayar,
                date: new Date().toISOString().slice(0, 10),
                description: 'Proses cicilan bulanan',
                remainingAfter: loan.remaining,
            }
            db.loanPayments.push(payment)
            results.push({ loanId: loan.id, amount: bayar, remaining: loan.remaining })
        }
        return db
    })

    return results
}

// ─── Cek & jalankan scheduler otomatis (panggil saat app/dashboard mount) ────

export function checkAndRunScheduler() {
    const config = getSchedulerConfig()
    if (!config.enabled) return null

    const now = new Date()
    const todayDay = now.getDate()
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Sudah dijalankan bulan ini?
    if (config.lastRun && config.lastRun.startsWith(thisMonthKey)) return null

    // Belum saatnya tanggal yang ditentukan?
    if (todayDay < config.dayOfMonth) return null

    const results = processMonthlyCicilan()
    saveSchedulerConfig({ ...config, lastRun: now.toISOString().slice(0, 10) })
    return results
}

const SCHEDULER_WAJIB_KEY = 'koperasi_simpanan_wajib_scheduler'

export function getSchedulerWajibConfig() {
    try {
        const raw = localStorage.getItem(SCHEDULER_WAJIB_KEY)
        return raw ? JSON.parse(raw) : { enabled: false, dayOfMonth: 5, lastRun: null }
    } catch {
        return { enabled: false, dayOfMonth: 5, lastRun: null }
    }
}

export function saveSchedulerWajibConfig(config) {
    localStorage.setItem(SCHEDULER_WAJIB_KEY, JSON.stringify(config))
}

// ─── Nominal simpanan wajib per anggota (bisa dikonfigurasi nanti) ────────────
const NOMINAL_WAJIB_DEFAULT = 100000

export function processSimapananWajib() {
    const results = []

    updateDatabase((db) => {
        const activeMembers = db.members.filter((m) => m.status === 'active')
        const today = new Date().toISOString().slice(0, 10)
        const thisMonthPrefix = today.slice(0, 7) // "YYYY-MM"

        for (const member of activeMembers) {
            // Cegah duplikasi: skip jika bulan ini sudah ada simpanan wajib
            const sudahAda = db.savings.some(
                (s) => s.memberId === member.id && s.type === 'wajib' && s.date.startsWith(thisMonthPrefix)
            )
            if (sudahAda) {
                results.push({ memberId: member.id, skipped: true })
                continue
            }

            const entry = {
                id: generateId('sv'),
                memberId: member.id,
                type: 'wajib',
                amount: NOMINAL_WAJIB_DEFAULT,
                date: today,
                description: `Simpanan wajib otomatis ${thisMonthPrefix}`,
            }
            db.savings.push(entry)
            results.push({ memberId: member.id, amount: NOMINAL_WAJIB_DEFAULT, skipped: false })
        }
        return db
    })

    return results
}

export function checkAndRunSchedulerWajib() {
    const config = getSchedulerWajibConfig()
    if (!config.enabled) return null

    const now = new Date()
    const todayDay = now.getDate()
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    if (config.lastRun && config.lastRun.startsWith(thisMonthKey)) return null
    if (todayDay < config.dayOfMonth) return null

    const results = processSimapananWajib()
    saveSchedulerWajibConfig({ ...config, lastRun: now.toISOString().slice(0, 10) })
    return results
}