import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('profile_id', user.id)
    .single()

  const session = await createCheckoutSession({
    customerId: subscription?.stripe_customer_id,
    profileId: user.id,
    plan,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
  })

  return NextResponse.json({ url: session.url })
}
