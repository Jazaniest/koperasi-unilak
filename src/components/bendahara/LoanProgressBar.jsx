// components/bendahara/LoanProgressBar.jsx

export function LoanProgressBar({ amount, remaining }) {
    const paid = amount - remaining
    const pct = amount > 0 ? (paid / amount) * 100 : 0
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-text-muted whitespace-nowrap">{pct.toFixed(0)}% lunas</span>
        </div>
    )
}