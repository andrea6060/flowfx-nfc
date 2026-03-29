'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Trash2, Plus, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react'

interface Link {
  id: string
  label: string
  url: string
  link_type: string
  sort_order: number
  is_active: boolean
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [adding, setAdding] = useState(false)
  const [newLink, setNewLink] = useState({ label: '', url: '', link_type: 'website' })
  const [profileId, setProfileId] = useState<string>('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setProfileId(user.id)
      supabase.from('links').select('*').eq('profile_id', user.id).order('sort_order').then(({ data }) => {
        if (data) setLinks(data)
      })
    })
  }, [])

  async function addLink() {
    if (!newLink.label || !newLink.url) return
    const supabase = createClient()
    const { data, error } = await supabase.from('links').insert({
      profile_id: profileId,
      label: newLink.label,
      url: newLink.url,
      link_type: newLink.link_type,
      sort_order: links.length,
    }).select().single()
    if (error) { toast.error(error.message); return }
    setLinks([...links, data])
    setNewLink({ label: '', url: '', link_type: 'website' })
    setAdding(false)
    toast.success('Link added!')
  }

  async function deleteLink(id: string) {
    const supabase = createClient()
    await supabase.from('links').delete().eq('id', id)
    setLinks(links.filter((l) => l.id !== id))
    toast.success('Link removed')
  }

  async function toggleLink(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('links').update({ is_active: !current }).eq('id', id)
    setLinks(links.map((l) => l.id === id ? { ...l, is_active: !current } : l))
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Links</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage the links on your profile ({links.length}/5)</p>
        </div>
        {links.length < 5 && (
          <Button
            onClick={() => setAdding(true)}
            className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
        )}
      </div>

      {adding && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4 space-y-4">
          <h2 className="font-semibold">New Link</h2>
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              placeholder="e.g. Book a Call"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              placeholder="https://..."
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              value={newLink.link_type}
              onChange={(e) => setNewLink({ ...newLink, link_type: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="website">Website</option>
              <option value="social">Social</option>
              <option value="booking">Booking</option>
              <option value="cta">CTA</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={addLink} className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl">Save Link</Button>
            <Button variant="outline" onClick={() => setAdding(false)} className="border-zinc-700 rounded-xl">Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
            <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{link.label}</p>
              <p className="text-zinc-500 text-xs truncate">{link.url}</p>
            </div>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs hidden sm:block">
              {link.link_type}
            </Badge>
            <button onClick={() => toggleLink(link.id, link.is_active)} className="text-zinc-400 hover:text-white transition-colors">
              {link.is_active ? <ToggleRight className="w-5 h-5 text-sky-400" /> : <ToggleLeft className="w-5 h-5" />}
            </button>
            <button onClick={() => deleteLink(link.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {links.length === 0 && !adding && (
          <div className="text-center py-12 text-zinc-500">
            <p>No links yet. Add your first link above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
