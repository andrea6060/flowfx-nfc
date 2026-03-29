'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BACKGROUNDS, FONTS, LAYOUTS } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function DesignPage() {
  const [design, setDesign] = useState({
    color_primary: '#0ea5e9',
    color_secondary: '#0f172a',
    color_accent: '#a855f7',
    background_id: 'bg_dark_gradient',
    font_id: 'font_inter',
    layout: 'centered',
  })
  const [profileId, setProfileId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setProfileId(user.id)
      supabase.from('design_settings').select('*').eq('profile_id', user.id).single().then(({ data }) => {
        if (data) setDesign(data)
      })
    })
  }, [])

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('design_settings').upsert({
      profile_id: profileId,
      ...design,
    }, { onConflict: 'profile_id' })
    if (error) toast.error(error.message)
    else toast.success('Design saved!')
    setLoading(false)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Design Studio</h1>
        <p className="text-zinc-400 text-sm mt-1">Customize the look of your profile</p>
      </div>

      <div className="space-y-6">
        {/* Colors */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'color_primary', label: 'Primary' },
              { key: 'color_secondary', label: 'Secondary' },
              { key: 'color_accent', label: 'Accent' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design[key as keyof typeof design] as string}
                    onChange={(e) => setDesign({ ...design, [key]: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    value={design[key as keyof typeof design] as string}
                    onChange={(e) => setDesign({ ...design, [key]: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                    maxLength={7}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backgrounds */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Background</h2>
          <div className="grid grid-cols-5 gap-3">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setDesign({ ...design, background_id: bg.id })}
                className={cn(
                  'aspect-square rounded-xl border-2 transition-all',
                  bg.className,
                  design.background_id === bg.id ? 'border-sky-400 scale-105' : 'border-zinc-700 hover:border-zinc-500'
                )}
                title={bg.name}
              />
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Font</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => setDesign({ ...design, font_id: font.id })}
                className={cn(
                  'px-4 py-3 rounded-xl border-2 text-left transition-all',
                  design.font_id === font.id
                    ? 'border-sky-400 bg-sky-500/10'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800'
                )}
              >
                <p className="text-sm font-medium">{font.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Layouts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Layout</h2>
          <div className="grid grid-cols-3 gap-3">
            {LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => setDesign({ ...design, layout: layout.id })}
                className={cn(
                  'px-4 py-4 rounded-xl border-2 text-left transition-all',
                  design.layout === layout.id
                    ? 'border-sky-400 bg-sky-500/10'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800'
                )}
              >
                <p className="text-sm font-semibold">{layout.name}</p>
                <p className="text-xs text-zinc-400 mt-1">{layout.description}</p>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl px-8"
        >
          {loading ? 'Saving...' : 'Save Design'}
        </Button>
      </div>
    </div>
  )
}
