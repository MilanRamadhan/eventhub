interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  iconBg: string
}

export function StatCard({ icon, label, value, iconBg }: StatCardProps) {
  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 flex items-center gap-4 hover:border-[#2d2d3e] transition-colors">
      <div className={`p-3 rounded-xl ${iconBg} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[#64748b] text-xs font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-[#f1f5f9] text-3xl font-extrabold font-syne leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  )
}
