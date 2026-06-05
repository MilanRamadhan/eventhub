'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Layers } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { EventCard } from '@/components/EventCard'
import { getFeaturedEvents, getEvents, getCategories } from '@/lib/api'
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

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [featured, upcoming, cats] = await Promise.all([
          getFeaturedEvents(),
          getEvents({ status: 'upcoming' }),
          getCategories(),
        ])
        setFeaturedEvents(featured)
        setUpcomingEvents(upcoming.slice(0, 6))
        setCategories(cats)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0a0a0f] to-[#0a0a0f]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/30 border border-indigo-800/50 rounded-full text-indigo-300 text-sm font-medium mb-8">
            <CalendarDays size={14} />
            <span>Platform Event Kampus Terpercaya</span>
          </div>

          <h1 className="font-syne font-extrabold text-5xl md:text-7xl text-white leading-tight mb-6 max-w-4xl">
            Temukan Event<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Kampus Terbaik
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Platform informasi dan manajemen event kampus yang modern. Temukan seminar,
            workshop, lomba, dan kegiatan menarik lainnya di satu tempat.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-indigo-glow"
            >
              Jelajahi Event
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/events?status=upcoming"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#1e1e2e] hover:border-indigo-500/50 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200"
            >
              Event Mendatang
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-sm">
            {[
              { label: 'Event Aktif', value: '50+' },
              { label: 'Kategori', value: '10+' },
              { label: 'Peserta', value: '5K+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-syne font-bold text-3xl text-white">{stat.value}</p>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">Pilihan Editor</p>
              <h2 className="font-syne font-bold text-3xl md:text-4xl text-white">Event Unggulan</h2>
            </div>
            <Link
              href="/events"
              className="hidden md:inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              Lihat semua
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p>Belum ada event unggulan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">Temukan Berdasarkan</p>
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-white">Jelajahi Kategori</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-[#111118] border border-[#1e1e2e] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/events?category=${cat.id}`}
                  className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-[#1e1e2e] hover:border-opacity-0 transition-all duration-200 text-center"
                  style={{
                    background: `${cat.color}12`,
                    borderColor: `${cat.color}30`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}25` }}
                  >
                    <Layers size={18} style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:opacity-90">{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">Yang Akan Datang</p>
              <h2 className="font-syne font-bold text-3xl md:text-4xl text-white">Event Mendatang</h2>
            </div>
            <Link
              href="/events?status=upcoming"
              className="hidden md:inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              Lihat semua
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p>Belum ada event mendatang.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#1e1e2e] hover:border-indigo-500/50 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200"
            >
              Lihat Semua Event
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-syne font-extrabold text-xl text-white">
              Event<span className="text-indigo-400">Hub</span>
            </span>
            <p className="text-slate-500 text-sm mt-1">Platform informasi event kampus.</p>
          </div>
          <p className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
