import { getDatabase } from './dbService'

export function getAllMembers() {
  const db = getDatabase()
  return db.members.map((member) => enrichMember(db, member))
}

export function getMemberById(memberId) {
  const db = getDatabase()
  const member = db.members.find((m) => m.id === memberId)
  if (!member) return null
  return enrichMember(db, member, true)
}

export function getMemberByUserId(userId) {
  const db = getDatabase()
  const user = db.users.find((u) => u.id === userId)
  if (!user?.memberId) return null
  return getMemberById(user.memberId)
}

function enrichMember(db, member, detailed = false) {
  const user = db.users.find((u) => u.id === member.userId)
  const savings = db.savings.filter((s) => s.memberId === member.id)
  const loans = db.loans.filter((l) => l.memberId === member.id)
  const applications = db.loanApplications.filter((a) => a.memberId === member.id)

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0)
  const totalLoanRemaining = loans
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + l.remaining, 0)

  const base = {
    ...member,
    name: user?.name ?? '—',
    email: user?.email ?? '—',
    phone: user?.phone ?? '—',
    totalSavings,
    totalLoanRemaining,
    activeLoans: loans.filter((l) => l.status === 'active').length,
    pendingApplications: applications.filter((a) => a.status === 'pending').length,
  }

  if (detailed) {
    return {
      ...base,
      savings,
      loans,
      loanApplications: applications,
    }
  }

  return base
}

export function getAdminStats() {
  const members = getAllMembers()
  const db = getDatabase()
  const pendingApps = db.loanApplications.filter((a) => a.status === 'pending').length
  const totalSavings = members.reduce((s, m) => s + m.totalSavings, 0)
  const totalLoans = members.reduce((s, m) => s + m.totalLoanRemaining, 0)

  return {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === 'active').length,
    pendingApplications: pendingApps,
    totalSavings,
    totalLoans,
  }
}
