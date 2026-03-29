import { createClient } from '@/lib/supabase/server'
import { Users, CreditCard, Clock, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const { count: pendingApprovals } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_approved', false)

  const thisMonth = new Date()
  thisMonth.setDate(1)
  const { count: newThisMonth } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thisMonth.toISOString())

  const stats = [
    { label: 'Total Users', value: totalUsers || 0, icon: <Users className="w-6 h-6 text-sky-400" />, color: 'text-sky-400' },
    { label: 'Active Subscriptions', value: activeSubs || 0, icon: <CreditCard className="w-6 h-6 text-green-400" />, color: 'text-green-400' },
    { label: 'Pending Approvals', value: pendingApprovals || 0, icon: <Clock className="w-6 h-6 text-orange-400" />, color: 'text-orange-400', highlight: true },
    { label: 'New This Month', value: newThisMonth || 0, icon: <TrendingUp className="w-6 h-6 text-purple-400" />, color: 'text-purple-400' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Overview of Flow FX NFC</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-zinc-900 border rounded-2xl p-6 ${stat.highlight && (stat.value as number) > 0 ? 'border-orange-500/30' : 'border-zinc-800'}`}
          >
            <div className="flex items-center gap-2 mb-3">{stat.icon}<span className="text-zinc-400 text-sm">{stat.label}</span></div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
