'use client'

import { useEffect } from 'react'
import { trackEvent } from '../lib/track'

/**
 * Counts that a page was opened. That is the whole job.
 *
 * The site is a static export on GitHub Pages, so nothing server-side can count
 * a visit. This posts one row to `record_site_event` in our own Supabase project
 * (`supabase/site-visits.sql`): a date, a name and an integer. No cookie, no
 * local/session storage, no device id, no user agent, no referrer — nothing that
 * survives the request or can be joined back to a person.
 *
 * A failure here is not worth surfacing or retrying: it is a counter, and a
 * dropped count must never look like a broken page.
 */
export default function SiteVisitBeacon() {
  useEffect(() => {
    trackEvent(window.location.pathname)
  }, [])

  return null
}
