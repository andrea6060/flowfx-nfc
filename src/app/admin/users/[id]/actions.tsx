'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'
import { CheckCircle2, Ban } from 'lucide-react'

export default function AdminUserActions({
  profileId,
  isApproved,
}: {
  profileId: string
  isApproved: boolean
}) {
  const [approved, setApproved] = useState(isApproved)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleApprove() {
    setLoading('approve')
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId }),
    })
    if (res.ok) {
      setApproved(true)
      toast.success('User approved and email sent!')
    } else {
      toast.error('Failed to approve user')
    }
    setLoading(null)
  }

  async function handleSuspend() {
    setLoading('suspend')
    const res = await fetch('/api/admin/suspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId }),
    })
    if (res.ok) {
      setApproved(false)
      toast.success('User suspended')
    } else {
      toast.error('Failed to suspend user')
    }
    setLoading(null)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="font-semibold mb-4">Actions</h2>
      <div className="flex gap-3">
        {!approved && (
          <Button
            onClick={handleApprove}
            disabled={loading === 'approve'}
            className="bg-green-600 hover:bg-green-500 text-white rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {loading === 'approve' ? 'Approving...' : 'Approve User'}
          </Button>
        )}
        {approved && (
          <Button
            onClick={handleSuspend}
            disabled={loading === 'suspend'}
            variant="destructive"
            className="rounded-xl"
          >
            <Ban className="w-4 h-4 mr-2" />
            {loading === 'suspend' ? 'Suspending...' : 'Suspend User'}
          </Button>
        )}
      </div>
    </div>
  )
}
