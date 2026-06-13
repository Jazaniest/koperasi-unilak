import { useParams, Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { getMemberById } from '../../services/memberService'
import { SAVINGS_TYPE_LABELS } from '../../services/savingsService'
import { formatCurrency, formatDate } from '../../utils/format'
import { AdminNavbar } from '../../components/admin/AdminNavbar'
import { useState, useEffect } from 'react'

export function AdminMemberDetailPage() {
  const { id } = useParams()
  const [member, setMember] = useState(null)

  useEffect(() => {
    getMemberById(id).then(setMember)
  }, [id])

  if (!member) {
    return (
      <DashboardLayout title="Anggota tidak ditemukan" navItems={AdminNavbar}>
        <Link to="/admin/anggota">
          <Button variant="secondary">← Kembali</Button>
        </Link>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={member.name} subtitle={member.memberNumber} navItems={AdminNavbar}>
      <Link to="/admin/anggota" className="mb-5 inline-block ds-link">
        ← Kembali ke daftar
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h3 className="font-medium text-text-primary">Profil Anggota</h3>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-text-muted">NIK</dt>
              <dd className="mt-0.5 font-medium text-text-primary">{member.nik}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Email</dt>
              <dd className="mt-0.5 font-medium text-text-primary">{member.email}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Telepon</dt>
              <dd className="mt-0.5 font-medium text-text-primary">{member.phone}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Alamat</dt>
              <dd className="mt-0.5 font-medium leading-relaxed text-text-primary">{member.address}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Pekerjaan</dt>
              <dd className="mt-0.5 font-medium text-text-primary">{member.occupation}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Penghasilan/bulan</dt>
              <dd className="mt-0.5 font-medium text-text-primary">{formatCurrency(member.monthlyIncome)}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Bergabung</dt>
              <dd className="mt-0.5 font-medium text-text-primary">{formatDate(member.joinDate)}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Status</dt>
              <dd className="mt-1">
                <Badge status={member.status} />
              </dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <Card highlight>
              <p className="ds-label">Total Simpanan</p>
              <p className="ds-display-value mt-2 text-success">{formatCurrency(member.totalSavings)}</p>
            </Card>
            <Card>
              <p className="ds-label">Sisa Pinjaman Aktif</p>
              <p className="ds-display-value mt-2 text-primary">{formatCurrency(member.totalLoanRemaining)}</p>
            </Card>
          </div>

          <Card>
            <h3 className="font-medium text-text-primary">Riwayat Simpanan</h3>
            <ul className="mt-4 divide-y divide-gray-50 text-sm">
              {member.savings.map((s) => (
                <li key={s.id} className="flex justify-between gap-4 py-3">
                  <span className="text-text-muted">
                    {SAVINGS_TYPE_LABELS[s.type]} — {s.description}
                  </span>
                  <span className="shrink-0 font-medium text-success">+{formatCurrency(s.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary">Pinjaman</h3>
            {member.loans.length === 0 ? (
              <p className="mt-4 text-sm text-text-muted">Tidak ada pinjaman</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {member.loans.map((l) => (
                  <li key={l.id} className="rounded-xl border border-gray-100 bg-surface px-4 py-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-text-primary">{l.purpose}</span>
                      <Badge status={l.status} />
                    </div>
                    <p className="mt-1 text-text-muted">
                      {formatCurrency(l.amount)} · sisa {formatCurrency(l.remaining)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary">Pengajuan Pinjaman</h3>
            <ul className="mt-4 space-y-3">
              {member.loanApplications.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between gap-3 rounded-xl border border-gray-100 bg-surface px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-text-primary">{formatCurrency(a.amount)}</p>
                    <p className="text-text-muted">{a.purpose}</p>
                  </div>
                  <Badge status={a.status} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
