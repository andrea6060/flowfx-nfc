'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Record<string, string | boolean>>({})
  const [loading, setLoading] = useState(false)
  const [bioLength, setBioLength] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setProfile(data)
          setBioLength((data.bio as string)?.length || 0)
        }
      })
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      job_title: profile.job_title,
      company: profile.company,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone,
      website_url: profile.website_url,
      is_published: profile.is_published,
    }).eq('id', user.id)

    if (error) toast.error(error.message)
    else toast.success('Profile saved!')
    setLoading(false)
  }

  function updateField(field: string, value: string | boolean) {
    setProfile((prev) => ({ ...prev, [field]: value }))
    if (field === 'bio') setBioLength((value as string).length)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-zinc-400 text-sm mt-1">Update your public profile information</p>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={(profile.full_name as string) || ''}
                onChange={(e) => updateField('full_name', e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                value={(profile.job_title as string) || ''}
                onChange={(e) => updateField('job_title', e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              value={(profile.company as string) || ''}
              onChange={(e) => updateField('company', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Bio</Label>
              <span className={`text-xs ${bioLength > 150 ? 'text-orange-400' : 'text-zinc-500'}`}>
                {bioLength}/160
              </span>
            </div>
            <Textarea
              value={(profile.bio as string) || ''}
              onChange={(e) => updateField('bio', e.target.value)}
              maxLength={160}
              rows={3}
              className="bg-zinc-800 border-zinc-700 resize-none"
              placeholder="A short bio that appears on your profile..."
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Contact Information</h2>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={(profile.email as string) || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              value={(profile.phone as string) || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input
              type="url"
              value={(profile.website_url as string) || ''}
              onChange={(e) => updateField('website_url', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Publish Profile</p>
              <p className="text-zinc-400 text-sm">Make your profile visible to the public</p>
            </div>
            <Switch
              checked={!!profile.is_published}
              onCheckedChange={(v) => updateField('is_published', v)}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl px-8">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
