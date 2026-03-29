import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/constants'
import { Zap, Palette, BarChart3, CheckCircle2, ArrowRight, Nfc } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-zinc-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Nfc className="w-6 h-6 text-sky-400" />
            <span className="font-bold text-xl">Flow FX</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-sky-500/10 text-sky-400 border-sky-500/20 px-4 py-1.5">
            NFC Digital Business Cards
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your NFC Card.{' '}
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
              Your Brand.
            </span>{' '}
            Your Way.
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Create a stunning digital profile that lives on your NFC card. One tap — and your full brand story is shared instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-white rounded-xl px-8 py-6 text-lg">
                Start Building <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:border-zinc-500 rounded-xl px-8 py-6 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to make an impression</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-sky-400" />,
                title: 'Easy Setup',
                desc: 'Go live in minutes. Upload your photo, add your links, choose your design — done.',
              },
              {
                icon: <Palette className="w-8 h-8 text-purple-400" />,
                title: 'Beautiful Designs',
                desc: '10 premium backgrounds, 5 fonts, custom colors. Your profile, your aesthetic.',
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-teal-400" />,
                title: 'Smart Analytics',
                desc: 'See who viewed your profile and what they clicked. Real data, real insights.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-zinc-400 text-center mb-12">One-time setup fee + low monthly subscription</p>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(PLANS).map(([key, plan], i) => (
              <div
                key={key}
                className={`rounded-2xl p-8 border ${
                  i === 1
                    ? 'bg-gradient-to-b from-sky-500/10 to-purple-500/10 border-sky-500/40'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {i === 1 && (
                  <Badge className="mb-4 bg-sky-500/20 text-sky-400 border-sky-500/30">Most Popular</Badge>
                )}
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.setupFee}</span>
                  <span className="text-zinc-400"> setup + </span>
                  <span className="text-2xl font-semibold">${plan.monthlyFee}/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    className={`w-full rounded-xl py-5 ${
                      i === 1
                        ? 'bg-sky-500 hover:bg-sky-400 text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Nfc className="w-5 h-5 text-sky-400" />
            <span className="font-semibold">Flow FX NFC</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 FlowFX.us — All rights reserved</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
