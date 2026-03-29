import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Globe, Download } from 'lucide-react'

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function PublicVCardPage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, website_url, is_published')
    .eq('username', username)
    .eq('is_published', true)
    .single()

  if (!profile) notFound()

  const { data: vcard } = await supabase
    .from('vcards')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  if (!vcard) notFound()

  const fullName = [vcard.first_name, vcard.last_name].filter(Boolean).join(' ')

  return (
    <>
      <style>{`
        @keyframes spin-reveal {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(540deg); }
          40%  { transform: rotate(900deg); }
          65%  { transform: rotate(1080deg); }
          80%  { transform: rotate(1170deg); }
          90%  { transform: rotate(1215deg); }
          95%  { transform: rotate(1242deg); }
          100% { transform: rotate(1260deg); }
        }
        .spin-reveal {
          animation: spin-reveal 2.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <div className="min-h-screen bg-zinc-950 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-sm">
          {/* Photo */}
          <div className="flex justify-center mb-6">
            {vcard.photo_url ? (
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                <img
                  src={vcard.photo_url}
                  alt={fullName}
                  className="w-full h-full object-cover spin-reveal"
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-full bg-zinc-800 border-2 border-white/10 shadow-2xl flex items-center justify-center text-5xl font-bold text-zinc-400">
                {vcard.first_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          {/* Name & Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">{fullName}</h1>
            {vcard.title && (
              <p className="text-teal-400 font-medium text-base mt-1">{vcard.title}</p>
            )}
            {vcard.company && (
              <p className="text-zinc-400 text-sm mt-0.5">{vcard.company}</p>
            )}
            {vcard.suite && (
              <p className="text-zinc-500 text-xs mt-1">{vcard.suite}</p>
            )}
          </div>

          {/* Contact info */}
          {(vcard.email_primary || vcard.phone_cell || vcard.phone_office) && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-5 space-y-2">
              {vcard.email_primary && (
                <a
                  href={`mailto:${vcard.email_primary}`}
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide w-14">Email</span>
                  <span>{vcard.email_primary}</span>
                </a>
              )}
              {vcard.email_secondary && (
                <a
                  href={`mailto:${vcard.email_secondary}`}
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide w-14">Alt</span>
                  <span>{vcard.email_secondary}</span>
                </a>
              )}
              {vcard.phone_cell && (
                <a
                  href={`tel:${vcard.phone_cell}`}
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide w-14">Cell</span>
                  <span>{vcard.phone_cell}</span>
                </a>
              )}
              {vcard.phone_office && (
                <a
                  href={`tel:${vcard.phone_office}`}
                  className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide w-14">Office</span>
                  <span>{vcard.phone_office}</span>
                </a>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={`/api/vcard/${profile.id}`}
              download
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-teal-900/30"
            >
              <Download className="w-4 h-4" />
              Save Contact
            </a>

            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-medium text-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </a>
            )}
          </div>

          <p className="text-center text-zinc-600 text-xs mt-10">
            Powered by FlowFX.us
          </p>
        </div>
      </div>
    </>
  )
}
