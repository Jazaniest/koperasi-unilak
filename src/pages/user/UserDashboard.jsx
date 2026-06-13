import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { StatCard, Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { IconWallet, IconLoan, IconFile } from '../../components/ui/Icons'
import { getMemberByUserId } from '../../services/memberService'
import { getMemberSavings } from '../../services/savingsService'
import { getMemberLoans } from '../../services/loanService'
import { getLoanApplications } from '../../services/loanApplicationService'
import { formatCurrency, formatDate } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'

export function UserDashboard() {
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [savings, setSavings] = useState(null)
  const [loans, setLoans] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(() => {
    getMemberByUserId(user.id).then(async (m) => {
      setMember(m)
      if (m) {
        const [s, l, a] = await Promise.all([
          getMemberSavings(m.id),
          getMemberLoans(m.id),
          getLoanApplications({ memberId: m.id }),
        ])
        setSavings(s)
        setLoans(l)
        setApplications(a)
      }
    })
  }, [user.id])

  const activeLoans = loans.filter((l) => l.status === 'active')
  const totalRemaining = activeLoans.reduce((s, l) => s + l.remaining, 0)
  const pendingApp = applications.find((a) => a.status === 'pending')

  return (
    <DashboardLayout
      title={`Halo, ${user.name.split(' ')[0]}`}
      subtitle={member ? `No. Anggota: ${member.memberNumber}` : 'Profil anggota'}
      navItems={UserNavbar}
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Simpanan"
          value={formatCurrency(savings?.total ?? 0)}
          subtitle="Pokok + wajib + sukarela"
          icon={IconWallet}
          accent="primary"
        />
        <StatCard
          title="Sisa Pinjaman Aktif"
          value={formatCurrency(totalRemaining)}
          subtitle={`${activeLoans.length} pinjaman aktif`}
          icon={IconLoan}
          accent="accent"
        />
        <StatCard
          title="Pengajuan"
          value={pendingApp ? 'Menunggu' : applications.length ? 'Riwayat' : '—'}
          subtitle={pendingApp ? 'Sedang ditinjau admin' : 'Tidak ada pengajuan aktif'}
          icon={IconFile}
          accent="warning"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-text-primary">Ringkasan Simpanan</h3>
            <Link to="/app/simpanan" className="ds-link">
              Lihat semua →
            </Link>
          </div>
          {savings && (
            <div className="mt-5 space-y-4">
              {Object.entries(savings.byType).map(([type, amount]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="capitalize text-text-muted">{type}</span>
                  <span className="font-medium text-text-primary">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-text-primary">Pinjaman Aktif</h3>
            <Link to="/app/pinjaman" className="ds-link">
              Detail →
            </Link>
          </div>
          {activeLoans.length === 0 ? (
            <p className="mt-5 text-sm leading-relaxed text-text-muted">Belum ada pinjaman aktif</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {activeLoans.map((loan) => (
                <li key={loan.id} className="rounded-xl border border-gray-100 bg-surface px-4 py-3">
                  <p className="font-medium text-text-primary">{loan.purpose}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    Sisa: {formatCurrency(loan.remaining)} · Cicilan {formatCurrency(loan.monthlyPayment)}/bln
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6 border-primary/15 bg-primary text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium">Butuh dana tambahan?</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Ajukan pinjaman online — admin akan meninjau pengajuan Anda
            </p>
          </div>
          <Link to="/app/pengajuan">
            <Button variant="accent" className="whitespace-nowrap">
              Ajukan Sekarang
            </Button>
          </Link>
        </div>
      </Card>

      {applications.length > 0 && (
        <Card className="mt-6">
          <h3 className="font-medium text-text-primary">Riwayat Pengajuan Terbaru</h3>
          <ul className="mt-5 divide-y divide-gray-100">
            {applications.slice(0, 3).map((app) => (
              <li key={app.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0">
                <div>
                  <p className="font-medium text-text-primary">{formatCurrency(app.amount)}</p>
                  <p className="text-sm text-text-muted">
                    {app.purpose} · {formatDate(app.createdAt)}
                  </p>
                </div>
                <Badge status={app.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </DashboardLayout>
  )
}
