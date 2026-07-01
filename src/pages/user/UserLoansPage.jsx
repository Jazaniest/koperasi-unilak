import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { getMemberByUserId } from '../../services/memberService'
import { getMemberLoans, getLoanInstallments } from '../../services/loanService' // Import fungsi baru
import { formatCurrency, formatDate } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'

// Fungsi untuk menghitung selisih bulan
function getMonthsPassed(startDate) {
  const start = new Date(startDate)
  const now = new Date()
  start.setDate(1)
  now.setDate(1)
  const years = now.getFullYear() - start.getFullYear()
  const months = now.getMonth() - start.getMonth()
  return years * 12 + months + 1
}

export function UserLoansPage() {
  const { user } = useAuth()
  const [loan, setLoan] = useState(null)
  const [installments, setInstallments] = useState([]) // State untuk data asli
  const [activeTab, setActiveTab] = useState('history')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    getMemberByUserId(user.id).then((m) => {
      if (m) {
        getMemberLoans(m.id).then((loans) => {
          if (loans && loans.length > 0) {
            const currentLoan = loans[0];
            setLoan(currentLoan);
            // Ambil data cicilan dari backend
            getLoanInstallments(currentLoan.id).then(setInstallments).finally(() => setLoading(false));
          } else {
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    })
  }, [user.id])

  const paidInstallments = installments.filter(i => i.status === 'PAID');
  const upcomingInstallments = installments.filter(i => i.status !== 'PAID');

  if (loading) {
    return (
        <DashboardLayout title="Pinjaman Saya" subtitle="Memuat data..." navItems={UserNavbar}>
            <Card className="py-10 text-center sm:py-16">
                <p className="text-sm leading-relaxed text-text-muted">Memuat data pinjaman...</p>
            </Card>
        </DashboardLayout>
    )
  }

  if (!loan) {
    return (
      <DashboardLayout title="Pinjaman Saya" subtitle="Daftar pinjaman dan cicilan" navItems={UserNavbar}>
        <Card className="py-10 text-center sm:py-16">
          <p className="text-sm leading-relaxed text-text-muted">Anda belum memiliki pinjaman aktif.</p>
        </Card>
      </DashboardLayout>
    )
  }

  const rawPercent = ((loan.amount - loan.remaining) / loan.amount) * 100
  const progressBarPercent = Math.floor(rawPercent)
  const displayPercent = rawPercent.toFixed(1)
  const monthsPassed = Math.min(getMonthsPassed(loan.startDate), loan.tenorMonths)

  return (
    <DashboardLayout title="Rincian Pinjaman" subtitle={loan.purpose} navItems={UserNavbar}>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">

        {/* Kolom Kiri: Ringkasan Pinjaman */}
        <div className="lg:col-span-2">
          <Card>
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
                <p className="text-xs text-text-muted">Tenor · Jasa</p>
                <p className="mt-1 font-medium text-text-primary">
                  {monthsPassed} / {loan.tenorMonths} bln · {loan.interestRate}%
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs text-text-muted">
                <span>Progress pelunasan</span>
                <span>{displayPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-lg bg-gray-100">
                <div className="h-full rounded-lg bg-primary transition-all" style={{ width: `${progressBarPercent}%` }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Kolom Kanan: Detail Cicilan */}
        <div className="lg:col-span-1 mt-6 lg:mt-0">
          <Card>
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-6">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                    activeTab === 'history'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:border-gray-300 hover:text-text-primary'
                  }`}
                >
                  Riwayat Pembayaran
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                    activeTab === 'schedule'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:border-gray-300 hover:text-text-primary'
                  }`}
                >
                  Jadwal Mendatang
                </button>
              </nav>
            </div>

            <div className="mt-4 flow-root">
              {activeTab === 'history' && (
                <ul className="divide-y divide-gray-200">
                  {paidInstallments.length > 0 ? paidInstallments.map((item, i) => (
                    <li key={i} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-text-primary">Cicilan Ke-{item.sequence}</p>
                          <p className="truncate text-sm text-text-muted">Dibayar pada {formatDate(item.paidDate)}</p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-text-primary">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                    </li>
                  )) : <p className="text-center text-sm text-text-muted py-4">Belum ada riwayat pembayaran.</p>}
                </ul>
              )}
              {activeTab === 'schedule' && (
                <ul className="divide-y divide-gray-200">
                  {upcomingInstallments.length > 0 ? upcomingInstallments.map((item, i) => (
                    <li key={i} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-text-primary">Cicilan Ke-{item.sequence}</p>
                          <p className="truncate text-sm text-text-muted">Jatuh tempo {formatDate(item.dueDate)}</p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-text-primary">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                    </li>
                  )) : <p className="text-center text-sm text-text-muted py-4">Semua cicilan sudah lunas.</p>}
                </ul>
              )}
            </div>

          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
