import { Link } from 'react-router-dom'
import { IconLogo } from '../ui/Icons'

export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-gray-100 bg-surface-card">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3">
                            <IconLogo />
                            <div>
                                <p className="text-sm font-medium text-text-primary">Koperasi Unilak</p>
                                <p className="text-xs text-text-muted">Sistem Manajemen</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-text-muted max-w-sm">
                            Koperasi Simpan Pinjam Universitas Lancang Kuning — melayani kebutuhan keuangan sivitas akademika
                            dengan transparan, amanah, dan profesional.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4">Navigasi</p>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/" className="ds-link text-text-muted hover:text-text-primary transition">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link to="/visi-misi" className="ds-link text-text-muted hover:text-text-primary transition">
                                    Visi &amp; Misi
                                </Link>
                            </li>
                            <li>
                                <Link to="/struktur-pengurus" className="ds-link text-text-muted hover:text-text-primary transition">
                                    Struktur Pengurus
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-4">Kontak</p>
                        <ul className="space-y-3 text-sm text-text-muted">
                            <li>Jl. Yos Sudarso KM. 8,<br />Pekanbaru, Riau 28284</li>
                            <li>koperasi@unilak.ac.id</li>
                            <li>(0761) 51506</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
                    <p>© {year} Koperasi Unilak. Seluruh hak cipta dilindungi.</p>
                    <p>Universitas Lancang Kuning</p>
                </div>
            </div>
        </footer>
    )
}