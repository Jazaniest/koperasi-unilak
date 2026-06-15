import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { StatCard, Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { IconWallet, IconLoan, IconFile } from '../../components/ui/Icons'
import { getMemberByUserId } from '../../services/memberService'
import { getMemberSavings } from '../../services/savingsService'
import { getMemberLoans } from '../../services/loanService'
import { getLoanApplications } from '../../services/loanApplicationService'
import { formatCurrency, formatDate } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'
import { submitResignation } from '../../services/memberService'
import { ModalPengunduranDiri } from '../../components/user/ModalPengunduranDiri'

export function UserDashboard() {
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [savings, setSavings] = useState(null)
  const [loans, setLoans] = useState([])
  const [applications, setApplications] = useState([])
  const [showResignModal, setShowResignModal] = useState(false)
  const [resignLoading, setResignLoading] = useState(false)
  const [resignError, setResignError] = useState(null)
  const [resignSuccess, setResignSuccess] = useState(false)

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

  const hasActiveLoans = activeLoans.length > 0
  const isPendingResignation = member?.resignationStatus === 'pending'
  const isApprovedResignation = member?.resignationStatus === 'approved'

  async function handleResignSubmit(reason) {
    setResignLoading(true)
    setResignError(null)
    const result = await submitResignation(reason)
    setResignLoading(false)
    if (result.success) {
      setShowResignModal(false)
      setResignSuccess(true)
      // refresh data member
      getMemberByUserId(user.id).then(setMember)
    } else {
      setResignError(result.error)
    }
  }

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
          subtitle="Wajib + sukarela"
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
        {/* <Card>
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
        </Card> */}

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

      {/* ── Pengunduran Diri ──────────────────────────────────────────────────── */}
      <Card className="mt-6 border border-danger/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium text-text-primary">Pengunduran Diri</h3>
            <p className="mt-1 text-sm text-text-muted leading-relaxed">
              {isPendingResignation
                ? 'Pengajuan pengunduran diri Anda sedang ditinjau oleh bendahara.'
                : isApprovedResignation
                  ? 'Pengunduran diri Anda telah disetujui.'
                  : 'Ajukan pengunduran diri dari keanggotaan koperasi.'}
            </p>
            {resignError && (
              <p className="mt-2 text-sm text-danger">{resignError}</p>
            )}
            {resignSuccess && (
              <p className="mt-2 text-sm text-success">
                Pengajuan berhasil dikirim. Menunggu persetujuan bendahara.
              </p>
            )}
          </div>
          {!isPendingResignation && !isApprovedResignation && (
            <button
              onClick={() => { setResignError(null); setShowResignModal(true) }}
              className="shrink-0 rounded-xl border border-danger/30 bg-danger/8 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/15"
            >
              Ajukan
            </button>
          )}
          {isPendingResignation && (
            <span className="shrink-0 rounded-xl border border-warning/30 bg-warning/8 px-3 py-1.5 text-xs font-medium text-warning">
              Menunggu Tinjauan
            </span>
          )}
        </div>
      </Card>

      <ModalPengunduranDiri
        open={showResignModal}
        onClose={() => setShowResignModal(false)}
        onSubmit={handleResignSubmit}
        loading={resignLoading}
        hasActiveLoans={hasActiveLoans}
      />
    </DashboardLayout>
  )
}
