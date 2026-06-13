// components/bendahara/SavingsTypeBadge.jsx

const SAVINGS_TYPE_LABEL = {
    pokok: { label: 'Pokok', color: 'bg-primary/10 text-primary' },
    wajib: { label: 'Wajib', color: 'bg-accent/15 text-accent' },
    sukarela: { label: 'Sukarela', color: 'bg-success/10 text-success' },
}

export function SavingsTypeBadge({ type }) {
    const t = SAVINGS_TYPE_LABEL[type] ?? { label: type, color: 'bg-gray-100 text-gray-600' }
    return (
        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium ${t.color}`}>
            {t.label}
        </span>
    )
}