export function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-text-primary">{label}</span>}
      <input
        className={`ds-input ${error ? 'border-danger focus:ring-danger/20' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </label>
  )
}

export function Textarea({ label, error, className = '', rows = 4, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-text-primary">{label}</span>}
      <textarea
        rows={rows}
        className={`ds-input resize-y ${error ? 'border-danger focus:ring-danger/20' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </label>
  )
}

export function Select({ label, error, options, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-text-primary">{label}</span>}
      <select
        className={`ds-input ${error ? 'border-danger focus:ring-danger/20' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </label>
  )
}
