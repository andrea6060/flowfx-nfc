import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, ExternalLink } from 'lucide-react'
import { PLANS } from '@/lib/constants'
import Link from 'next/link'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('profile_id', user!.id)
    .single()

  const plan = subscription?.plan ? PLANS[subscription.plan as keyof typeof PLANS] : null

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your subscription</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-sky-400" />
          <h2 className="font-semibold">Current Plan</h2>
        </div>
        {subscription ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-xl font-bold">{plan?.name || subscription.plan} Plan</p>
              <Badge
                className={`${
                  subscription.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  subscription.status === 'past_due' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {subscription.status}
              </Badge>
            </div>
            {plan && (
              <p className="text-zinc-400 text-sm">${plan.monthlyFee}/month</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-zinc-400 mb-4">No active subscription.</p>
            <Link href="/api/checkout">
              <Button className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl">
                Choose a Plan
              </Button>
            </Link>
          </div>
        )}
      </div>

      {subscription?.stripe_customer_id && (
        <form action="/api/portal" method="POST">
          <Button type="submit" variant="outline" className="border-zinc-700 text-zinc-300 hover:border-zinc-500 rounded-xl">
            <ExternalLink className="w-4 h-4 mr-2" />
            Manage Billing
          </Button>
        </form>
      )}
    </div>
  )
}
