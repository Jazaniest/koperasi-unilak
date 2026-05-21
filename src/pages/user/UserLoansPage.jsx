import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { IconHome, IconWallet, IconLoan, IconFile } from '../../components/ui/Icons'
import { getMemberByUserId } from '../../services/memberService'
import { getMemberLoans } from '../../services/loanService'
import { formatCurrency, formatDate } from '../../utils/format'

const nav = [
  { to: '/app', label: 'Beranda', icon: IconHome, end: true },
  { to: '/app/simpanan', label: 'Simpanan', icon: IconWallet },
  { to: '/app/pinjaman', label: 'Pinjaman', icon: IconLoan },
  { to: '/app/pengajuan', label: 'Ajukan Pinjaman', icon: IconFile },
]

export function UserLoansPage() {
  const { user } = useAuth()
  const member = getMemberByUserId(user.id)
  const loans = member ? getMemberLoans(member.id) : []

  return (
    <DashboardLayout title="Pinjaman Saya" subtitle="Daftar pinjaman dan cicilan" navItems={nav}>
      {loans.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-sm leading-relaxed text-text-muted">Anda belum memiliki pinjaman</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {loans.map((loan) => {
            const paidPercent = Math.round(((loan.amount - loan.remaining) / loan.amount) * 100)
            return (
              <Card key={loan.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-text-primary">{loan.purpose}</h3>
                    <p className="text-sm text-text-muted">Mulai {formatDate(loan.startDate)}</p>
                  </div>
                  <Badge status={loan.status} />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    <span>{paidPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-lg bg-gray-100">
                    <div
                      className="h-full rounded-lg bg-primary transition-all"
                      style={{ width: `${paidPercent}%` }}
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
