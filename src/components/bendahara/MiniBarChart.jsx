// components/bendahara/MiniBarChart.jsx

export function MiniBarChart({ data }) {
    const max = Math.max(...data.map((d) => d.value), 1)
    return (
        <div className="flex items-end gap-1.5 h-16">
            {data.map((d, i) => {
                const pct = (d.value / max) * 100
                const isLast = i === data.length - 1
                return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div
                            className="w-full rounded-t-sm transition-all duration-500"
                            style={{
                                height: `${Math.max(pct, 4)}%`,
                                backgroundColor: isLast
                                    ? 'var(--color-accent)'
                                    : 'var(--color-primary)',
                                opacity: isLast ? 1 : 0.25 + (i / data.length) * 0.6,
                            }}
                        />
                        <span className="text-[10px] text-text-muted leading-none">{d.label}</span>
                    </div>
                )
            })}
        </div>
    )
}