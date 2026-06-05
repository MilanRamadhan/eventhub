'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutGrid, Clock, Play, CheckCircle, Pencil, Trash2, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { StatCard } from '@/components/StatCard'
import { Badge } from '@/components/Badge'
import { adminGetStats, adminGetEvents, adminDeleteEvent } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Stats, Event } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, upcoming: 0, ongoing: 0, done: 0 })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [s, e] = await Promise.all([adminGetStats(), adminGetEvents()])
        setStats(s)
        setEvents(e.slice(0, 8))
      } catch (err) {
        toast.error('Gagal memuat data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Hapus event "${title}"?`)) return
    try {
      await adminDeleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
      toast.success('Event berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus event.')
    }
  }

  const statCards = [
    { icon: <LayoutGrid size={20} className="text-indigo-400" />, label: 'Total Event', value: stats.total, iconBg: 'bg-indigo-900/40' },
    { icon: <Clock size={20} className="text-amber-400" />, label: 'Upcoming', value: stats.upcoming, iconBg: 'bg-amber-900/40' },
    { icon: <Play size={20} className="text-emerald-400" />, label: 'Berlangsung', value: stats.ongoing, iconBg: 'bg-emerald-900/40' },
    { icon: <CheckCircle size={20} className="text-slate-400" />, label: 'Selesai', value: stats.done, iconBg: 'bg-slate-800/60' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Selamat datang kembali di EventHub Admin.</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#111118] border border-[#1e1e2e] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card) => (
            <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} iconBg={card.iconBg} />
          ))}
        </div>
      )}

      {/* Recent Events Table */}
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
          <h2 className="font-syne font-bold text-lg text-white">Event Terbaru</h2>
          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <PlusCircle size={15} />
            Tambah Event
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Judul</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Kategori</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Tanggal</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Status</th>
                <th className="text-right px-6 py-3 text-slate-500 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e]/50">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-[#1e1e2e] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Belum ada event. Buat event pertama Anda.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#1a1a24] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-slate-200 font-medium line-clamp-1 max-w-[200px]">{event.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      {event.category_detail ? (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${event.category_detail.color}20`,
                            color: event.category_detail.color,
                          }}
                        >
                          {event.category_detail.name}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={event.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="p-2 bg-[#1e1e2e] hover:bg-indigo-900/40 hover:text-indigo-400 text-slate-400 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          className="p-2 bg-[#1e1e2e] hover:bg-red-900/40 hover:text-red-400 text-slate-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {events.length > 0 && (
          <div className="px-6 py-3 border-t border-[#1e1e2e]">
            <Link href="/admin/events" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
              Lihat semua event
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
