import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function createCheckoutSession({
  customerId,
  profileId,
  plan,
  successUrl,
  cancelUrl,
}: {
  customerId?: string
  profileId: string
  plan: 'individual' | 'team' | 'org'
  successUrl: string
  cancelUrl: string
}) {
  const prices = {
    individual: { setup: 5900, monthly: 500 },
    team: { setup: 14900, monthly: 1500 },
    org: { setup: 29900, monthly: 3900 },
  }

  const planPrices = prices[plan]

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Flow FX NFC - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          },
          unit_amount: planPrices.monthly,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { profileId, plan },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}

export function constructWebhookEvent(payload: string, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
