export const BACKGROUNDS = [
  { id: 'bg_dark_gradient', name: 'Dark Gradient', className: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800' },
  { id: 'bg_teal_dark', name: 'Teal Dark', className: 'bg-gradient-to-br from-zinc-950 via-teal-950 to-zinc-900' },
  { id: 'bg_purple_dark', name: 'Purple Dark', className: 'bg-gradient-to-br from-zinc-950 via-purple-950 to-zinc-900' },
  { id: 'bg_blue_dark', name: 'Blue Dark', className: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' },
  { id: 'bg_midnight', name: 'Midnight', className: 'bg-gradient-to-b from-black via-zinc-950 to-black' },
  { id: 'bg_aurora', name: 'Aurora', className: 'bg-gradient-to-br from-teal-950 via-purple-950 to-blue-950' },
  { id: 'bg_forest', name: 'Forest', className: 'bg-gradient-to-br from-zinc-950 via-green-950 to-zinc-900' },
  { id: 'bg_sunset', name: 'Sunset', className: 'bg-gradient-to-br from-zinc-950 via-orange-950 to-zinc-900' },
  { id: 'bg_rose_dark', name: 'Rose Dark', className: 'bg-gradient-to-br from-zinc-950 via-rose-950 to-zinc-900' },
  { id: 'bg_slate', name: 'Slate', className: 'bg-gradient-to-b from-slate-900 to-slate-800' },
]

export const FONTS = [
  { id: 'font_inter', name: 'Inter', googleFont: 'Inter' },
  { id: 'font_poppins', name: 'Poppins', googleFont: 'Poppins' },
  { id: 'font_playfair', name: 'Playfair Display', googleFont: 'Playfair+Display' },
  { id: 'font_dm_sans', name: 'DM Sans', googleFont: 'DM+Sans' },
  { id: 'font_sora', name: 'Sora', googleFont: 'Sora' },
]

export const LAYOUTS = [
  { id: 'centered', name: 'Centered', description: 'Content centered with card layout' },
  { id: 'stacked', name: 'Stacked', description: 'Full-width stacked sections' },
  { id: 'minimal', name: 'Minimal', description: 'Clean minimal design, text-focused' },
]

export const PLANS = {
  individual: {
    name: 'Individual',
    setupFee: 59,
    monthlyFee: 5,
    description: 'Perfect for professionals',
    features: ['1 NFC profile', 'Up to 5 links', 'Basic analytics', 'Custom design', 'Email support'],
  },
  team: {
    name: 'Team',
    setupFee: 149,
    monthlyFee: 15,
    description: 'For small teams',
    features: ['Up to 10 NFC profiles', 'Unlimited links', 'Advanced analytics', 'Custom branding', 'Priority support'],
  },
  org: {
    name: 'Organization',
    setupFee: 299,
    monthlyFee: 39,
    description: 'For enterprises',
    features: ['Unlimited NFC profiles', 'Unlimited links', 'Full analytics suite', 'White-label option', 'Dedicated support'],
  },
}
