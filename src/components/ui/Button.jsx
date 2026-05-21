const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-light focus:ring-primary/25 shadow-sm',
  secondary:
    'bg-surface-card text-text-primary border border-gray-200 hover:bg-surface shadow-sm',
  danger: 'bg-danger text-white hover:opacity-90 focus:ring-danger/25 shadow-sm',
  ghost: 'text-text-muted hover:bg-gray-100 hover:text-text-primary',
  accent: 'bg-accent text-primary hover:bg-accent-light focus:ring-accent/30 shadow-sm',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  const isPrimaryCta = variant === 'primary' || variant === 'accent'

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${isPrimaryCta ? 'font-semibold' : ''} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-xl border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  )
}
