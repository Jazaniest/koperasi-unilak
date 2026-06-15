import { IconHome, IconUsers, IconNews } from '../ui/Icons'

export const AdminNavbar = [
    { to: '/admin', label: 'Dashboard', icon: IconHome, end: true },
    { to: '/admin/anggota', label: 'Anggota', icon: IconUsers },
    { to: '/admin/pendaftaran', label: 'Pendaftaran', icon: IconUsers },
    { to: '/admin/berita', label: 'Berita', icon: IconNews },
]