import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { profileId } = await req.json()

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .update({ is_approved: false })
    .eq('id', profileId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send suspension email
  await resend.emails.send({
    from: 'Flow FX <noreply@flowfx.us>',
    to: profile.email,
    subject: 'Your Flow FX account has been suspended',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1>Account Suspended</h1>
        <p>Hi ${profile.full_name},</p>
        <p>Your Flow FX account has been suspended. If you believe this is an error, please contact support.</p>
        <p style="margin-top: 24px; color: #666;">The Flow FX Team</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
