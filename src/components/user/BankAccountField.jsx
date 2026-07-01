import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { updateBankAccount } from '../../services/memberService'

export function BankAccountField({ member, onUpdated }) {
    const hasAccount = Boolean(member?.bankName && member?.bankAccountNumber)
    const [editing, setEditing] = useState(!hasAccount)
    const [form, setForm] = useState({
        bankName: member?.bankName ?? '',
        bankAccountNumber: member?.bankAccountNumber ?? '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setError('')
        if (!form.bankName.trim() || !form.bankAccountNumber.trim()) {
            setError('Nama bank dan nomor rekening wajib diisi')
            return
        }

        setLoading(true)
        const result = await updateBankAccount(form)
        setLoading(false)

        if (result.success) {
            setEditing(false)
            onUpdated?.(result.member)
        } else {
            setError(result.error)
        }
    }

    if (!editing) {
        return (
            <div className="rounded-xl border border-gray-100 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs text-text-muted">Rekening untuk pencairan dana</p>
                        <p className="mt-1 font-medium text-text-primary">{member.bankName}</p>
                        <p className="text-sm text-text-muted">{member.bankAccountNumber}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="shrink-0 text-sm font-medium text-primary hover:underline"
                    >
                        Ubah
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-gray-100 bg-surface p-4 space-y-3">
            <p className="text-xs font-medium text-text-muted">
                {hasAccount ? 'Ubah rekening untuk pencairan dana' : 'Lengkapi rekening untuk pencairan dana'}
            </p>
            <Input
                label="Nama Bank"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="contoh: BRI, BCA, Mandiri"
            />
            <Input
                label="Nomor Rekening"
                value={form.bankAccountNumber}
                onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                placeholder="contoh: 1234567890"
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <div className="flex gap-2">
                <Button type="button" onClick={handleSave} loading={loading} className="flex-1">
                    Simpan Rekening
                </Button>
                {hasAccount && (
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-text-muted hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                )}
            </div>
        </div>
    )
}