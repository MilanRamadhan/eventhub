'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, CalendarDays } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { EventCard } from '@/components/EventCard'
import { getEvents, getCategories } from '@/lib/api'
import type { Event, Category } from '@/lib/api'

function SkeletonCard() {
  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-[#1e1e2e]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#1e1e2e] rounded w-3/4" />
        <div className="h-3 bg-[#1e1e2e] rounded w-1/2" />
        <div className="h-3 bg-[#1e1e2e] rounded w-2/3" />
      </div>
    </div>
  )
}

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Berlangsung' },
  { value: 'done', label: 'Selesai' },
]

export default function EventsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '')

  const fetchEvents = useCallback(async (cat: string, stat: string, q: string) => {
    setLoading(true)
    try {
      const data = await getEvents({
        category: cat || undefined,
        status: stat || undefined,
        search: q || undefined,
      })
      setEvents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    fetchEvents(selectedCategory, selectedStatus, search)
  }, [selectedCategory, selectedStatus, fetchEvents])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEvents(selectedCategory, selectedStatus, search)
  }

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val)
  }

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-syne font-bold text-4xl text-white mb-2">Semua Event</h1>
          <p className="text-slate-400">
            {loading ? 'Memuat...' : `${events.length} event ditemukan`}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 bg-[#111118] border border-[#1e1e2e] rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mr-2">
            <SlidersHorizontal size={16} />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-[#0a0a0f] border border-[#1e1e2e] text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[#0a0a0f] border border-[#1e1e2e] text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] text-slate-300 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-400">Tidak ada event ditemukan</p>
            <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
