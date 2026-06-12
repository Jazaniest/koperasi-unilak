import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IconLogo, IconMenu, IconClose } from '../ui/Icons'
import { Button } from '../ui/Button'

const navLinks = [
    { to: '/', label: 'Beranda', end: true },
    { to: '/visi-misi', label: 'Visi & Misi' },
    { to: '/struktur-pengurus', label: 'Struktur Pengurus' },
]

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-surface-card/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
                <Link to="/" className="flex items-center gap-3 shrink-0">
                    <IconLogo />
                    <div>
                        <p className="text-sm font-medium text-text-primary leading-tight">KoperasiUnilak</p>
                        <p className="text-xs text-text-muted leading-tight">Sistem Manajemen</p>
                    </div>
                </Link>

                <nav className="hidden lg:flex flex-1 items-center gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `rounded-xl px-4 py-2 text-sm font-medium transition ${isActive
                                    ? 'bg-primary/8 text-primary'
                                    : 'text-text-muted hover:bg-gray-50 hover:text-text-primary'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-3 ml-auto">
                    <Link to="/login">
                        <Button variant="ghost">Masuk</Button>
                    </Link>
                </div>

                <button
                    type="button"
                    className="ml-auto rounded-lg p-2 text-text-muted hover:bg-gray-100 lg:hidden"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <IconClose /> : <IconMenu />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-gray-100 bg-surface-card px-6 py-4 lg:hidden">
                    <nav className="space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                                        ? 'bg-primary/8 text-primary'
                                        : 'text-text-muted hover:bg-gray-50 hover:text-text-primary'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                            <Button variant="ghost" className="w-full justify-center">
                                Masuk
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}