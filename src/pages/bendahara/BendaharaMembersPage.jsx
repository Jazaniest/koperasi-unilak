import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { getAllMembers } from '../../services/memberService'
import { formatCurrency } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'

export function BendaharaMembersPage() {
    const [search, setSearch] = useState('')
    const [members, setMembers] = useState([])

    useEffect(() => {
        getAllMembers().then(setMembers)
    }, [])
    const filtered = members.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.memberNumber.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <DashboardLayout title="Daftar Anggota" subtitle={`${members.length} anggota terdaftar`} navItems={BendaharaNavbar}>
            <Card className="mb-6">
                <Input
                    placeholder="Cari nama, no. anggota, atau email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Card>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((member) => (
                    <Link key={member.id} to={`/bendahara/anggota/${member.id}`}>
                        <Card className="h-full transition hover:border-primary/20 hover:shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div className="ds-avatar h-12 w-12 text-sm">
                                    {member.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join('')}
                                </div>
                                <Badge status={member.status} />
                            </div>
                            <h3 className="mt-4 font-medium text-text-primary">{member.name}</h3>
                            <p className="text-sm text-text-muted">{member.memberNumber}</p>
                            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                                <div className="rounded-xl border border-gray-100 bg-surface px-3 py-2.5">
                                    <p className="text-text-muted">Simpanan</p>
                                    <p className="mt-1 font-medium text-success">{formatCurrency(member.totalSavings)}</p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-surface px-3 py-2.5">
                                    <p className="text-text-muted">Pinjaman</p>
                                    <p className="mt-1 font-medium text-primary">{formatCurrency(member.totalLoanRemaining)}</p>
                                </div>
                            </div>
                            {member.pendingApplications > 0 && (
                                <p className="mt-4 text-xs font-medium text-warning">
                                    {member.pendingApplications} pengajuan pending
                                </p>
                            )}
                        </Card>
                    </Link>
                ))}
            </div>
        </DashboardLayout>
    )
}
