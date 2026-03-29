import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BACKGROUNDS, FONTS } from '@/lib/constants'
import { Mail, Phone, Globe, ExternalLink } from 'lucide-react'
import AnalyticsTracker from './analytics-tracker'
import type { CSSProperties } from 'react'

interface PageProps {
  params: Promise<{ username: string }>
}

function getButtonStyle(design: Record<string, unknown> | null): CSSProperties {
  const primary = (design?.color_primary as string) || '#0ea5e9'
  const accent = (design?.color_accent as string) || '#a855f7'
  const style = (design?.button_style as string) || 'solid'
  const radiusMap: Record<string, string> = { square: '0', soft: '12px', pill: '9999px' }
  const radius = radiusMap[(design?.button_radius as string) || 'pill'] || '9999px'
  const thickness = (design?.button_border_thickness as number) || 2

  if (style === 'outline') {
    return { borderRadius: radius, backgroundColor: 'transparent', color: primary, border: `${thickness}px solid ${primary}` }
  }
  if (style === 'soft') {
    return { borderRadius: radius, backgroundColor: primary + '30', color: primary }
  }
  if (style === 'gradient') {
    const dir = (design?.button_gradient_direction as string) || 'to-right'
    const dirMap: Record<string, string> = { 'to-right': '90deg', 'to-bottom': '180deg', 'diagonal': '135deg' }
    const angle = dirMap[dir] || '90deg'
    return { borderRadius: radius, background: `linear-gradient(${angle}, ${primary}, ${accent})`, color: '#fff' }
  }
  // solid (default)
  return { borderRadius: radius, backgroundColor: primary, color: '#fff' }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_published', true)
    .single()

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const { data: design } = await supabase
    .from('design_settings')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  const bg = BACKGROUNDS.find((b) => b.id === design?.background_id) || BACKGROUNDS[0]
  const font = FONTS.find((f) => f.id === design?.font_id) || FONTS[0]
  const primaryColor = design?.color_primary || '#0ea5e9'
  const buttonStyle = getButtonStyle(design as Record<string, unknown> | null)

  return (
    <div className={`min-h-screen ${bg.className} flex items-start justify-center py-10 px-4`}
      style={{ fontFamily: font.googleFont }}
    >
      <AnalyticsTracker profileId={profile.id} />
      <div className="w-full max-w-sm">
        {/* Profile Card */}
        <div className="text-center mb-6">
          {/* Profile Photo */}
          {profile.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt={profile.full_name || 'Profile'}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/20 shadow-xl"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-xl"
              style={{ backgroundColor: primaryColor }}
            >
              {profile.full_name?.[0]?.toUpperCase() || '?'}
            </div>
          )}

          <h1 className="text-2xl font-bold text-white mb-1">{profile.full_name}</h1>
          {profile.job_title && (
            <p className="text-white/70 text-sm">{profile.job_title}</p>
          )}
          {profile.company && (
            <p className="text-white/50 text-xs mt-0.5">{profile.company}</p>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-white/70 text-sm text-center mb-6 leading-relaxed px-2">
            {profile.bio}
          </p>
        )}

        {/* Contact Icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Mail className="w-4 h-4 text-white" />
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Phone className="w-4 h-4 text-white" />
            </a>
          )}
          {profile.website_url && (
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Globe className="w-4 h-4 text-white" />
            </a>
          )}
        </div>

        {/* Links */}
        {links && links.length > 0 && (
          <div className="space-y-3 mb-8">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-link-id={link.id}
                className="link-btn flex items-center justify-between w-full px-5 py-4 font-medium text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={buttonStyle}
              >
                <span>{link.label}</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            ))}
          </div>
        )}

        {/* Logo */}
        {profile.logo_url && (
          <div className="flex justify-center mt-8">
            <img
              src={profile.logo_url}
              alt="Logo"
              className="h-8 object-contain opacity-70"
            />
          </div>
        )}

        {/* Powered by */}
        <p className="text-center text-white/30 text-xs mt-8">
          Powered by FlowFX.us
        </p>
      </div>
    </div>
  )
}
