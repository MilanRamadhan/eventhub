interface BadgeProps {
  status: 'upcoming' | 'ongoing' | 'done'
  className?: string
}

const config: Record<BadgeProps['status'], { label: string; className: string }> = {
  upcoming: {
    label: 'Upcoming',
    className: 'bg-blue-950/60 text-blue-300 border border-blue-800/60',
  },
  ongoing: {
    label: 'Berlangsung',
    className: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60',
  },
  done: {
    label: 'Selesai',
    className: 'bg-slate-800/60 text-slate-400 border border-slate-700/60',
  },
}

export function Badge({ status, className = '' }: BadgeProps) {
  const { label, className: base } = config[status] || config.done
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${base} ${className}`}>
      {label}
    </span>
  )
}
