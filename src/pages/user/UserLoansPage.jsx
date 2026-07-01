import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { getMemberByUserId } from '../../services/memberService'
import { getMemberLoans } from '../../services/loanService'
import { formatCurrency, formatDate } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'

export function UserLoansPage() {
  const { user } = useAuth()
  const [loans, setLoans] = useState([])

  useEffect(() => {
    getMemberByUserId(user.id).then((m) => {
      if (m) getMemberLoans(m.id).then(setLoans)
    })
  }, [user.id])

  return (
    <DashboardLayout title="Pinjaman Saya" subtitle="Daftar pinjaman dan cicilan" navItems={UserNavbar}>
      {loans.length === 0 ? (
        <Card className="py-10 text-center sm:py-16">
          <p className="text-sm leading-relaxed text-text-muted">Anda belum memiliki pinjaman</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-5">
          {loans.map((loan) => {
            const rawPercent = ((loan.amount - loan.remaining) / loan.amount) * 100
            const progressBarPercent = Math.floor(rawPercent)
            const displayPercent = rawPercent.toFixed(1)
            return (
              <Card key={loan.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-text-primary">{loan.purpose}</h3>
                    <p className="text-sm text-text-muted">Mulai {formatDate(loan.startDate)}</p>
                  </div>
                  <Badge status={loan.status} className="shrink-0" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-text-muted">Plafon</p>
                    <p className="mt-1 font-medium text-text-primary">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Sisa</p>
                    <p className="mt-1 font-medium text-danger">{formatCurrency(loan.remaining)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Cicilan/bulan</p>
                    <p className="mt-1 font-medium text-text-primary">{formatCurrency(loan.monthlyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Tenor · Bunga</p>
                    <p className="mt-1 font-medium text-text-primary">
                      {loan.tenorMonths} bln · {loan.interestRate}%
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-xs text-text-muted">
                    <span>Progress pelunasan</span>
                    <span>{displayPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-lg bg-gray-100">
                    <div
                      className="h-full rounded-lg bg-primary transition-all"
                      style={{ width: `${progressBarPercent}%` }}
                    />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
