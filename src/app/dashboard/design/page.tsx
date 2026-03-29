'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BACKGROUNDS, FONTS, LAYOUTS } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const BUTTON_STYLES = [
  { id: 'solid', label: 'Solid', description: 'Filled with primary color' },
  { id: 'outline', label: 'Outline', description: 'Border only' },
  { id: 'soft', label: 'Soft', description: 'Light tint fill' },
  { id: 'gradient', label: 'Gradient', description: 'Primary to accent' },
]

const BORDER_THICKNESSES = [
  { value: 1, label: 'Thin' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Thick' },
  { value: 4, label: 'Bold' },
]

const GRADIENT_DIRECTIONS = [
  { id: 'to-right', label: 'Left → Right' },
  { id: 'to-bottom', label: 'Top → Bottom' },
  { id: 'diagonal', label: 'Diagonal' },
]

const BORDER_RADII = [
  { id: 'square', label: 'Square', className: 'rounded-none' },
  { id: 'soft', label: 'Soft', className: 'rounded-lg' },
  { id: 'pill', label: 'Pill', className: 'rounded-full' },
]

export default function DesignPage() {
  const [design, setDesign] = useState({
    color_primary: '#0ea5e9',
    color_secondary: '#0f172a',
    color_accent: '#a855f7',
    background_id: 'bg_dark_gradient',
    font_id: 'font_inter',
    layout: 'centered',
    button_style: 'solid',
    button_border_thickness: 2,
    button_gradient_direction: 'to-right',
    button_radius: 'pill',
  })
  const [profileId, setProfileId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setProfileId(user.id)
      supabase.from('design_settings').select('*').eq('profile_id', user.id).single().then(({ data }) => {
        if (data) setDesign((prev) => ({ ...prev, ...data }))
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

  // Button preview style
  const radiusMap: Record<string, string> = { square: '0', soft: '12px', pill: '9999px' }
  const previewRadius = radiusMap[design.button_radius] || '9999px'
  const previewStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = { borderRadius: previewRadius }
    if (design.button_style === 'solid') return { ...base, background: design.color_primary, color: '#fff' }
    if (design.button_style === 'outline') return { ...base, background: 'transparent', color: design.color_primary, border: `${design.button_border_thickness}px solid ${design.color_primary}` }
    if (design.button_style === 'soft') return { ...base, background: design.color_primary + '30', color: design.color_primary }
    if (design.button_style === 'gradient') {
      const dirMap: Record<string, string> = { 'to-right': '90deg', 'to-bottom': '180deg', 'diagonal': '135deg' }
      const angle = dirMap[design.button_gradient_direction] || '90deg'
      return { ...base, background: `linear-gradient(${angle}, ${design.color_primary}, ${design.color_accent})`, color: '#fff' }
    }
    return base
  })()

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

        {/* Buttons */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold mb-1">Buttons</h2>
          <p className="text-zinc-500 text-xs mb-5">Style the link buttons on your profile</p>

          {/* Preview */}
          <div className="flex justify-center mb-6">
            <button
              className="px-8 py-3 text-sm font-semibold transition-all"
              style={previewStyle}
            >
              Preview Button
            </button>
          </div>

          {/* Button Style */}
          <div className="mb-5">
            <Label className="mb-3 block">Style</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BUTTON_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setDesign({ ...design, button_style: s.id })}
                  className={cn(
                    'px-4 py-3 rounded-xl border-2 text-left transition-all',
                    design.button_style === s.id
                      ? 'border-sky-400 bg-sky-500/10'
                      : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800'
                  )}
                >
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Border thickness (outline only) */}
          {design.button_style === 'outline' && (
            <div className="mb-5">
              <Label className="mb-3 block">Border Thickness</Label>
              <div className="flex gap-3">
                {BORDER_THICKNESSES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setDesign({ ...design, button_border_thickness: t.value })}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                      design.button_border_thickness === t.value
                        ? 'border-sky-400 bg-sky-500/10 text-sky-400'
                        : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800 text-zinc-400'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gradient direction (gradient only) */}
          {design.button_style === 'gradient' && (
            <div className="mb-5">
              <Label className="mb-3 block">Gradient Direction</Label>
              <div className="flex gap-3">
                {GRADIENT_DIRECTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDesign({ ...design, button_gradient_direction: d.id })}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                      design.button_gradient_direction === d.id
                        ? 'border-sky-400 bg-sky-500/10 text-sky-400'
                        : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800 text-zinc-400'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Border Radius */}
          <div>
            <Label className="mb-3 block">Border Radius</Label>
            <div className="flex gap-3">
              {BORDER_RADII.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setDesign({ ...design, button_radius: r.id })}
                  className={cn(
                    'flex-1 py-2.5 border-2 text-sm font-medium transition-all',
                    r.className,
                    design.button_radius === r.id
                      ? 'border-sky-400 bg-sky-500/10 text-sky-400'
                      : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800 text-zinc-400'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
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
