import { getDatabase, updateDatabase, generateId } from './dbService'
import { addSystemLog } from './dbService'

export function getLoanApplications(filters = {}) {
  const db = getDatabase()
  let apps = db.loanApplications.map((app) => {
    const member = db.members.find((m) => m.id === app.memberId)
    const user = member ? db.users.find((u) => u.id === member.userId) : null
    return {
      ...app,
      memberName: user?.name ?? '—',
      memberNumber: member?.memberNumber ?? '—',
    }
  })

  if (filters.status) {
    apps = apps.filter((a) => a.status === filters.status)
  }
  if (filters.memberId) {
    apps = apps.filter((a) => a.memberId === filters.memberId)
  }

  return apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function submitLoanApplication(memberId, data) {
  const db = getDatabase()
  const pending = db.loanApplications.filter(
    (a) => a.memberId === memberId && a.status === 'pending',
  )
  if (pending.length > 0) {
    return { success: false, error: 'Anda masih memiliki pengajuan pinjaman yang menunggu persetujuan' }
  }

  const application = {
    id: generateId('la'),
    memberId,
    amount: Number(data.amount),
    purpose: data.purpose,
    tenorMonths: Number(data.tenorMonths),
    collateral: data.collateral || 'Tidak ada',
    status: 'pending',
    createdAt: new Date().toISOString(),
    adminNotes: null,
    reviewedBy: null,
    reviewedAt: null,
  }

  updateDatabase((d) => {
    d.loanApplications.push(application)
    return d
  })

  addSystemLog('info', `Pengajuan pinjaman baru: ${application.id} dari anggota ${memberId}`)

  return { success: true, application }
}

export function reviewLoanApplication(appId, adminId, decision, adminNotes) {
  const db = getDatabase()
  const app = db.loanApplications.find((a) => a.id === appId)
  if (!app) return { success: false, error: 'Pengajuan tidak ditemukan' }
  if (app.status !== 'pending') {
    return { success: false, error: 'Pengajuan sudah diproses' }
  }

  updateDatabase((d) => {
    const a = d.loanApplications.find((x) => x.id === appId)
    a.status = decision
    a.adminNotes = adminNotes
    a.reviewedBy = adminId
    a.reviewedAt = new Date().toISOString()

    if (decision === 'approved') {
      const interestRate = 12
      const monthlyPayment = Math.round(
        (a.amount * (1 + interestRate / 100)) / a.tenorMonths,
      )
      d.loans.push({
        id: generateId('ln'),
        memberId: a.memberId,
        amount: a.amount,
        remaining: a.amount,
        interestRate,
        tenorMonths: a.tenorMonths,
        monthlyPayment,
        status: 'active',
        purpose: a.purpose,
        startDate: new Date().toISOString().slice(0, 10),
        approvedBy: adminId,
      })
    }
    return d
  })

  addSystemLog('info', `Pengajuan ${appId} ${decision} oleh admin ${adminId}`)

  return { success: true }
}

export function getMemberLoans(memberId) {
  const db = getDatabase()
  return db.loans.filter((l) => l.memberId === memberId)
}

export function settleLoan(loanId, processedBy) {
  const db = getDatabase()
  const loan = db.loans.find((l) => l.id === loanId)
  if (!loan) return { success: false, error: 'Pinjaman tidak ditemukan' }
  if (loan.status !== 'active') return { success: false, error: 'Pinjaman tidak aktif' }

  updateDatabase((d) => {
    const l = d.loans.find((x) => x.id === loanId)
    const sisaPelunasan = l.remaining

    l.remaining = 0
    l.status = 'lunas'
    l.settledAt = new Date().toISOString().slice(0, 10)
    l.settledBy = processedBy

    // Catat di loanPayments sebagai pelunasan sekaligus
    d.loanPayments = d.loanPayments ?? []
    d.loanPayments.push({
      id: generateId('pay'),
      loanId,
      amount: sisaPelunasan,
      date: new Date().toISOString().slice(0, 10),
      description: 'Pelunasan penuh',
      remainingAfter: 0,
    })
    return d
  })

  addSystemLog('info', `Pinjaman ${loanId} dilunasi penuh oleh ${processedBy}`)
  return { success: true }
}