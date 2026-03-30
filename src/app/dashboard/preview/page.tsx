import { createClient } from '@/lib/supabase/server'

export default async function PreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, is_published')
    .eq('id', user!.id)
    .single()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Preview</h1>
        <p className="text-zinc-400 text-sm mt-1">See how your profile looks on mobile</p>
      </div>
      <div className="flex justify-center">
        {/* iPhone frame */}
        <div className="relative w-[390px]">
          <div className="relative rounded-[3rem] border-[8px] border-zinc-700 overflow-hidden shadow-2xl bg-zinc-950">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-zinc-950 rounded-b-2xl z-10" />
            <iframe
              src={`/u/${profile?.username}?preview=true`}
              className="w-full h-[720px]"
              title="Profile Preview"
            />
          </div>
        </div>
      </div>
      <p className="text-center text-zinc-500 text-sm mt-4">
        Live preview at{' '}
        <a
          href={`/u/${profile?.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300"
        >
          flowfx.us/u/{profile?.username}
        </a>
      </p>
    </div>
  )
}
