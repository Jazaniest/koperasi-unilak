import { useParams, Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { getMemberById } from '../../services/memberService'
import { SAVINGS_TYPE_LABELS } from '../../services/savingsService'
import { formatCurrency, formatDate } from '../../utils/format'
import { BendaharaNavbar } from '../../components/bendahara/BendaharaNavbar'
import { useState } from 'react'                          // ← tambah
import { useAuth } from '../../context/AuthContext'       // ← tambah
import { settleLoan } from '../../services/loanService'   // ← tambah

export function BendaharaMemberDetailPage() {
    const { id } = useParams()
    const member = getMemberById(id)
    const { user } = useAuth()
    const [confirmLoanId, setConfirmLoanId] = useState(null)
    const [settling, setSettling] = useState(false)
    const [settleError, setSettleError] = useState(null)
    const [memberData, setMemberData] = useState(member)   // ← ganti `member` → `memberData` di seluruh JSX

    async function handleSettle() {
        setSettling(true)
        setSettleError(null)
        await new Promise((r) => setTimeout(r, 500))
        const result = settleLoan(confirmLoanId, user.id)
        setSettling(false)
        if (result.success) {
            setConfirmLoanId(null)
            setMemberData(getMemberById(id))   // refresh data anggota
        } else {
            setSettleError(result.error)
        }
    }

    if (!member) {
        return (
            <DashboardLayout title="Anggota tidak ditemukan" navItems={BendaharaNavbar}>
                <Link to="/bendahara/anggota">
                    <Button variant="secondary">← Kembali</Button>
                </Link>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title={member.name} subtitle={member.memberNumber} navItems={BendaharaNavbar}>
            <Link to="/bendahara/anggota" className="mb-5 inline-block ds-link">
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
                        {memberData.loans.length === 0 ? (
                            <p className="mt-4 text-sm text-text-muted">Tidak ada pinjaman</p>
                        ) : (
                            <ul className="mt-4 space-y-3">
                                {memberData.loans.map((l) => (
                                    <li key={l.id} className="rounded-xl border border-gray-100 bg-surface px-4 py-3 text-sm">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="font-medium text-text-primary">{l.purpose}</span>
                                            <Badge status={l.status} />
                                        </div>
                                        <p className="mt-1 text-text-muted">
                                            {formatCurrency(l.amount)} · sisa{' '}
                                            <span className="font-medium text-primary">{formatCurrency(l.remaining)}</span>
                                        </p>

                                        {l.status === 'active' && (
                                            <button
                                                type="button"
                                                onClick={() => { setConfirmLoanId(l.id); setSettleError(null) }}
                                                className="mt-3 w-full rounded-xl border border-accent/30 bg-accent/8 px-3 py-2 text-xs font-medium text-accent transition hover:bg-accent/15"
                                            >
                                                Lunasi Sekarang — {formatCurrency(l.remaining)}
                                            </button>
                                        )}

                                        {l.status === 'lunas' && l.settledAt && (
                                            <p className="mt-2 text-xs text-text-muted">
                                                Dilunasi: <span className="text-text-primary">{formatDate(l.settledAt)}</span>
                                            </p>
                                        )}
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

            {confirmLoanId && (() => {
                const loan = memberData.loans.find((l) => l.id === confirmLoanId)
                if (!loan) return null
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                            onClick={() => !settling && setConfirmLoanId(null)}
                        />
                        <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-surface-card p-6 shadow-xl animate-fade-in">
                            <h3 className="font-medium text-text-primary">Konfirmasi Pelunasan</h3>
                            <p className="mt-2 text-sm text-text-muted leading-relaxed">
                                Melunasi pinjaman <span className="font-medium text-text-primary">{loan.purpose}</span> milik{' '}
                                <span className="font-medium text-text-primary">{memberData.name}</span> sebesar{' '}
                                <span className="font-medium text-primary">{formatCurrency(loan.remaining)}</span>.
                                Tindakan ini tidak dapat dibatalkan.
                            </p>

                            {settleError && (
                                <p className="mt-3 rounded-xl bg-danger/8 border border-danger/20 px-4 py-2.5 text-sm text-danger">
                                    {settleError}
                                </p>
                            )}

                            <div className="mt-5 flex gap-3 justify-end">
                                <button
                                    onClick={() => setConfirmLoanId(null)}
                                    disabled={settling}
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSettle}
                                    disabled={settling}
                                    className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light disabled:opacity-60"
                                >
                                    {settling ? 'Memproses...' : 'Ya, Lunasi Sekarang'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })()}
        </DashboardLayout>
    )
}
