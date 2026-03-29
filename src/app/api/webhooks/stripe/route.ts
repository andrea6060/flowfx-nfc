import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event
  try {
    event = constructWebhookEvent(payload, signature)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as unknown as { metadata: { profileId: string; plan: string }; customer: string; subscription: string }
      const { profileId, plan } = session.metadata
      await supabase.from('subscriptions').upsert({
        profile_id: profileId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        plan,
        status: 'active',
        setup_fee_paid: true,
      }, { onConflict: 'profile_id' })
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as unknown as { id: string }
      await supabase.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', sub.id)
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as unknown as { subscription: string }
      await supabase.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', invoice.subscription)
      break
    }
  }

  return NextResponse.json({ received: true })
}
