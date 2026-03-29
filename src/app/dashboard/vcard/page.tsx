'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, Download, Link2, User } from 'lucide-react'

export default function VCardPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    title: '',
    company: '',
    suite: '',
    email_primary: '',
    email_secondary: '',
    phone_cell: '',
    phone_office: '',
    photo_url: '',
  })
  const [profileId, setProfileId] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setProfileId(user.id)
      supabase.from('profiles').select('username').eq('id', user.id).single().then(({ data }) => {
        if (data) setUsername(data.username)
      })
      supabase.from('vcards').select('*').eq('profile_id', user.id).single().then(({ data }) => {
        if (data) {
          setForm(data)
          if (data.photo_url) setPhotoPreview(data.photo_url)
          setSaved(true)
        }
      })
    })
  }, [])

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${profileId}/${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('vcard-photos')
      .upload(path, file, { upsert: true })

    if (error) {
      toast.error('Upload failed: ' + error.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vcard-photos')
      .getPublicUrl(data.path)

    setPhotoPreview(publicUrl)
    setForm((f) => ({ ...f, photo_url: publicUrl }))
    setSpinning(true)
    setTimeout(() => setSpinning(false), 2200)
  }

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('vcards').upsert(
      { profile_id: profileId, ...form },
      { onConflict: 'profile_id' }
    )
    if (error) toast.error(error.message)
    else {
      toast.success('vCard saved!')
      setSaved(true)
    }
    setLoading(false)
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/u/vcard/${username}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  return (
    <>
      <style>{`
        @keyframes spin-reveal {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(540deg); }
          40%  { transform: rotate(900deg); }
          65%  { transform: rotate(1080deg); }
          80%  { transform: rotate(1170deg); }
          90%  { transform: rotate(1215deg); }
          95%  { transform: rotate(1242deg); }
          100% { transform: rotate(1260deg); }
        }
        .spin-reveal {
          animation: spin-reveal 2.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">vCard Builder</h1>
          <p className="text-zinc-400 text-sm mt-1">Create your digital business card</p>
        </div>

        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Contact Photo</h2>
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-[200px] h-[200px] rounded-full border-2 border-zinc-700 overflow-hidden bg-zinc-800 flex items-center justify-center"
                style={{ position: 'relative' }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Contact photo"
                    className={`w-full h-full object-cover${spinning ? ' spin-reveal' : ''}`}
                    key={photoPreview}
                  />
                ) : (
                  <User className="w-20 h-20 text-zinc-600" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-zinc-700 hover:border-teal-500 hover:text-teal-400 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Contact Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={form.first_name}
                  onChange={set('first_name')}
                  placeholder="John"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={form.last_name}
                  onChange={set('last_name')}
                  placeholder="Doe"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={form.title}
                  onChange={set('title')}
                  placeholder="CEO"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={form.company}
                  onChange={set('company')}
                  placeholder="Acme Inc."
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Suite / Address <span className="text-zinc-500">(optional)</span></Label>
                <Input
                  value={form.suite}
                  onChange={set('suite')}
                  placeholder="123 Main St, Suite 400"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Email</Label>
                <Input
                  type="email"
                  value={form.email_primary}
                  onChange={set('email_primary')}
                  placeholder="john@company.com"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Email <span className="text-zinc-500">(optional)</span></Label>
                <Input
                  type="email"
                  value={form.email_secondary}
                  onChange={set('email_secondary')}
                  placeholder="john@personal.com"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Cell Phone <span className="text-zinc-500">(optional)</span></Label>
                <Input
                  type="tel"
                  value={form.phone_cell}
                  onChange={set('phone_cell')}
                  placeholder="+1 (555) 000-0000"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Office Phone <span className="text-zinc-500">(optional)</span></Label>
                <Input
                  type="tel"
                  value={form.phone_office}
                  onChange={set('phone_office')}
                  placeholder="+1 (555) 000-0001"
                  className="bg-zinc-800 border-zinc-700 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-xl py-3 font-semibold text-base"
          >
            {loading ? 'Saving...' : 'Save & Generate vCard'}
          </Button>

          {/* Post-save actions */}
          {saved && (
            <div className="flex gap-3">
              <a
                href={`/api/vcard/${profileId}`}
                download
                className="flex-1"
              >
                <Button
                  variant="outline"
                  className="w-full border-teal-600 text-teal-400 hover:bg-teal-600/10 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download vCard
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 border-zinc-700 hover:border-zinc-500 rounded-xl"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
