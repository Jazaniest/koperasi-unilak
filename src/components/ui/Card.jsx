export function Card({ children, className = '', highlight = false }) {
  return (
    <div
      className={`ds-card transition-shadow ${highlight ? 'border-primary/15 ring-1 ring-primary/10' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

const accentStyles = {
  primary: {
    icon: 'bg-primary text-white',
    value: 'text-text-primary',
  },
  accent: {
    icon: 'bg-accent text-primary',
    value: 'text-text-primary',
  },
  success: {
    icon: 'bg-success/10 text-success',
    value: 'text-success',
  },
  warning: {
    icon: 'bg-warning/10 text-warning',
    value: 'text-warning',
  },
  danger: {
    icon: 'bg-danger/10 text-danger',
    value: 'text-danger',
  },
}

export function StatCard({ title, value, subtitle, icon: Icon, accent = 'primary' }) {
  const style = accentStyles[accent] ?? accentStyles.primary

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="ds-label">{title}</p>
          <p className={`ds-display-value mt-2 ${style.value}`}>{value}</p>
          {subtitle && <p className="mt-2 text-xs leading-relaxed text-text-muted">{subtitle}</p>}
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  )
}
