export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'Anggota',
  bendahara: 'Bendahara',
}

export const STATUS_COLORS = {
  pending: 'bg-warning/10 text-warning ring-warning/25',
  approved: 'bg-success/10 text-success ring-success/25',
  rejected: 'bg-danger/10 text-danger ring-danger/25',
  active: 'bg-success/10 text-success ring-success/25',
  inactive: 'bg-gray-100 text-text-muted ring-gray-200',
  lunas: 'bg-primary/10 text-primary ring-primary/25',
}

export const STATUS_LABELS = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  active: 'Aktif',
  inactive: 'Nonaktif',
  lunas: 'Lunas',
}
