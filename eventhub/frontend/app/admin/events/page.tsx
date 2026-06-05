'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Calendar, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge } from '@/components/Badge'
import { adminGetEvents, adminDeleteEvent } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/lib/api'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetEvents()
      .then(setEvents)
      .catch(() => toast.error('Gagal memuat events.'))
      .finally(() => setLoading(false))
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-white">Events</h1>
          <p className="text-slate-400 mt-1">
            {loading ? 'Memuat...' : `${events.length} event terdaftar`}
          </p>
        </div>
        <Link
          href="/admin/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          <PlusCircle size={16} />
          Tambah Event
        </Link>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] bg-[#0d0d14]">
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Banner</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Judul</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Kategori</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Tanggal</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Status</th>
                <th className="text-center px-6 py-3 text-slate-500 font-medium">Unggulan</th>
                <th className="text-right px-6 py-3 text-slate-500 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e]/50">
                    {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-[#1e1e2e] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    <Calendar size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="font-medium">Belum ada event.</p>
                    <Link href="/admin/events/create" className="text-indigo-400 hover:text-indigo-300 text-sm mt-1 inline-block transition-colors">
                      Buat event pertama
                    </Link>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#1a1a24] transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-16 h-10 bg-[#1e1e2e] rounded-lg overflow-hidden">
                        {event.banner_url ? (
                          <img src={event.banner_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar size={14} className="text-slate-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-slate-200 font-medium line-clamp-1 max-w-[180px]">{event.title}</p>
                    </td>
                    <td className="px-6 py-3">
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
                    <td className="px-6 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-6 py-3">
                      <Badge status={event.status} />
                    </td>
                    <td className="px-6 py-3 text-center">
                      {event.is_featured ? (
                        <Star size={16} className="text-amber-400 mx-auto" fill="currentColor" />
                      ) : (
                        <Star size={16} className="text-slate-700 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-3">
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
      </div>
    </div>
  )
}
