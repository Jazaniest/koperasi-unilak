import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { StatCard, Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { IconUsers, IconFile, IconLoan, IconWallet } from '../../components/ui/Icons'
import { getAdminStats } from '../../services/memberService'
import { getLoanApplications } from '../../services/loanService'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { AdminNavbar } from '../../components/admin/AdminNavbar'

export function AdminDashboard() {
  const stats = getAdminStats()
  const pendingApps = getLoanApplications({ status: 'pending' })

  return (
    <DashboardLayout
      title="Dashboard Admin"
      subtitle="Kelola anggota dan persetujuan pinjaman"
      navItems={AdminNavbar}
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Anggota"
          value={stats.totalMembers}
          subtitle={`${stats.activeMembers} aktif`}
          icon={IconUsers}
          accent="primary"
        />
        <StatCard
          title="Pengajuan Pending"
          value={stats.pendingApplications}
          subtitle="Perlu ditinjau"
          icon={IconFile}
          accent="warning"
        />
        <StatCard
          title="Total Simpanan"
          value={formatCurrency(stats.totalSavings)}
          icon={IconWallet}
          accent="success"
        />
        <StatCard
          title="Total Pinjaman Aktif"
          value={formatCurrency(stats.totalLoans)}
          accent="accent"
          icon={IconLoan}
        />
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-medium text-text-primary">Pengajuan Menunggu Persetujuan</h3>
          <Link to="/admin/pengajuan" className="ds-link">
            Lihat semua →
          </Link>
        </div>
        {pendingApps.length === 0 ? (
          <p className="mt-5 text-sm leading-relaxed text-text-muted">Tidak ada pengajuan pending</p>
        ) : (
          <ul className="mt-5 divide-y divide-gray-100">
            {pendingApps.slice(0, 5).map((app) => (
              <li key={app.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium text-text-primary">{app.memberName}</p>
                  <p className="text-sm text-text-muted">
                    {formatCurrency(app.amount)} · {app.purpose}
                  </p>
                  <p className="text-xs text-text-muted">{formatDateTime(app.createdAt)}</p>
                </div>
                <Badge status="pending" />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardLayout>
  )
}
