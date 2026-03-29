import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-zinc-400 text-sm mt-1">{profiles?.length || 0} total users</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800">
            <tr>
              <th className="text-left px-6 py-4 text-zinc-400 font-medium">Name</th>
              <th className="text-left px-6 py-4 text-zinc-400 font-medium">Username</th>
              <th className="text-left px-6 py-4 text-zinc-400 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-zinc-400 font-medium">Plan</th>
              <th className="text-left px-6 py-4 text-zinc-400 font-medium">Joined</th>
              <th className="text-left px-6 py-4 text-zinc-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {profiles?.map((profile) => {
              const sub = (profile.subscriptions as Array<{ plan: string; status: string }>)?.[0]
              return (
                <tr key={profile.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{profile.full_name || '-'}</td>
                  <td className="px-6 py-4 text-zinc-400">@{profile.username}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={profile.is_approved
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }
                    >
                      {profile.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 capitalize">{sub?.plan || '-'}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${profile.id}`}
                      className="text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
