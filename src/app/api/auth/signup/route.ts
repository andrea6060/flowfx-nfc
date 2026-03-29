import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password, fullName, username } = await request.json()

  // Use admin client to bypass RLS for profile creation
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const supabase = await createClient()

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (data.user) {
    // Use admin client to insert profile (bypasses RLS)
    const { error: profileError } = await adminClient.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      email,
      username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      is_approved: false,
      is_published: false,
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }
  }

  return NextResponse.json({ success: true })
}
