'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CalendarDays } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/events', label: 'Events' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <CalendarDays size={16} className="text-white" />
          </div>
          <span className="font-syne font-extrabold text-xl text-white">
            Event<span className="text-indigo-400">Hub</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-[#1e1e2e]'
                    : 'text-slate-400 hover:text-white hover:bg-[#1e1e2e]/60'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          <Link
            href="/admin/dashboard"
            className="ml-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <LayoutDashboard size={14} />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
