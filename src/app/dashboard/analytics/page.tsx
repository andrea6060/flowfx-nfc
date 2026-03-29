import { createClient } from '@/lib/supabase/server'
import { Eye, MousePointer, TrendingUp } from 'lucide-react'
import AnalyticsChart from './chart'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count: totalViews } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user!.id)
    .eq('event_type', 'page_view')

  const { count: totalClicks } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user!.id)
    .eq('event_type', 'link_click')

  // Get 30-day data
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentEvents } = await supabase
    .from('analytics_events')
    .select('event_type, created_at')
    .eq('profile_id', user!.id)
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Build chart data
  const chartData: Record<string, { date: string; views: number; clicks: number }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    chartData[key] = { date: key, views: 0, clicks: 0 }
  }
  recentEvents?.forEach((e) => {
    const key = e.created_at.split('T')[0]
    if (chartData[key]) {
      if (e.event_type === 'page_view') chartData[key].views++
      if (e.event_type === 'link_click') chartData[key].clicks++
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-zinc-400 text-sm mt-1">Track your profile performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Views', value: totalViews || 0, icon: <Eye className="w-5 h-5 text-sky-400" />, color: 'text-sky-400' },
          { label: 'Total Clicks', value: totalClicks || 0, icon: <MousePointer className="w-5 h-5 text-purple-400" />, color: 'text-purple-400' },
          {
            label: 'Click Rate',
            value: totalViews ? `${Math.round(((totalClicks || 0) / totalViews) * 100)}%` : '0%',
            icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
            color: 'text-teal-400',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">{stat.icon}<span className="text-zinc-400 text-sm">{stat.label}</span></div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="font-semibold mb-6">Last 30 Days</h2>
        <AnalyticsChart data={Object.values(chartData)} />
      </div>
    </div>
  )
}
