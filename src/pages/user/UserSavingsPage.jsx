import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { getMemberByUserId } from '../../services/memberService'
import { getMemberSavings, SAVINGS_TYPE_LABELS } from '../../services/savingsService'
import { formatCurrency, formatDate } from '../../utils/format'
import { UserNavbar } from '../../components/user/UserNavbar'

export function UserSavingsPage() {
  const { user } = useAuth()
  // const [member, setMember] = useState(null)
  const [savings, setSavings] = useState(null)

  useEffect(() => {
    getMemberByUserId(user.id).then(async (m) => {
      // setMember(m)
      if (m) getMemberSavings(m.id).then(setSavings)
    })
  }, [user.id])

  return (
    <DashboardLayout title="Simpanan Saya" subtitle="Riwayat dan rincian simpanan" navItems={UserNavbar}>
      <div className="mb-6 grid gap-5 sm:grid-cols-3">
        {savings &&
          Object.entries(savings.byType).map(([type, amount]) => (
            <Card key={type} highlight={type === 'sukarela'}>
              <p className="ds-label">{SAVINGS_TYPE_LABELS[type]}</p>
              <p className="ds-display-value mt-2">{formatCurrency(amount)}</p>
            </Card>
          ))}
      </div>

      <Card>
        <h3 className="font-medium text-text-primary">Riwayat Transaksi</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-120 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-text-muted">
                <th className="pb-3 pr-4 font-medium">Tanggal</th>
                <th className="pb-3 pr-4 font-medium">Jenis</th>
                <th className="pb-3 pr-4 font-medium">Keterangan</th>
                <th className="pb-3 text-right font-medium">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {savings?.records.map((r) => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 text-text-muted">{formatDate(r.date)}</td>
                  <td className="py-3 pr-4 capitalize text-text-primary">{r.type}</td>
                  <td className="py-3 pr-4 text-text-muted">{r.description}</td>
                  <td className="py-3 text-right font-medium text-success">
                    +{formatCurrency(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-5 font-medium text-text-primary">
                  Total
                </td>
                <td className="pt-5 text-right">
                  <span className="ds-display-value text-success">
                    {formatCurrency(savings?.total ?? 0)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
