'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AnalyticsTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    const supabase = createClient()

    // Track page view
    supabase.from('analytics_events').insert({
      profile_id: profileId,
      event_type: 'page_view',
      referrer: document.referrer || null,
    }).then()

    // Track link clicks
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-link-id]')
      if (target) {
        const linkId = target.getAttribute('data-link-id')
        supabase.from('analytics_events').insert({
          profile_id: profileId,
          event_type: 'link_click',
          link_id: linkId,
        }).then()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [profileId])

  return null
}
