import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import AdminUserActions from './actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const sub = (profile.subscriptions as Array<{ plan: string; status: string; stripe_customer_id: string }>)?.[0]

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{profile.full_name || 'User Detail'}</h1>
        {profile.username && (
          <Link
            href={`/u/${profile.username}`}
            target="_blank"
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm"
          >
            View Profile <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Profile Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Email', profile.email],
              ['Username', `@${profile.username}`],
              ['Company', profile.company],
              ['Job Title', profile.job_title],
              ['Phone', profile.phone],
              ['Website', profile.website_url],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-zinc-500 text-xs mb-1">{label}</p>
                <p className="text-white truncate">{value || '-'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Account Status</h2>
          <div className="flex items-center gap-3 mb-4">
            <Badge className={profile.is_approved ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}>
              {profile.is_approved ? 'Approved' : 'Pending'}
            </Badge>
            <Badge className={profile.is_published ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}>
              {profile.is_published ? 'Published' : 'Unpublished'}
            </Badge>
          </div>
          <div className="text-sm text-zinc-400">
            <p>Plan: <span className="text-white capitalize">{sub?.plan || 'None'}</span></p>
            <p className="mt-1">Subscription: <span className="text-white capitalize">{sub?.status || 'None'}</span></p>
          </div>
        </div>

        <AdminUserActions profileId={id} isApproved={profile.is_approved} />
      </div>
    </div>
  )
}
