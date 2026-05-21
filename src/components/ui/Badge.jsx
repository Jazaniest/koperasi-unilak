import { STATUS_COLORS, STATUS_LABELS } from '../../utils/format'

export function Badge({ status, label }) {
  const text = label ?? STATUS_LABELS[status] ?? status
  const color = STATUS_COLORS[status] ?? 'bg-gray-100 text-text-muted ring-gray-200'

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${color}`}
    >
      {text}
    </span>
  )
}
