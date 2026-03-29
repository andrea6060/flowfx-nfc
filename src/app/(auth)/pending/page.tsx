import Link from 'next/link'
import { Nfc, Clock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Nfc className="w-7 h-7 text-sky-400" />
          <span className="text-2xl font-bold">Flow FX</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10">
          <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Account Pending Approval</h1>
          <p className="text-zinc-400 mb-6">
            Thanks for signing up for Flow FX NFC! Your account is currently under review. We&apos;ll send you an email once you&apos;re approved and ready to go.
          </p>
          <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4 py-3 mb-6 justify-center">
            <Mail className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-zinc-300">Check your inbox for updates</span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:border-zinc-500 rounded-xl w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
