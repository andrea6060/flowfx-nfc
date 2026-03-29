import { createClient } from '@/lib/supabase/server'
import { Eye, MousePointer, Link2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { count: viewCount } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user!.id)
    .eq('event_type', 'page_view')

  const { count: clickCount } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user!.id)
    .eq('event_type', 'link_click')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-zinc-400 text-sm mt-1">Here&apos;s how your profile is performing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Views', value: viewCount || 0, icon: <Eye className="w-5 h-5 text-sky-400" /> },
          { label: 'Total Clicks', value: clickCount || 0, icon: <MousePointer className="w-5 h-5 text-purple-400" /> },
          { label: 'Profile URL', value: `flowfx.us/u/${profile?.username}`, icon: <Link2 className="w-5 h-5 text-teal-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              {stat.icon}
              <span className="text-zinc-400 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Edit Profile', href: '/dashboard/profile', desc: 'Update your name, bio, and contact info' },
          { label: 'Manage Links', href: '/dashboard/links', desc: 'Add or edit your profile links' },
          { label: 'Customize Design', href: '/dashboard/design', desc: 'Choose colors, fonts, and backgrounds' },
          { label: 'Preview Profile', href: '/dashboard/preview', desc: 'See how your profile looks live' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 flex items-center justify-between group transition-colors"
          >
            <div>
              <p className="font-medium">{action.label}</p>
              <p className="text-zinc-400 text-sm">{action.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
