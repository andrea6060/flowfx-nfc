import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: vcard, error } = await supabase
    .from('vcards')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  if (error || !vcard) {
    return NextResponse.json({ error: 'vCard not found' }, { status: 404 })
  }

  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']

  const fullName = [vcard.first_name, vcard.last_name].filter(Boolean).join(' ')
  if (fullName) lines.push(`FN:${fullName}`)
  lines.push(`N:${vcard.last_name || ''};${vcard.first_name || ''};;;`)

  if (vcard.company) lines.push(`ORG:${vcard.company}`)
  if (vcard.title) lines.push(`TITLE:${vcard.title}`)
  if (vcard.email_primary) lines.push(`EMAIL;TYPE=WORK,INTERNET:${vcard.email_primary}`)
  if (vcard.email_secondary) lines.push(`EMAIL;TYPE=HOME,INTERNET:${vcard.email_secondary}`)
  if (vcard.phone_cell) lines.push(`TEL;TYPE=CELL:${vcard.phone_cell}`)
  if (vcard.phone_office) lines.push(`TEL;TYPE=WORK:${vcard.phone_office}`)
  if (vcard.suite) lines.push(`ADR;TYPE=WORK:;;${vcard.suite};;;;`)
  if (vcard.photo_url) lines.push(`PHOTO;VALUE=URL:${vcard.photo_url}`)

  lines.push('END:VCARD')

  const vcf = lines.join('\r\n')
  const firstName = vcard.first_name || 'contact'
  const lastName = vcard.last_name || ''
  const filename = `${firstName}${lastName ? '-' + lastName : ''}.vcf`.toLowerCase()

  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
