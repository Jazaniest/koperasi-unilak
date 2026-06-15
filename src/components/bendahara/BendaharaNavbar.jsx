import { IconHome, IconFile, IconUsers, IconRefresh, IconLoan, IconHistory } from '../ui/Icons'

export const BendaharaNavbar = [
    { to: '/bendahara',                  label: 'Dashboard',          icon: IconHome,    end: true },
    { to: '/bendahara/pengajuan',        label: 'Pengajuan Pinjaman', icon: IconFile },
    { to: '/bendahara/topup',            label: 'Top Up Pinjaman',    icon: IconRefresh },
    { to: '/bendahara/pinjaman',         label: 'Kelola Pinjaman',    icon: IconLoan },
    { to: '/bendahara/riwayat',          label: 'Riwayat & Laporan',  icon: IconHistory },
    { to: '/bendahara/anggota',          label: 'Anggota',            icon: IconUsers },
    { to: '/bendahara/pengunduran-diri', label: 'Pengunduran Diri',   icon: IconUsers },
]