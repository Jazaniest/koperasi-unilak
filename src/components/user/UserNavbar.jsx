import { IconFile, IconHome, IconLoan, IconWallet, IconRefresh } from '../ui/Icons'

export const UserNavbar = [
    { to: '/app', label: 'Beranda', icon: IconHome, end: true },
    { to: '/app/simpanan', label: 'Simpanan', icon: IconWallet },
    { to: '/app/pinjaman', label: 'Pinjaman', icon: IconLoan },
    { to: '/app/pengajuan', label: 'Ajukan Pinjaman', icon: IconFile },
    { to: '/app/topup', label: 'Top Up Pinjaman', icon: IconRefresh },   // ← tambah

]