import { getDatabase } from './dbService'

export function getMemberSavings(memberId) {
  const db = getDatabase()
  const records = db.savings
    .filter((s) => s.memberId === memberId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const byType = { pokok: 0, wajib: 0, sukarela: 0 }
  for (const r of records) {
    if (byType[r.type] !== undefined) byType[r.type] += r.amount
  }

  return {
    records,
    byType,
    total: Object.values(byType).reduce((a, b) => a + b, 0),
  }
}

export const SAVINGS_TYPE_LABELS = {
  pokok: 'Simpanan Pokok',
  wajib: 'Simpanan Wajib',
  sukarela: 'Simpanan Sukarela',
}
