import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { Badge } from './Badge'
import { formatShortDate } from '@/lib/utils'
import type { Event } from '@/lib/api'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-indigo-500/10 group-hover:border-[#2d2d3e] transition-all duration-200">
        {/* Banner */}
        <div className="aspect-video bg-[#1a1a24] overflow-hidden relative">
          {event.banner_url ? (
            <img
              src={event.banner_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar size={32} className="text-slate-700" />
            </div>
          )}
          {event.is_featured && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 text-amber-950 text-xs font-bold rounded-md">
              Unggulan
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge status={event.status} />
            {event.category_detail && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${event.category_detail.color}1a`,
                  color: event.category_detail.color,
                  border: `1px solid ${event.category_detail.color}35`,
                }}
              >
                {event.category_detail.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-syne font-bold text-[#f1f5f9] text-base leading-snug mb-3 line-clamp-2 group-hover:text-white transition-colors">
            {event.title}
          </h3>

          {/* Meta */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar size={13} className="flex-shrink-0 text-indigo-400/70" />
              <span className="truncate">{formatShortDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPin size={13} className="flex-shrink-0 text-emerald-400/70" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
