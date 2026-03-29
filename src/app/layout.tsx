import type { Metadata } from 'next'
import { Inter, Poppins, Playfair_Display, DM_Sans, Sora } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: 'Flow FX NFC — Your Brand, Your Way',
  description: 'Professional NFC digital business cards that make a lasting impression.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} ${playfair.variable} ${dmSans.variable} ${sora.variable} font-sans bg-black text-white antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
