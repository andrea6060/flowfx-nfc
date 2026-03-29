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
    .update({ is_approved: true })
    .eq('id', profileId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send approval email
  await resend.emails.send({
    from: 'Flow FX <noreply@flowfx.us>',
    to: profile.email,
    subject: 'Your Flow FX account is approved!',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1>Welcome to Flow FX NFC! 🎉</h1>
        <p>Hi ${profile.full_name},</p>
        <p>Great news — your account has been approved! You can now log in and start building your digital business card profile.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; margin-top: 16px;">Log in to Flow FX</a>
        <p style="margin-top: 24px; color: #666;">Welcome to the team,<br/>The Flow FX Team</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
