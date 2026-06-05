'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  Tag,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '@/lib/api'
import { removeToken } from '@/lib/auth'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/categories', label: 'Kategori', icon: Tag },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // token mungkin sudah expired, lanjut saja
    }
    removeToken()
    toast.success('Logout berhasil.')
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0d0d14] border-r border-[#1e1e2e] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-[#1e1e2e]">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <CalendarDays size={16} className="text-white" />
        </div>
        <span className="font-syne font-extrabold text-xl text-white">
          Event<span className="text-indigo-400">Hub</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="text-slate-600 text-xs font-medium uppercase tracking-widest px-3 mb-3">Menu</p>

        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border-l-2 border-indigo-500 pl-[10px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e1e2e]/60 border-l-2 border-transparent pl-[10px]'
                }
              `}
            >
              <Icon size={17} className={isActive ? 'text-indigo-400' : ''} />
              {label}
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-[#1e1e2e]">
          <p className="text-slate-600 text-xs font-medium uppercase tracking-widest px-3 mb-3">Lainnya</p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 pl-[10px] rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-[#1e1e2e]/60 transition-all duration-150 border-l-2 border-transparent"
          >
            <ExternalLink size={17} />
            Lihat Website
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#1e1e2e]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/15 transition-all duration-150"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  )
}
