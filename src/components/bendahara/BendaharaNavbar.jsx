import { IconHome, IconFile, IconUsers } from '../ui/Icons'

export const BendaharaNavbar = [
    { to: '/bendahara', label: 'Dashboard', icon: IconHome, end: true },
    { to: '/bendahara/pengajuan', label: 'Pengajuan Pinjaman', icon: IconFile },
    { to: '/bendahara/anggota', label: 'Anggota', icon: IconUsers },

]