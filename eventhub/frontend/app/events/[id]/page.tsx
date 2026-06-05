'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Users, Tag, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Badge } from '@/components/Badge'
import { getEvent } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/lib/api'

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await getEvent(Number(id))
        setEvent(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 animate-pulse space-y-4">
          <div className="h-64 bg-[#111118] rounded-2xl" />
          <div className="h-8 bg-[#111118] rounded w-2/3" />
          <div className="h-4 bg-[#111118] rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-28 text-center text-slate-400">
          <p className="text-2xl font-syne font-bold text-white mb-2">Event tidak ditemukan</p>
          <p className="mb-6">Event yang Anda cari tidak ada atau sudah dihapus.</p>
          <Link href="/events" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Kembali ke daftar event
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        {/* Back */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Events
        </Link>

        {/* Banner */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-[#111118]">
          {event.banner_url ? (
            <>
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge status={event.status} />
                  {event.category_detail && (
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${event.category_detail.color}25`,
                        color: event.category_detail.color,
                        border: `1px solid ${event.category_detail.color}40`,
                      }}
                    >
                      {event.category_detail.name}
                    </span>
                  )}
                </div>
                <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-white leading-tight">
                  {event.title}
                </h1>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Calendar size={48} className="text-slate-600 mb-4" />
              <h1 className="font-syne font-extrabold text-3xl text-white text-center px-6">
                {event.title}
              </h1>
            </div>
          )}
        </div>

        {/* Title (if no banner) */}
        {!event.banner_url && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge status={event.status} />
            {event.category_detail && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${event.category_detail.color}25`,
                  color: event.category_detail.color,
                  border: `1px solid ${event.category_detail.color}40`,
                }}
              >
                {event.category_detail.name}
              </span>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-6 bg-[#111118] border border-[#1e1e2e] rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-900/30 rounded-lg mt-0.5">
              <Calendar size={16} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Tanggal</p>
              <p className="text-slate-200 text-sm font-medium">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-900/30 rounded-lg mt-0.5">
              <MapPin size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Lokasi</p>
              <p className="text-slate-200 text-sm font-medium">{event.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-900/30 rounded-lg mt-0.5">
              <UserCircle size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Penyelenggara</p>
              <p className="text-slate-200 text-sm font-medium">{event.organizer}</p>
            </div>
          </div>

          {event.category_detail && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-900/30 rounded-lg mt-0.5">
                <Tag size={16} className="text-pink-400" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Kategori</p>
                <p className="text-slate-200 text-sm font-medium">{event.category_detail.name}</p>
              </div>
            </div>
          )}

          {event.max_participants && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-900/30 rounded-lg mt-0.5">
                <Users size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Maks. Peserta</p>
                <p className="text-slate-200 text-sm font-medium">{event.max_participants} orang</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="font-syne font-bold text-xl text-white mb-4">Deskripsi Event</h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-line">
            {event.description}
          </div>
        </div>
      </div>
    </div>
  )
}
